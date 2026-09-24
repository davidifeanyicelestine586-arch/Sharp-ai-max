import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  validateGenerateBody,
  validateStackBody,
  validateStackResponse,
  ValidationError,
} from './src/lib/validation';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const GENERATE_LIMIT = 20;
const STACK_LIMIT = 5;
const MAX_CONCURRENT_AI_REQUESTS = 2;

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();
let activeAiRequests = 0;

const rateBucketCleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateBuckets) {
    if (now >= bucket.resetAt) rateBuckets.delete(key);
  }
}, RATE_WINDOW_MS) as ReturnType<typeof setInterval> & { unref?: () => void };
rateBucketCleanup.unref?.();

function clientKey(req: Request): string {
  return req.socket.remoteAddress || 'unknown-client';
}

function rateLimit(limit: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.path}:${clientKey(req)}`;
    const now = Date.now();
    const existing = rateBuckets.get(key);

    if (!existing || now >= existing.resetAt) {
      rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
      return next();
    }

    if (existing.count >= limit) {
      const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfter));
      res.setHeader('X-RateLimit-Limit', String(limit));
      res.setHeader('X-RateLimit-Remaining', '0');
      return res.status(429).json({
        error: 'Too many generation requests. Please wait before trying again.',
      });
    }

    existing.count += 1;
    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, limit - existing.count)));
    return next();
  };
}

function rejectOversizedContent(req: Request, res: Response, next: NextFunction) {
  const contentLength = Number(req.headers['content-length'] || 0);
  if (Number.isFinite(contentLength) && contentLength > 20_000) {
    return res.status(413).json({ error: 'Request payload is too large.' });
  }
  return next();
}

async function withAiSlot<T>(operation: () => Promise<T>): Promise<T> {
  if (activeAiRequests >= MAX_CONCURRENT_AI_REQUESTS) {
    const error = new Error('The generation service is busy. Please try again shortly.');
    (error as Error & { statusCode?: number }).statusCode = 503;
    throw error;
  }

  activeAiRequests += 1;
  try {
    return await operation();
  } finally {
    activeAiRequests -= 1;
  }
}

function sendServerError(res: Response, error: unknown, fallback: string) {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  const statusCode =
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
      ? error.statusCode
      : 500;

  console.error(`[Sharp AI API] ${fallback}`, error instanceof Error ? error.message : 'unknown error');
  return res.status(statusCode).json({
    error: statusCode === 503
      ? 'The generation service is busy. Please try again shortly.'
      : fallback,
  });
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');

  // Security-focused response headers without adding another runtime dependency.
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; " +
        "script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self';"
      );
    }
    next();
  });

  app.use(express.json({ limit: '20kb', strict: true }));
  app.use(rejectOversizedContent);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY is not set. Content generation will be unavailable.');
  }

  const ai = new GoogleGenAI({ apiKey: apiKey || '' });

  app.post('/api/generate', rateLimit(GENERATE_LIMIT), async (req, res) => {
    try {
      const { prompt, contentType } = validateGenerateBody(req.body);

      if (!apiKey) {
        return res.status(503).json({ error: 'Content generation is not configured on this server.' });
      }

      let systemInstruction = 'You are an expert copywriter, copy editor, and SaaS content specialist. Write high-quality, engaging content that feels authentic, human, and highly useful.';

      switch (contentType) {
        case 'blog':
          systemInstruction = `You are a professional SEO copywriter and essayist. Write a detailed, comprehensive blog post.
Use clear structure with an intriguing introduction, rich educational sections, and a cohesive conclusion.
Format the output in clean Markdown with logical headings (##, ###), bullet points, and select bold terms for skimmability.
Keep the tone informative, authoritative, and friendly. Do not include meta-descriptions, blog metadata, or notes - start directly with the title of the article (as a # heading).`;
          break;
        case 'linkedin':
          systemInstruction = `You are a social selling and personal branding expert on LinkedIn. Create a high-quality LinkedIn post.
Create a strong first-line hook, generous line breaks, a confident authentic storytelling voice, 2-3 useful takeaways, a conversational closing question, and 3-5 relevant hashtags.`;
          break;
        case 'x':
          systemInstruction = `You are a clear, concise technology storyteller on X. Create an engaging single post or thread.
Format a thread as a numbered sequence. Each tweet MUST be under 280 characters, crisp and useful, with a strong hook and a useful conclusion.`;
          break;
        case 'instagram':
          systemInstruction = `You are an expert visual storyteller and Instagram content writer. Create a scannable caption with a strong first line, clean paragraphs, a useful call-to-action, and 5-8 relevant hashtags.`;
          break;
        case 'facebook':
          systemInstruction = `You are a community-focused content writer. Write a warm, relatable, conversational Facebook post with useful substance and a clear closing question or call-to-action.`;
          break;
        case 'email':
          systemInstruction = `You are an email newsletter specialist. Write an engaging educational newsletter with a subject line, preheader, greeting, useful body content, actionable takeaways, a clear call to action, and a professional sign-off.`;
          break;
      }

      const response = await withAiSlot(() => ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      }));

      const text = response.text?.trim();
      if (!text) {
        return res.status(502).json({ error: 'The generation service returned empty content.' });
      }

      return res.json({ text });
    } catch (error: unknown) {
      return sendServerError(res, error, 'Content generation failed.');
    }
  });

  app.post('/api/stack', rateLimit(STACK_LIMIT), async (req, res) => {
    try {
      const { idea } = validateStackBody(req.body);

      if (!apiKey) {
        return res.status(503).json({ error: 'Content generation is not configured on this server.' });
      }

      const prompt = `Perform multi-channel content repurposing. Transform this single raw idea into five useful media assets.

RAW IDEA:
${idea}

Generate:
1. A comprehensive SEO-optimized Blog Post in Markdown.
2. An engaging LinkedIn Post.
3. A structured 3-5 tweet X thread, returned as an array of strings.
4. An Instagram Caption.
5. An educational Email Newsletter.

Write clear, useful prose. Avoid unsupported claims and fabricated facts.`;

      const response = await withAiSlot(() => ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              blogPost: { type: Type.STRING },
              linkedinPost: { type: Type.STRING },
              xThread: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              instagramCaption: { type: Type.STRING },
              emailNewsletter: { type: Type.STRING },
            },
            required: ['blogPost', 'linkedinPost', 'xThread', 'instagramCaption', 'emailNewsletter'],
          },
          temperature: 0.8,
        },
      }));

      const textOutput = response.text?.trim();
      if (!textOutput) {
        return res.status(502).json({ error: 'The generation service returned empty content.' });
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(textOutput);
      } catch {
        return res.status(502).json({ error: 'The generation service returned malformed structured content.' });
      }

      const result = validateStackResponse(parsed);
      return res.json(result);
    } catch (error: unknown) {
      return sendServerError(res, error, 'Content stacking failed.');
    }
  });

  // Reject unknown API routes without exposing Express internals.
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof SyntaxError) {
      return res.status(400).json({ error: 'Request body contains invalid JSON.' });
    }
    console.error('[Sharp AI API] Unhandled request error', error);
    return res.status(500).json({ error: 'Unexpected server error.' });
  });

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
    console.log(`[Sharp AI Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('[Sharp AI Server] Failed to start', error);
  process.exitCode = 1;
});
