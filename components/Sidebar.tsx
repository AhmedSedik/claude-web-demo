'use client';

import { JournalEntry, Folder } from '@/types/journal';
import { useState } from 'react';

interface SidebarProps {
  entries: JournalEntry[];
  folders: Folder[];
  selectedId: string | null;
  selectedFolderId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  onSelectFolder: (id: string | null) => void;
}

export default function Sidebar({
  entries,
  folders,
  selectedId,
  selectedFolderId,
  onSelect,
  onNew,
  onDelete,
  onCreateFolder,
  onDeleteFolder,
  onSelectFolder
}: SidebarProps) {
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setShowFolderInput(false);
    }
  };

  // Get entries for selected folder
  const filteredEntries = selectedFolderId
    ? sortedEntries.filter(e => e.folderId === selectedFolderId)
    : sortedEntries.filter(e => !e.folderId);

  // Get folder object
  const selectedFolder = selectedFolderId
    ? folders.find(f => f.id === selectedFolderId)
    : null;

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Journal</h1>
        <button
          onClick={onNew}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-2"
        >
          + New Entry
        </button>
        <button
          onClick={() => setShowFolderInput(!showFolderInput)}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          + New Folder
        </button>
      </div>

      {/* New Folder Input */}
      {showFolderInput && (
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <input
            type="text"
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreateFolder();
              } else if (e.key === 'Escape') {
                setShowFolderInput(false);
                setNewFolderName('');
              }
            }}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleCreateFolder}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded text-sm transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowFolderInput(false);
                setNewFolderName('');
              }}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-1 px-2 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Folders and Entries List */}
      <div className="flex-1 overflow-y-auto">
        {/* "All Entries" section */}
        <div
          className={`px-4 py-3 cursor-pointer transition-colors border-l-4 ${
            selectedFolderId === null
              ? 'bg-white border-l-blue-600'
              : 'border-l-transparent hover:bg-white hover:border-l-gray-300'
          }`}
          onClick={() => onSelectFolder(null)}
        >
          <h3 className="font-medium text-gray-900">All Entries</h3>
          <p className="text-xs text-gray-400">
            {sortedEntries.filter(e => !e.folderId).length} entries
          </p>
        </div>

        {/* Folders List */}
        {folders.length > 0 && (
          <div className="border-t border-gray-200">
            {folders.map((folder) => {
              const folderEntries = entries.filter(e => e.folderId === folder.id);
              return (
                <div
                  key={folder.id}
                  className={`group relative px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                    selectedFolderId === folder.id
                      ? 'bg-white border-l-blue-600'
                      : 'border-l-transparent hover:bg-white hover:border-l-gray-300'
                  }`}
                  onClick={() => onSelectFolder(folder.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-600 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M2 6a2 2 0 012-2h5l2 3h9a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                        <h3 className="font-medium text-gray-900 truncate">
                          {folder.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 ml-6">
                        {folderEntries.length} entries
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete folder "${folder.name}"? Entries will be moved to root.`)) {
                          onDeleteFolder(folder.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-600 transition-opacity flex-shrink-0"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Entries in selected folder/root */}
        {filteredEntries.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {selectedFolderId
              ? `No entries in "${selectedFolder?.name}". Create your first entry!`
              : 'No entries yet. Create your first entry!'}
          </div>
        ) : (
          <div className="py-2 border-t border-gray-200">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`group relative px-4 py-3 cursor-pointer transition-colors border-l-4 ${
                  selectedId === entry.id
                    ? 'bg-white border-l-blue-600'
                    : 'border-l-transparent hover:bg-white hover:border-l-gray-300'
                }`}
                onClick={() => onSelect(entry.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate mb-1">
                      {entry.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mb-1">
                      {entry.content.substring(0, 60) || 'No content'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(entry.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this entry?')) {
                        onDelete(entry.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-600 transition-opacity flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
