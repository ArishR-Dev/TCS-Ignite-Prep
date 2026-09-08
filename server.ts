import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Live Web Research Helper for outside information and up-to-date queries
async function performWebResearch(query: string): Promise<{ summary: string; sources: Array<{ title: string; url: string }> }> {
  const cleanQuery = query
    .replace(/(search (the )?(current )?(tcs website|website|web|internet|online)|google this|look up online|please|tell me|what is|who is)/gi, '')
    .trim() || query;

  const sources: Array<{ title: string; url: string }> = [];
  let summary = '';

  // Special enrichment for TCS Ignite hiring queries
  if (/tcs|ignite/i.test(query)) {
    sources.push({
      title: 'TCS NextStep Portal & Ignite Hiring',
      url: 'https://nextstep.tcs.com/campus/'
    });
    sources.push({
      title: 'Tata Consultancy Services Careers',
      url: 'https://www.tcs.com/careers'
    });
  }

  // 1. DuckDuckGo Instant Answers
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}&format=json&no_html=1&skip_disambig=1`);
    if (res.ok) {
      const data: any = await res.json();
      if (data.AbstractText) {
        summary += `${data.Heading ? `${data.Heading}: ` : ''}${data.AbstractText}\n`;
        if (data.AbstractURL) {
          sources.push({ title: data.Heading || cleanQuery, url: data.AbstractURL });
        }
      }
      if (Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, 3)) {
          if (topic.Text && topic.FirstURL) {
            summary += `• ${topic.Text}\n`;
            sources.push({ title: topic.Text.slice(0, 45) + '...', url: topic.FirstURL });
          }
        }
      }
    }
  } catch (err: any) {
    console.log('[Web Research] DuckDuckGo lookup notice:', err?.message || err);
  }

  // 2. Wikipedia search fallback for tech & authoritative topics
  if (!summary) {
    try {
      const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQuery)}&limit=2&namespace=0&format=json`);
      if (wikiRes.ok) {
        const wikiData: any = await wikiRes.json();
        if (Array.isArray(wikiData) && wikiData[1]?.length > 0) {
          const titles = wikiData[1];
          const snippets = wikiData[2];
          const urls = wikiData[3];
          for (let i = 0; i < titles.length; i++) {
            if (snippets[i]) summary += `• ${titles[i]}: ${snippets[i]}\n`;
            if (urls[i]) sources.push({ title: titles[i], url: urls[i] });
          }
        }
      }
    } catch (err: any) {
      console.log('[Web Research] Wikipedia lookup notice:', err?.message || err);
    }
  }

  return { summary: summary.trim(), sources };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Eunchae AI Assistant Endpoint
  app.post('/api/niki/chat', async (req, res) => {
    try {
      const {
        message,
        history = [],
        dynamicContext = null,
        currentSlideContext = null,
        retrievedChunks = [],
        retrievedContext = '',
        routingDecision = null,
        mode = 'chat'
      } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const client = getGeminiClient();
      if (!client) {
        res.status(200).json({
          fallback: true,
          notice: 'Gemini API key is not configured. Utilizing local website knowledge engine.'
        });
        return;
      }

      const serverStartTime = Date.now();

      // Determine routing and web research requirements
      const shouldWebSearch = routingDecision?.needsWebSearch === true ||
        /(search (the )?(current )?(tcs website|website|web|internet|online)|look up online|google this|latest ignite|ignite hiring|latest version|in 2026|current ceo|who is the ceo|current market|latest news|current trend)/i.test(message);

      let webResearchData = { summary: '', sources: [] as Array<{ title: string; url: string }> };
      if (shouldWebSearch) {
        webResearchData = await performWebResearch(message);
      }

      // Determine primary source label
      let primarySource: 'current_website' | 'study_material' | 'web_research' = 'current_website';
      if (shouldWebSearch && webResearchData.sources.length > 0) {
        primarySource = 'web_research';
      } else if (routingDecision?.primarySource) {
        primarySource = routingDecision.primarySource;
      } else if (retrievedContext && retrievedContext.length > 50) {
        primarySource = 'study_material';
      }

      // Construct system instruction enforcing the 3 Knowledge Priorities
      const systemInstruction = `
You are "Eunchae ✦", the official AI Interview Prep Companion specifically created for this TCS Ignite & Technical Interview Preparation website.

🎯 CORE PURPOSE & THREE KNOWLEDGE SOURCES PRIORITY ORDER:
1. Priority 1 — CURRENT WEBSITE CONTENT (Currently Displayed Screen)
   - When the user asks "Explain this", "What does this mean?", "Why?", "Give an example", "What should I remember?", "What can the interviewer ask from this?", or asks about the topic on their active slide:
   - You MUST first inspect the CURRENT ACTIVE SLIDE & VISIBLE TEXT provided below.
   - Answer directly based on what is currently displayed on their screen.

2. Priority 2 — COMPLETE WEBSITE KNOWLEDGE BASE (Indexed Study Material)
   - If the answer is not in the currently active slide, use the RELEVANT WEBSITE KNOWLEDGE CHUNKS provided below covering OOP, Basic SQL, SQL JOINs, SQL Command Types, Coding & DSA, HR behavioral answers, and Mandatory Verification Documents.

3. Priority 3 — WEB RESEARCH (External Knowledge & Live Facts)
   - If the question is outside the website study material (e.g., latest software versions, current CEO, outside tech stacks like Docker/Kubernetes), use the provided WEB RESEARCH RESULTS.
   - Do NOT pretend web information came from the study material. Clearly state where it came from.

EXPLANATION STYLE & PEDAGOGICAL TONE:
- Beginner-friendly, encouraging, crystal-clear, structured.
- Use simple English, easy analogies, and relatable examples (e.g., "Inheritance = Parent → Child relationship 👨‍👩‍👧").
- For code, provide short, clean snippets in Python or SQL with expected output.
- Use formatting: bold key terms, short bullet points, "💡 Interview Tip:", "⚠️ Common Trap:".
- Avoid walls of text; keep answers digestible and scannable.

MODES:
- Interview Mode: Act as the TCS Technical/HR Interviewer. Present a question, or evaluate the candidate's answer with:
  🎯 What you answered well
  💡 What could be improved
  🌟 Star Interview-Ready Model Answer
- Quiz Mode: Present a clear technical or interview quiz question with options A, B, C, D or evaluate candidate's response.

CURRENT SCREEN CONTEXT:
${dynamicContext ? `
- Current Page: ${dynamicContext.currentPage}
- Active Slide: "${dynamicContext.currentSlideTitle}" (${dynamicContext.currentSection})
- Visible Screen Text:
${dynamicContext.visibleText}
${dynamicContext.nearbySlideContent ? `\n- Adjacent Slides Continuity:\n${dynamicContext.nearbySlideContent}` : ''}
` : currentSlideContext ? `\nActive Slide Content:\n${currentSlideContext}\n` : 'General Overview'}

${retrievedContext ? `STUDY MATERIAL KNOWLEDGE CHUNKS (From Website Index):\n${retrievedContext}\n` : ''}

${webResearchData.summary ? `WEB RESEARCH RESULTS (Live Web Knowledge):\n${webResearchData.summary}\n` : ''}
`;

      // Conversation history window (last 14 messages for rich context memory)
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-14)) {
          if (item && item.role && item.text) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }]
            });
          }
        }
      }

      // Format prompt with mode instructions if applicable
      let currentPrompt = message;
      if (mode === 'interview') {
        currentPrompt = `[MODE: INTERVIEW PRACTICE]\n${message}`;
      } else if (mode === 'quiz') {
        currentPrompt = `[MODE: QUIZ CHALLENGE]\n${message}`;
      }

      contents.push({
        role: 'user',
        parts: [{ text: currentPrompt }]
      });

      // Prefer fast, highly capable gemini-3.1-flash-lite, with fallback to gemini-flash-latest and gemini-3.8-flash
      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
      let replyText: string | null = null;
      let usedModel: string = 'gemini-3.1-flash-lite';

      for (const modelName of candidateModels) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.35,
              maxOutputTokens: 1100,
            }
          });
          if (response && response.text) {
            replyText = response.text;
            usedModel = modelName;
            break;
          }
        } catch (modelErr: any) {
          const errMsg = modelErr?.message || String(modelErr);
          console.log(`[Eunchae AI] Notice: Model ${modelName} unavailable (${errMsg.slice(0, 100)}). Trying next candidate...`);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      const aiResponseTimeMs = Date.now() - serverStartTime;

      if (replyText) {
        res.json({
          reply: replyText,
          mode,
          model: usedModel,
          source: primarySource,
          webSources: webResearchData.sources,
          routingCase: routingDecision?.routingCase || (shouldWebSearch ? 'case_c' : 'case_a'),
          aiResponseTimeMs
        });
      } else {
        console.log('[Eunchae AI] Models temporarily busy. Seamlessly delegating to local handbook engine.');
        res.status(200).json({
          fallback: true,
          notice: 'Model busy, local handbook knowledge engine engaged.',
          source: primarySource
        });
      }
    } catch (error: any) {
      console.log('[Eunchae AI] Request handled with fallback:', error?.message || error);
      res.status(200).json({
        fallback: true,
        notice: 'Eunchae knowledge engine engaged.'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
