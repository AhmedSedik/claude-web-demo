'use client';

import { EntryColor, COLOR_OPTIONS } from '@/types/journal';

interface ColorPickerProps {
  selectedColor: EntryColor;
  onChange: (color: EntryColor) => void;
}

export default function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 p-3 border-t border-gray-200">
      <span className="text-sm font-medium text-gray-700">Color:</span>
      <div className="flex gap-2 flex-wrap">
        {COLOR_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              selectedColor === option.value
                ? 'ring-2 ring-offset-1 ring-gray-400'
                : 'hover:scale-110'
            } ${option.className.split(' ').slice(0, 3).join(' ')}`}
            title={option.label}
            aria-label={`${option.label} color`}
          />
        ))}
      </div>
    </div>
  );
}
