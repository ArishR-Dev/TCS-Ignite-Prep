import pptxgen from 'pptxgenjs';
import { Slide } from '../types';

export async function exportToPPTX(slides: Slide[], onProgress?: (progress: number) => void): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'TCS Ignite Interview Preparation — Subashini';
  pptx.subject = 'TCS B.Sc Ignite Technical & HR Interview Handbook';
  pptx.author = 'Prepared for Subashini (ARISH)';

  const BG_COLOR = '0B0F19';
  const CARD_BG = '141B2D';
  const ACCENT_CYAN = '06B6D4';
  const ACCENT_BLUE = '38BDF8';
  const TEXT_WHITE = 'F8FAFC';
  const TEXT_MUTED = '94A3B8';
  const CODE_BG = '0F172A';

  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const pptxSlide = pptx.addSlide();
    pptxSlide.background = { color: BG_COLOR };

    // Slide Header Bar
    pptxSlide.addShape(pptx.ShapeType.rect, {
      x: 0.5,
      y: 0.4,
      w: 12.33,
      h: 0.05,
      fill: { color: ACCENT_CYAN }
    });

    // Category / Section Title
    pptxSlide.addText(s.sectionTitle.toUpperCase(), {
      x: 0.5,
      y: 0.5,
      w: 10.0,
      h: 0.35,
      fontSize: 10,
      color: ACCENT_CYAN,
      fontFace: 'Arial',
      bold: true
    });

    // Slide Number & Watermark
    pptxSlide.addText(`Slide ${s.slideNumber} / ${slides.length} • Subashini's TCS Ignite Handbook`, {
      x: 8.0,
      y: 0.5,
      w: 4.8,
      h: 0.35,
      fontSize: 9,
      color: TEXT_MUTED,
      fontFace: 'Arial',
      align: 'right'
    });

    // Main Title
    pptxSlide.addText(s.slideTitle, {
      x: 0.5,
      y: 0.85,
      w: 12.33,
      h: 0.6,
      fontSize: s.isDivider ? 26 : 20,
      color: TEXT_WHITE,
      fontFace: 'Arial',
      bold: true
    });

    // Subtitle if available
    if (s.slideSubtitle) {
      pptxSlide.addText(s.slideSubtitle, {
        x: 0.5,
        y: 1.45,
        w: 12.33,
        h: 0.35,
        fontSize: 12,
        color: ACCENT_BLUE,
        fontFace: 'Arial',
        italic: true
      });
    }

    let currentY = s.slideSubtitle ? 1.9 : 1.6;

    // Divider slide layout
    if (s.isDivider) {
      if (s.content.paragraphs) {
        pptxSlide.addText(s.content.paragraphs.join('\n\n'), {
          x: 0.8,
          y: currentY + 0.3,
          w: 11.5,
          h: 2.2,
          fontSize: 14,
          color: TEXT_WHITE,
          fontFace: 'Arial',
          lineSpacing: 22
        });
      }

      if (s.content.keyNotes) {
        pptxSlide.addText(s.content.keyNotes.map(k => `✓ ${k}`).join('\n'), {
          x: 0.8,
          y: currentY + 2.7,
          w: 11.5,
          h: 1.5,
          fontSize: 12,
          color: ACCENT_CYAN,
          fontFace: 'Arial',
          bold: true
        });
      }
      continue;
    }

    // Paragraphs
    if (s.content.paragraphs && s.content.paragraphs.length > 0) {
      const pText = s.content.paragraphs.join('\n');
      pptxSlide.addText(pText, {
        x: 0.5,
        y: currentY,
        w: 12.33,
        h: Math.min(1.8, s.content.paragraphs.length * 0.35 + 0.3),
        fontSize: 11,
        color: TEXT_WHITE,
        fontFace: 'Arial',
        lineSpacing: 18
      });
      currentY += Math.min(2.0, s.content.paragraphs.length * 0.35 + 0.4);
    }

    // Code Blocks
    if (s.content.codeBlocks && s.content.codeBlocks.length > 0) {
      for (const cb of s.content.codeBlocks) {
        if (currentY > 6.0) break;
        if (cb.title) {
          pptxSlide.addText(cb.title, {
            x: 0.5,
            y: currentY,
            w: 12.33,
            h: 0.3,
            fontSize: 10,
            color: ACCENT_CYAN,
            fontFace: 'Courier New',
            bold: true
          });
          currentY += 0.35;
        }

        const lines = cb.code.split('\n').length;
        const codeHeight = Math.min(2.4, lines * 0.22 + 0.3);

        pptxSlide.addShape(pptx.ShapeType.roundRect, {
          x: 0.5,
          y: currentY,
          w: 12.33,
          h: codeHeight,
          fill: { color: CODE_BG },
          line: { color: '334155', width: 1 }
        });

        pptxSlide.addText(cb.code, {
          x: 0.6,
          y: currentY + 0.1,
          w: 12.1,
          h: codeHeight - 0.2,
          fontSize: 9.5,
          color: '38BDF8',
          fontFace: 'Courier New'
        });
        currentY += codeHeight + 0.2;
      }
    }

    // Tables
    if (s.content.tables && s.content.tables.length > 0) {
      for (const tbl of s.content.tables) {
        if (currentY > 6.0) break;
        if (tbl.title) {
          pptxSlide.addText(tbl.title, {
            x: 0.5,
            y: currentY,
            w: 12.33,
            h: 0.3,
            fontSize: 11,
            color: ACCENT_BLUE,
            fontFace: 'Arial',
            bold: true
          });
          currentY += 0.35;
        }

        const tableRows = [
          tbl.headers.map(h => ({
            text: h,
            options: { bold: true, fill: { color: '1E293B' }, color: ACCENT_CYAN, fontSize: 10 }
          })),
          ...tbl.rows.map((row, rIdx) =>
            row.map(cell => ({
              text: cell,
              options: {
                fill: { color: rIdx % 2 === 0 ? '0F172A' : '141E33' },
                color: TEXT_WHITE,
                fontSize: 9.5
              }
            }))
          )
        ];

        pptxSlide.addTable(tableRows, {
          x: 0.5,
          y: currentY,
          w: 12.33,
          rowH: 0.28,
          border: { pt: 0.5, color: '334155' }
        });

        currentY += (tableRows.length * 0.32) + 0.3;
      }
    }

    // Callouts (Interview Answer, Remember, Warnings)
    if (s.content.callouts && s.content.callouts.length > 0) {
      for (const callout of s.content.callouts) {
        if (currentY > 6.2) break;
        const calloutH = Math.min(1.8, callout.content.split('\n').length * 0.3 + 0.4);

        pptxSlide.addShape(pptx.ShapeType.roundRect, {
          x: 0.5,
          y: currentY,
          w: 12.33,
          h: calloutH,
          fill: { color: CARD_BG },
          line: { color: callout.type === 'interview' ? '10B981' : callout.type === 'warning' ? 'F59E0B' : ACCENT_CYAN, width: 1.5 }
        });

        pptxSlide.addText(`${callout.label}\n${callout.content}`, {
          x: 0.7,
          y: currentY + 0.08,
          w: 11.9,
          h: calloutH - 0.16,
          fontSize: 9.5,
          color: TEXT_WHITE,
          fontFace: 'Arial'
        });

        currentY += calloutH + 0.2;
      }
    }

    if (onProgress) {
      onProgress(Math.round(((i + 1) / slides.length) * 100));
    }
  }

  await pptx.writeFile({ fileName: 'Subashini_TCS_Ignite_Interview_Handbook.pptx' });
}
