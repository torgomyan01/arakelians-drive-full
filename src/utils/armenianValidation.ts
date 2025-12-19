// Armenian alphabet regex pattern
const ARMENIAN_PATTERN = /^[\u0531-\u0587\u0561-\u0587\s]+$/;

export function isArmenian(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  return ARMENIAN_PATTERN.test(text.trim());
}

export function validateArmenianInput(text: string): string {
  // Remove any non-Armenian characters
  return text
    .split('')
    .filter((char) => ARMENIAN_PATTERN.test(char) || char === ' ')
    .join('');
}
