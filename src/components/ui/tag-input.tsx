
'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string[];
  onChange: (value: string[]) => void;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === ',' || e.key === 'Enter') {
        e.preventDefault();
        const newTag = inputValue.trim();
        if (newTag && !value.includes(newTag)) {
          onChange([...value, newTag]);
        }
        setInputValue('');
      }
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter(tag => tag !== tagToRemove));
    };

    return (
      <div>
        <div 
          className={cn(
            "flex flex-wrap gap-2 rounded-md border border-input bg-background p-2",
            className
          )}
        >
          {value.map(tag => (
            <Badge
              key={tag}
              className="bg-lime-900/50 border border-lime-400/30 text-lime-300 text-sm font-normal py-1 px-3"
            >
              {tag}
              <button
                type="button"
                className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Input
            ref={ref}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 h-8 text-base"
            {...props}
          />
        </div>
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';
