import { ContentType } from '../types';

export interface StackResult {
  blogPost: string;
  linkedinPost: string;
  xThread: string[];
  instagramCaption: string;
  emailNewsletter: string;
}

async function readError(response: Response, fallback: string): Promise<Error> {
  try {
    const data: unknown = await response.json();
    if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string') {
      return new Error(data.error);
    }
  } catch {
    // The server may return a non-JSON error response.
  }
  return new Error(fallback);
}

async function postJson<T>(url: string, body: unknown, fallback: string): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await readError(response, fallback);
  }

  try {
    return await response.json() as T;
  } catch {
    throw new Error('The server returned an invalid response.');
  }
}

export async function generateContent(prompt: string, contentType: ContentType): Promise<string> {
  const data = await postJson<{ text?: unknown }>(
    '/api/generate',
    { prompt, contentType },
    'Content generation failed.'
  );

  if (typeof data.text !== 'string' || !data.text.trim()) {
    throw new Error('The generation service returned empty content.');
  }

  return data.text;
}

export async function stackContent(idea: string): Promise<StackResult> {
  const data = await postJson<StackResult>(
    '/api/stack',
    { idea },
    'Content stacking failed.'
  );

  if (
    typeof data.blogPost !== 'string' ||
    typeof data.linkedinPost !== 'string' ||
    typeof data.instagramCaption !== 'string' ||
    typeof data.emailNewsletter !== 'string' ||
    !Array.isArray(data.xThread)
  ) {
    throw new Error('The stacking service returned an invalid response.');
  }

  return data;
}
