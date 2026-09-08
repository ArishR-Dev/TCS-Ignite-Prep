import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import pptxgen from 'pptxgenjs';
import { Slide } from '../types';
import { SlideViewer } from '../components/SlideViewer';
import { domToPng } from 'modern-screenshot';
import { toPng as htmlToPng } from 'html-to-image';

export interface ExportProgress {
  percent: number;
  message: string;
  currentSlide?: number;
  totalSlides?: number;
}

/**
 * Pixel-Perfect PowerPoint Exporter
 * 
 * Accurately renders each slide in the presentation using the existing React
 * SlideViewer component in high-resolution 16:9 widescreen format (1920x1080),
 * captures it directly as a crisp PNG, and embeds it as a borderless full-slide
 * image into a standard 13.333" x 7.5" 16:9 widescreen PowerPoint presentation.
 */
export async function exportToPPTX(
  slides: Slide[],
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  const total = slides.length;
  if (total === 0) {
    throw new Error('No slides found to export.');
  }

  onProgress?.({
    percent: 0,
    message: 'Preparing PowerPoint...',
    currentSlide: 0,
    totalSlides: total
  });

  // Ensure initial web fonts have completed loading before rendering begins
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('Font loading check timed out or failed', e);
    }
  }

  // Create an offscreen desktop sandbox container with exact 1920x1080 dimensions
  const container = document.createElement('div');
  container.id = 'pptx-export-sandbox';
  container.style.cssText = [
    'position: fixed',
    'left: 0',
    'top: 0',
    'width: 1920px',
    'height: 1080px',
    'z-index: -9999',
    'pointer-events: none',
    'overflow: hidden',
    'background-color: #0b0f19',
    'box-sizing: border-box'
  ].join(';');

  document.body.appendChild(container);
  const root = createRoot(container);

  // Initialize PPTX presentation with widescreen 16:9 layout (13.333" x 7.5")
  const pptx = new pptxgen();
  pptx.defineLayout({ name: 'WIDE_16_9', width: 13.333, height: 7.5 });
  pptx.layout = 'WIDE_16_9';
  pptx.title = 'TCS Ignite Interview Preparation Handbook';
  pptx.subject = 'TCS B.Sc Ignite Technical & HR Interview Handbook';
  pptx.author = 'TCS Ignite Prep';

  try {
    for (let i = 0; i < total; i++) {
      const slide = slides[i];
      const slideNum = i + 1;
      const percent = Math.round((i / total) * 88);

      onProgress?.({
        percent,
        message: `Rendering slide ${slideNum} / ${total}: "${slide.slideTitle}"`,
        currentSlide: slideNum,
        totalSlides: total
      });

      // Synchronously commit slide component rendering to the DOM with isExportMode=true
      flushSync(() => {
        root.render(
          <SlideViewer
            slide={slide}
            totalSlides={total}
            isExportMode={true}
          />
        );
      });

      // Wait for fonts & DOM paint
      if (document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }
      await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 60)));

      // Locate the slide container canvas
      const targetElement = (container.querySelector('#slide-canvas') as HTMLElement) || container;

      // High-resolution capture
      let dataUrl = '';
      try {
        dataUrl = await domToPng(targetElement, {
          width: 1920,
          height: 1080,
          scale: 1,
          quality: 0.98,
          backgroundColor: '#0b0f19'
        });
      } catch (err) {
        console.warn(`modern-screenshot failed on slide ${slideNum}, trying html-to-image fallback:`, err);
        try {
          dataUrl = await htmlToPng(targetElement, {
            width: 1920,
            height: 1080,
            pixelRatio: 1,
            backgroundColor: '#0b0f19',
            skipFonts: true
          });
        } catch (fallbackErr) {
          console.error(`Failed to capture slide ${slideNum}`, fallbackErr);
          throw new Error(`Failed to capture slide ${slideNum}: ${slide.slideTitle}`);
        }
      }

      // Add full-bleed 16:9 slide image without margins
      const pptSlide = pptx.addSlide();
      pptSlide.background = { color: '0B0F19' };
      pptSlide.addImage({
        data: dataUrl,
        x: 0,
        y: 0,
        w: 13.333,
        h: 7.5
      });

      // Cooperative yield to keep browser responsive and allow memory cleanup
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    onProgress?.({
      percent: 92,
      message: 'Creating PowerPoint...',
      currentSlide: total,
      totalSlides: total
    });

    onProgress?.({
      percent: 96,
      message: 'Finalizing download...',
      currentSlide: total,
      totalSlides: total
    });

    // Write file using clean standard naming
    await pptx.writeFile({ fileName: 'TCS_Ignite_Interview_Handbook.pptx' });

    onProgress?.({
      percent: 100,
      message: 'PowerPoint ready',
      currentSlide: total,
      totalSlides: total
    });
  } finally {
    // Safely unmount and remove the export sandbox
    try {
      root.unmount();
    } catch (e) {
      console.warn('Sandbox root unmount error', e);
    }
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
