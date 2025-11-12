'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import { JournalEntry, Folder } from '@/types/journal';
import { storage } from '@/lib/storage';

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [mounted, setMounted] = useState(false);

  // Load entries and folders from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const loadedEntries = storage.getEntries();
    const loadedFolders = storage.getFolders();
    setEntries(loadedEntries);
    setFolders(loadedFolders);

    // Select the most recent entry if available
    if (loadedEntries.length > 0) {
      const mostRecent = loadedEntries.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      setSelectedId(mostRecent.id);
      setCurrentTitle(mostRecent.title);
      setCurrentContent(mostRecent.content);
      setSelectedFolderId(mostRecent.folderId || null);
    }
  }, []);

  // Auto-save when content or title changes
  useEffect(() => {
    if (!mounted || !selectedId) return;

    const timeoutId = setTimeout(() => {
      const entry = entries.find(e => e.id === selectedId);
      if (entry) {
        const updatedEntry: JournalEntry = {
          ...entry,
          title: currentTitle,
          content: currentContent,
          updatedAt: new Date(),
        };
        storage.saveEntry(updatedEntry);
        setEntries(prev =>
          prev.map(e => (e.id === selectedId ? updatedEntry : e))
        );
      }
    }, 500); // Auto-save after 500ms of inactivity

    return () => clearTimeout(timeoutId);
  }, [currentTitle, currentContent, selectedId, mounted, entries]);

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: storage.generateId(),
      title: '',
      content: '',
      folderId: selectedFolderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.saveEntry(newEntry);
    setEntries(prev => [...prev, newEntry]);
    setSelectedId(newEntry.id);
    setCurrentTitle('');
    setCurrentContent('');
  };

  const handleSelectEntry = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setSelectedId(id);
      setCurrentTitle(entry.title);
      setCurrentContent(entry.content);
      setSelectedFolderId(entry.folderId || null);
    }
  };

  const handleDeleteEntry = (id: string) => {
    storage.deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));

    if (selectedId === id) {
      const remaining = entries.filter(e => e.id !== id);
      if (remaining.length > 0) {
        handleSelectEntry(remaining[0].id);
      } else {
        setSelectedId(null);
        setCurrentTitle('');
        setCurrentContent('');
      }
    }
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: storage.generateId(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.saveFolder(newFolder);
    setFolders(prev => [...prev, newFolder]);
  };

  const handleDeleteFolder = (id: string) => {
    storage.deleteFolder(id);
    setFolders(prev => prev.filter(f => f.id !== id));

    // If the deleted folder was selected, switch to "All Entries"
    if (selectedFolderId === id) {
      setSelectedFolderId(null);
    }
  };

  const handleSelectFolder = (id: string | null) => {
    setSelectedFolderId(id);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        entries={entries}
        folders={folders}
        selectedId={selectedId}
        selectedFolderId={selectedFolderId}
        onSelect={handleSelectEntry}
        onNew={handleNewEntry}
        onDelete={handleDeleteEntry}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onSelectFolder={handleSelectFolder}
      />
      <main className="flex-1 overflow-hidden">
        {selectedId ? (
          <MarkdownEditor
            value={currentContent}
            onChange={setCurrentContent}
            title={currentTitle}
            onTitleChange={setCurrentTitle}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <p className="text-lg">No entry selected</p>
              <p className="text-sm mt-2">Create a new entry to get started</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
