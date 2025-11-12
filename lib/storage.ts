import { JournalEntry, Folder } from '@/types/journal';

const ENTRIES_KEY = 'journal_entries';
const FOLDERS_KEY = 'journal_folders';

export const storage = {
  // Folder operations
  getFolders(): Folder[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(FOLDERS_KEY);
      if (!data) return [];

      const folders = JSON.parse(data);
      return folders.map((folder: any) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
      }));
    } catch (error) {
      console.error('Error reading folders from localStorage:', error);
      return [];
    }
  },

  saveFolder(folder: Folder): void {
    if (typeof window === 'undefined') return;

    try {
      const folders = this.getFolders();
      const existingIndex = folders.findIndex(f => f.id === folder.id);

      if (existingIndex >= 0) {
        folders[existingIndex] = folder;
      } else {
        folders.push(folder);
      }

      localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error('Error saving folder to localStorage:', error);
    }
  },

  deleteFolder(id: string): void {
    if (typeof window === 'undefined') return;

    try {
      const folders = this.getFolders();
      const filtered = folders.filter(f => f.id !== id);
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(filtered));

      // Move entries from this folder to root
      const entries = this.getEntries();
      const updated = entries.map(e =>
        e.folderId === id ? { ...e, folderId: null } : e
      );
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting folder from localStorage:', error);
    }
  },

  // Entry operations
  getEntries(): JournalEntry[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(ENTRIES_KEY);
      if (!data) return [];

      const entries = JSON.parse(data);
      // Convert date strings back to Date objects and add default color for old entries
      return entries.map((entry: any) => ({
        ...entry,
        color: entry.color || 'blue', // Default to blue for backward compatibility
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

      localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  deleteEntry(id: string): void {
    if (typeof window === 'undefined') return;

    try {
      const entries = this.getEntries();
      const filtered = entries.filter(e => e.id !== id);
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
    }
  },

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
};
