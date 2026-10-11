import { describe, expect, it } from 'bun:test';
import { isSafeExternalUrl, cn } from './utils';

describe('isSafeExternalUrl security validation', () => {
  it('allows valid https and http URLs', () => {
    expect(isSafeExternalUrl('https://maps.google.com/?q=Jakarta')).toBe(true);
    expect(isSafeExternalUrl('http://maps.google.com')).toBe(true);
    expect(isSafeExternalUrl('https://goo.gl/maps/abc123xyz')).toBe(true);
  });

  it('rejects javascript: XSS payloads', () => {
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeExternalUrl('JAVASCRIPT:alert(document.cookie)')).toBe(false);
    expect(isSafeExternalUrl('  javascript:alert(1)')).toBe(false);
    expect(isSafeExternalUrl('javascript:void(0)')).toBe(false);
  });

  it('rejects data: and vbscript: URIs', () => {
    expect(isSafeExternalUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe(false);
    expect(isSafeExternalUrl('vbscript:msgbox(1)')).toBe(false);
  });

  it('rejects relative paths, protocol-relative URLs, and non-http schemes', () => {
    expect(isSafeExternalUrl('/path/to/page')).toBe(false);
    expect(isSafeExternalUrl('//evil.com')).toBe(false);
    expect(isSafeExternalUrl('file:///etc/passwd')).toBe(false);
    expect(isSafeExternalUrl('blob:https://example.com/uuid')).toBe(false);
  });

  it('handles null, undefined, and empty string safely', () => {
    expect(isSafeExternalUrl('')).toBe(false);
    expect(isSafeExternalUrl('   ')).toBe(false);
    expect(isSafeExternalUrl(null)).toBe(false);
    expect(isSafeExternalUrl(undefined)).toBe(false);
  });
});

describe('cn utility', () => {
  it('merges tailwind classes properly', () => {
    expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
  });
});
