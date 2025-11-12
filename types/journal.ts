export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type FolderInput = Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>;

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type JournalEntryInput = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>;
