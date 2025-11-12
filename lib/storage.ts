import { JournalEntry } from '@/types/journal';

const STORAGE_KEY = 'journal_entries';

export const storage = {
  getEntries(): JournalEntry[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const entries = JSON.parse(data);
      // Convert date strings back to Date objects
      return entries.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      }));
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveEntry(entry: JournalEntry): void {
    if (typeof window === 'undefined') return;

    try {
      const entries = this.getEntries();
      const existingIndex = entries.findIndex(e => e.id === entry.id);

      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.push(entry);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  deleteEntry(id: string): void {
    if (typeof window === 'undefined') return;

    try {
      const entries = this.getEntries();
      const filtered = entries.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
    }
  },

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
};
