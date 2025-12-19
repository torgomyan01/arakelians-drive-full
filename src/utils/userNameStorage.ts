const STORAGE_KEY = 'comment_author_name';

export function saveAuthorName(name: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch (error) {
    console.error('Error saving author name:', error);
  }
}

export function getAuthorName(): string {
  if (typeof window === 'undefined') return '';

  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch (error) {
    console.error('Error reading author name:', error);
    return '';
  }
}
