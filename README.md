# Journal App

A beautiful, clean, and simple journaling application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Markdown Editor**: Write your journal entries with full markdown support
- **Live Preview**: Toggle between write and preview modes
- **Auto-save**: Your entries are automatically saved as you type
- **Local Storage**: All data is stored locally in your browser
- **Beautiful UI**: Clean, minimal design focused on the writing experience
- **Entry Management**: Create, edit, and delete journal entries
- **Sidebar Navigation**: Easy access to all your journal entries with date formatting

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- Click **"+ New Entry"** to create a new journal entry
- Click on any entry in the sidebar to view/edit it
- Use the **Write** tab to edit your entry in markdown
- Use the **Preview** tab to see how your markdown will render
- Your entries auto-save as you type
- Hover over an entry in the sidebar to reveal the delete button

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v3** - Utility-first styling
- **React Markdown** - Markdown rendering
- **Local Storage** - Browser-based data persistence

## Project Structure

```
claudewebdemo/
├── app/
│   ├── globals.css      # Global styles and Tailwind imports
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Main page with app logic
├── components/
│   ├── MarkdownEditor.tsx  # Markdown editor with preview
│   └── Sidebar.tsx         # Entry list sidebar
├── lib/
│   └── storage.ts       # Local storage utilities
├── types/
│   └── journal.ts       # TypeScript interfaces
└── ...config files
```

## Build for Production

```bash
npm run build
npm start
```

## License

MIT
