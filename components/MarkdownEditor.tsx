'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import SocialShareButtons from './SocialShareButtons';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
  title,
  onTitleChange
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Title Input */}
      <div className="border-b border-gray-200 p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Entry title..."
          className="w-full text-2xl font-semibold focus:outline-none placeholder-gray-400"
        />
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              !isPreview
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Write
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              isPreview
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preview
          </button>
        </div>
        <SocialShareButtons title={title} content={value} />
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="h-full overflow-y-auto p-6">
            <div className="markdown-preview prose max-w-none">
              <ReactMarkdown>{value || '*Nothing to preview*'}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start writing your journal entry..."
            className="w-full h-full p-6 focus:outline-none resize-none font-mono text-sm"
          />
        )}
      </div>
    </div>
  );
}
