import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY is not set. Content generation will be unavailable.');
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
  });

  app.post('/api/generate', async (req, res) => {
    try {
      const { prompt, contentType } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: 'Gemini API key is not configured on the server.',
        });
      }

      let systemInstruction = "You are an expert copywriter, copy editor, and SaaS content specialist. Write high-quality, engaging content that feels authentic, human, and highly persuasive.";

      switch (contentType) {
        case 'blog':
          systemInstruction = `You are a professional SEO copywriter and essayist. Write a detailed, comprehensive blog post.
          Use clear structure with an intriguing introduction, rich educational sections, and a cohesive conclusion.
          Format the output in clean Markdown with logical headings (##, ###), bullet points, and select bold terms for skimmability.
          Keep the tone informative, authoritative, and friendly. Do not include meta-descriptions, blog metadata, or notes - start directly with the title of the article (as a # heading).`;
          break;
        case 'linkedin':
          systemInstruction = `You are a social selling and personal branding expert on LinkedIn. Update your user with high-engagement updates.
          Create a LinkedIn post with a scroll-stopping first-line hook, generous line breaks (avoiding walls of text), and a confident, authentic storytelling voice.
          Include 2-3 value-packed takeaway bullets, a clear conversational question to drive engagement at the end, and 3-5 relevant, non-spammy hashtags.`;
          break;
        case 'x':
          systemInstruction = `You are a viral storyteller and tech thought-leader on X / Twitter. Create an engaging single post or thread.
          To make it high quality, format it as a numbered sequence of tweets (e.g. 1/, 2/) representing a structured thread logic.
          Each tweet MUST be under 280 characters, crisp, clear, and punchy. Include a compelling hook at 1/, provide high value or examples in the middle, and close with a call-to-engagement at the final tweet.`;
          break;
        case 'instagram':
          systemInstruction = `You are an expert visual storyteller and Instagram marketing manager. Create an eye-catching caption.
          It must be emoji-rich, creative, and highly scannable. Write a powerful first line, separate paragraphs cleanly, include a prominent call-to-action, and group a block of 5-8 highly relevant hashtags at the bottom.`;
          break;
        case 'facebook':
          systemInstruction = `You are a community builder and social media marketing manager. Write an engaging Facebook post.
          The tone should be warm, relatable, conversational, and highly community-oriented. Incorporate friendly emojis, pose logical questions to encourage comments, and include a clear secondary call-to-action link format.`;
          break;
        case 'email':
          systemInstruction = `You are an email marketing specialist and SaaS content writer. Write an engaging email newsletter.
          Provide a subject line, preheader, greeting, useful body content, actionable takeaways, a clear call to action, and a professional sign-off.
          Avoid sales-heavy hype and keep the tone conversational, educational, and premium.`;
          break;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Generation error:', error);
      res.status(500).json({ error: error?.message || 'Failed to generate content' });
    }
  });

  app.post('/api/stack', async (req, res) => {
    try {
      const { idea } = req.body;

      if (!idea) {
        return res.status(400).json({ error: 'Concept or idea is required for stacking' });
      }

      if (!apiKey) {
        return res.status(500).json({
          error: 'Gemini API key is not configured on the server.',
        });
      }

      const prompt = `Perform multi-channel content repurposing. Transform this single raw idea or concept into 5 high-converting media assets simultaneously:

      RAW IDEA: "${idea}"

      Generate:
      1. A comprehensive SEO-optimized Blog Post in Markdown.
      2. An engaging, hook-first LinkedIn Post with line breaks and hashtags.
      3. A structured 3-5 tweet X (Twitter) Thread, returned as an array of strings.
      4. A punchy, visual, emoji-rich Instagram Caption with a clear CTA and hashtags.
      5. A high-value Educational Email Newsletter with a subject line, body, and CTA.

      Write with outstanding, copywriter-level prose. Standardize branding, voice, and quality.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              blogPost: {
                type: Type.STRING,
                description: 'A detailed, high-quality blog post formatted in Markdown. Starts directly with the blog title.',
              },
              linkedinPost: {
                type: Type.STRING,
                description: 'A readable LinkedIn post with a hook, line spacing, useful takeaways, and relevant hashtags.',
              },
              xThread: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'An array of exactly 3 to 5 numbered tweets representing a cohesive thread, each under 240 characters.',
              },
              instagramCaption: {
                type: Type.STRING,
                description: 'An emoji-rich caption with styled paragraphs, a clear CTA, and relevant hashtags.',
              },
              emailNewsletter: {
                type: Type.STRING,
                description: 'A newsletter with subject line, body text, actionable takeaways, and a call to action.',
              },
            },
            required: ['blogPost', 'linkedinPost', 'xThread', 'instagramCaption', 'emailNewsletter'],
          },
          temperature: 0.8,
        },
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error('No text returned from Gemini during content stacking.');
      }

      try {
        res.json(JSON.parse(textOutput.trim()));
      } catch {
        console.error('Failed to parse Gemini JSON output:', textOutput);
        res.status(500).json({ error: 'Model output did not match the required JSON structure.' });
      }
    } catch (error: any) {
      console.error('Stacker route error:', error);
      res.status(500).json({ error: error?.message || 'Failed to stack content' });
    }
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sharp AI Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
