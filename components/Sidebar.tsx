'use client';

import { JournalEntry } from '@/types/journal';

interface SidebarProps {
  entries: JournalEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  entries,
  selectedId,
  onSelect,
  onNew,
  onDelete
}: SidebarProps) {
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

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Journal</h1>
        <button
          onClick={onNew}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          + New Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto">
        {sortedEntries.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No entries yet. Create your first entry!
          </div>
        ) : (
          <div className="py-2">
            {sortedEntries.map((entry) => (
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
                    className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-600 transition-opacity"
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
