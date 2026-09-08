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
        currentSlideContext = null,
        mode = 'chat',
        retrievedContext = ''
      } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const client = getGeminiClient();
      if (!client) {
        // Return structured fallback flag so client knowledge engine can provide immediate rich response
        res.status(200).json({
          fallback: true,
          notice: 'Gemini API key is not configured. Utilizing local website knowledge engine.'
        });
        return;
      }

      const serverStartTime = Date.now();

      // Construct system instructions
      const systemInstruction = `
You are "Eunchae", the official AI Interview Prep Companion built specifically for this website (TCS Ignite & Technical Interview Preparation Handbook).

Tagline: "Your Interview Prep Companion"

Architecture & Memory Model:
- SHORT-TERM MEMORY: You have active awareness of the candidate's current slide (#${req.body.currentSlideNumber || 'N/A'}: ${req.body.currentSlideTitle || 'General'}) and recent conversation context.
- LONG-TERM WEBSITE MEMORY: Indexed website knowledge provided below covering OOP, DBMS, SQL, SQL Joins, SQL Command Types, Coding & DSA, HR behavioral answers, and the Mandatory Verification Documents Checklist.

Core Personality:
- Friendly, smart, patient, encouraging, concise, highly structured, beginner-friendly.
- Expert technical & behavioral interview coach guiding a TCS candidate to succeed.
- Never sound robotic or verbose.
- Use clean formatting: bold titles, crisp bullet points, clean ASCII/text diagrams where helpful, syntax-highlighted code blocks, "💡 Interview Tip:", and "⚠️ Important Note:". Keep paragraphs short and scannable.

Strict Scope, Grounding & Zero-Hallucination Mandate:
1. Priority:
   Website Content Chunks → Current Slide Context → Conversation History → Pedagogical Explanation.
2. If the user refers to "this", "this slide", "this topic", "give an example", "explain this like I'm 5", or asks a follow-up without naming the subject:
   - Resolve "this" / "it" using the CURRENT ACTIVE SLIDE CONTEXT or the most recent topic discussed in conversation history!
3. STRICT GROUNDING: You answer questions strictly based on the website's interview-preparation material provided in the context below.
4. If a question is NOT covered in the website preparation material:
   DO NOT hallucinate or fabricate facts. Say clearly:
   "I couldn't find that in your interview-preparation material. Try asking me about one of the topics covered on this website."

${retrievedContext ? `RELEVANT WEBSITE KNOWLEDGE CHUNKS:\n${retrievedContext}\n` : ''}
${currentSlideContext ? `CURRENT ACTIVE SLIDE CONTEXT:\n${currentSlideContext}\n` : ''}
`;

      // Build conversation contents with sliding window (up to last 12 messages)
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        // Sliding window: last 12 relevant turns
        for (const item of history.slice(-12)) {
          if (item && item.role && item.text) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }]
            });
          }
        }
      }

      // Append current message
      let currentPrompt = message;
      if (mode === 'interview') {
        currentPrompt = `[MODE: INTERVIEW DRILL]\nCandidate message: ${message}`;
      } else if (mode === 'quiz') {
        currentPrompt = `[MODE: QUIZ CHALLENGE]\nCandidate message: ${message}`;
      }

      contents.push({
        role: 'user',
        parts: [{ text: currentPrompt }]
      });

      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      let replyText: string | null = null;
      let usedModel: string = 'gemini-3.8-flash';

      for (const modelName of candidateModels) {
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.35,
              maxOutputTokens: 1024,
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
          // Brief pause before trying fallback model if 503 or 429
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      }

      const aiResponseTimeMs = Date.now() - serverStartTime;

      if (replyText) {
        res.json({
          reply: replyText,
          mode,
          model: usedModel,
          aiResponseTimeMs
        });
      } else {
        // All Gemini models are temporarily experiencing high demand (503) or unavailable
        console.log('[Eunchae AI] Upstream models busy or unavailable. Seamlessly delegating to handbook knowledge engine.');
        res.status(200).json({
          fallback: true,
          notice: 'Model busy, handbook knowledge engine engaged.'
        });
      }
    } catch (error: any) {
      console.log('[Eunchae AI] Request handled with fallback:', error?.message || error);
      // Fallback response allowing client-side engine to respond gracefully
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
