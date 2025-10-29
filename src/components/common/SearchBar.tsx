'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { businesses } from '@/lib/data';
import { Button } from '../ui/button';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 1) {
      const lowerCaseQuery = query.toLowerCase();
      const filteredSuggestions = businesses
        .map(b => [b.name, b.category])
        .flat()
        .filter(s => s.toLowerCase().includes(lowerCaseQuery))
        .filter((value, index, self) => self.indexOf(value) === index) // Unique
        .slice(0, 4);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Capitalize first letter of each word
    const formattedValue = rawValue
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setQuery(formattedValue);
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setQuery(searchTerm);
    setSuggestions([]);
    router.push(`/servicos?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleMicClick = () => {
    // Mock speech-to-text
    const mockTranscript = "Restaurante Perto";
    setQuery(mockTranscript);
    handleSearch(mockTranscript);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Button
            variant="ghost"
            size="icon"
            onClick={handleMicClick}
            className="absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:bg-transparent"
        >
            <Mic className="h-5 w-5" />
        </Button>
        <Input
          placeholder="Pesquisar Lojas ou Serviços"
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          className="pl-12 pr-12 h-14 text-lg bg-card rounded-full border-2 border-border/50 focus:border-primary/50 focus:ring-0"
        />
        <Button 
            variant="ghost"
            size="icon"
            onClick={() => handleSearch(query)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:bg-transparent"
        >
            <Search className="h-6 w-6" />
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border/50 rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="p-3 cursor-pointer hover:bg-muted/50"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
