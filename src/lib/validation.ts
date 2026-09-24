export const CONTENT_TYPES = ['blog', 'linkedin', 'x', 'instagram', 'facebook', 'email'] as const;
export type AllowedContentType = (typeof CONTENT_TYPES)[number];

export const MAX_GENERATE_PROMPT_LENGTH = 12_000;
export const MAX_STACK_IDEA_LENGTH = 8_000;

export class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${field} must be a string.`);
  }
  const normalized = value.trim();
  if (!normalized) {
    throw new ValidationError(`${field} is required.`);
  }
  if (normalized.length > maxLength) {
    throw new ValidationError(`${field} exceeds the ${maxLength}-character limit.`);
  }
  return normalized;
}

export function validateGenerateBody(body: unknown): {
  prompt: string;
  contentType: AllowedContentType;
} {
  if (!isPlainObject(body)) {
    throw new ValidationError('Request body must be a JSON object.');
  }

  const prompt = readString(body.prompt, 'Prompt', MAX_GENERATE_PROMPT_LENGTH);
  const contentType = body.contentType;

  if (typeof contentType !== 'string' || !CONTENT_TYPES.includes(contentType as AllowedContentType)) {
    throw new ValidationError('Unsupported content type.');
  }

  return { prompt, contentType: contentType as AllowedContentType };
}

export function validateStackBody(body: unknown): { idea: string } {
  if (!isPlainObject(body)) {
    throw new ValidationError('Request body must be a JSON object.');
  }

  return {
    idea: readString(body.idea, 'Concept or idea', MAX_STACK_IDEA_LENGTH),
  };
}

export function validateStackResponse(value: unknown): {
  blogPost: string;
  linkedinPost: string;
  xThread: string[];
  instagramCaption: string;
  emailNewsletter: string;
} {
  if (!isPlainObject(value)) {
    throw new ValidationError('Model output is not a valid object.');
  }

  const requiredStrings = ['blogPost', 'linkedinPost', 'instagramCaption', 'emailNewsletter'] as const;
  for (const field of requiredStrings) {
    if (typeof value[field] !== 'string' || !value[field].trim()) {
      throw new ValidationError(`Model output is missing a valid ${field}.`);
    }
  }

  if (!Array.isArray(value.xThread) || value.xThread.length < 3 || value.xThread.length > 5 ||
      value.xThread.some(item => typeof item !== 'string' || !item.trim() || item.length > 280)) {
    throw new ValidationError('Model output contains an invalid X thread.');
  }

  return {
    blogPost: value.blogPost as string,
    linkedinPost: value.linkedinPost as string,
    xThread: value.xThread as string[],
    instagramCaption: value.instagramCaption as string,
    emailNewsletter: value.emailNewsletter as string,
  };
}
