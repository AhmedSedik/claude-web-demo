export type EntryColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray' | 'pink' | 'indigo';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  color: EntryColor;
  createdAt: Date;
  updatedAt: Date;
}

export type JournalEntryInput = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>;

export const COLOR_OPTIONS: { value: EntryColor; label: string; className: string }[] = [
  { value: 'red', label: 'Red', className: 'bg-red-100 border-red-300 text-red-900 ring-red-400' },
  { value: 'blue', label: 'Blue', className: 'bg-blue-100 border-blue-300 text-blue-900 ring-blue-400' },
  { value: 'green', label: 'Green', className: 'bg-green-100 border-green-300 text-green-900 ring-green-400' },
  { value: 'yellow', label: 'Yellow', className: 'bg-yellow-100 border-yellow-300 text-yellow-900 ring-yellow-400' },
  { value: 'purple', label: 'Purple', className: 'bg-purple-100 border-purple-300 text-purple-900 ring-purple-400' },
  { value: 'pink', label: 'Pink', className: 'bg-pink-100 border-pink-300 text-pink-900 ring-pink-400' },
  { value: 'indigo', label: 'Indigo', className: 'bg-indigo-100 border-indigo-300 text-indigo-900 ring-indigo-400' },
  { value: 'gray', label: 'Gray', className: 'bg-gray-100 border-gray-300 text-gray-900 ring-gray-400' },
];

export const getColorClass = (color: EntryColor) => {
  const option = COLOR_OPTIONS.find(c => c.value === color);
  return option?.className || COLOR_OPTIONS[1].className;
};
