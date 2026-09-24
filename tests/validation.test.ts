import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAX_GENERATE_PROMPT_LENGTH,
  validateGenerateBody,
  validateStackBody,
  validateStackResponse,
  ValidationError,
} from '../src/lib/validation';

test('accepts an allowed generation request', () => {
  assert.deepEqual(
    validateGenerateBody({ prompt: 'Write about robotics', contentType: 'blog' }),
    { prompt: 'Write about robotics', contentType: 'blog' },
  );
});

test('rejects unsupported content types', () => {
  assert.throws(
    () => validateGenerateBody({ prompt: 'hello', contentType: 'unknown' }),
    ValidationError,
  );
});

test('rejects oversized prompts', () => {
  assert.throws(
    () => validateGenerateBody({
      prompt: 'x'.repeat(MAX_GENERATE_PROMPT_LENGTH + 1),
      contentType: 'blog',
    }),
    /character limit/,
  );
});

test('rejects malformed stack requests', () => {
  assert.throws(() => validateStackBody({ idea: '' }), /required/);
  assert.throws(() => validateStackBody([]), /JSON object/);
});

test('accepts and normalizes valid stack output', () => {
  const output = validateStackResponse({
    blogPost: 'Blog',
    linkedinPost: 'LinkedIn',
    xThread: ['1/ One', '2/ Two', '3/ Three'],
    instagramCaption: 'Instagram',
    emailNewsletter: 'Email',
  });
  assert.equal(output.xThread.length, 3);
});

test('rejects malformed stack output', () => {
  assert.throws(
    () => validateStackResponse({
      blogPost: 'Blog',
      linkedinPost: 'LinkedIn',
      xThread: ['only one'],
      instagramCaption: 'Instagram',
      emailNewsletter: 'Email',
    }),
    /X thread/,
  );
});


test('rejects oversized model output', () => {
  assert.throws(
    () => validateStackResponse({
      blogPost: 'x'.repeat(40_001),
      linkedinPost: 'LinkedIn',
      xThread: ['1/ One', '2/ Two', '3/ Three'],
      instagramCaption: 'Instagram',
      emailNewsletter: 'Email',
    }),
    /exceeded/,
  );
});
