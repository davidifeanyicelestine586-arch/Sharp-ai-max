/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Please configure it in your Secrets / .env file.');
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Route - Single Content Generation
  app.post('/api/generate', async (req, res) => {
    try {
      const { prompt, contentType } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!apiKey) {
        return res.status(500).json({ 
          error: 'Gemini API Key is missing. Access the Secrets panel in the dev workspace settings or add it to .env to enable generation.' 
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
          It must be emoji-rich, creative, and highly scannable. Write a powerful first line, separate paragraphs cleanly, include a prominent call-to-action (e.g., 'Double-tap if you agree!', 'Check the link in bio!'), and group a block of 5-8 highly relevant hashtags at the bottom.`;
          break;
        case 'facebook':
          systemInstruction = `You are a community builder and social media marketing manager. Write an engaging Facebook post.
          The tone should be warm, relatable, conversational, and highly community-oriented. Incorporate friendly emojis, pose logical questions to encourage comments, and include a clear secondary call-to-action link format.`;
          break;
        case 'email':
          systemInstruction = `You are an email marketing wizard and SaaS growth specialist. Write an engaging, high-conversion email newsletter.
          Provide:
          - A Subject Line: (Catchy, curiosity-inducing, spam-free)
          - Preheader text
          - Personal greeting
          - Core body: Use scannable headers, value-driven paragraphs, and 3 bullet points showing actionable utility or features.
          - Clear Call to Action (CTA): Stand out clearly so readers click.
          - Professional sign-off.
          Avoid sales-heavy or spammy hype - keep it conversational, educational, and premium.`;
          break;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || '' });

    } catch (error: any) {
      console.error('Generation Error:', error);
      res.status(500).json({ error: error?.message || 'Failed to generate content' });
    }
  });

  // API Route - Content Stacker (Simultaneous Generation)
  app.post('/api/stack', async (req, res) => {
    try {
      const { idea } = req.body;

      if (!idea) {
        return res.status(400).json({ error: 'Concept or idea is required for stacking' });
      }

      if (!apiKey) {
        return res.status(500).json({ 
          error: 'Gemini API Key is missing. Access the Secrets panel in the dev workspace settings or add it to .env to enable stacking.' 
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
                description: 'A detailed, high-quality blog post formatted in beautiful Markdown (using ##, ###, bullet points, etc.). Starts directly with the blog title.' 
              },
              linkedinPost: { 
                type: Type.STRING, 
                description: 'A highly readable, narrative-driven LinkedIn post with a viral-style hook, ample line spacing, bullet points, and 3-5 hashtags.' 
              },
              xThread: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'An array of exactly 3 to 5 numbered tweets representing a cohesive, high-value thread, each under 240 characters.'
              },
              instagramCaption: { 
                type: Type.STRING, 
                description: 'An emoji-rich, conversational caption with styled paragraphs, a strong visual CTA, and a grouped hashtag block.' 
              },
              emailNewsletter: { 
                type: Type.STRING, 
                description: 'A newsletter with subject line, personalized body text, actionable takeaways, and a call-to-action signature.' 
              }
            },
            required: ['blogPost', 'linkedinPost', 'xThread', 'instagramCaption', 'emailNewsletter']
          },
          temperature: 0.8,
        }
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error('Zero text returned from Gemini API during content stacking.');
      }

      try {
        const parsed = JSON.parse(textOutput.trim());
        res.json(parsed);
      } catch (e) {
        console.error('Failed to parse Gemini JSON output structure:', textOutput);
        res.status(500).json({ error: 'Model output did not match required JSON schema format.' });
      }

    } catch (error: any) {
      console.error('Stacker Route Error:', error);
      res.status(500).json({ error: error?.message || 'Failed to stack content' });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve client routing index file
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sharp AI Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
