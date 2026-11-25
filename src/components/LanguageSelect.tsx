import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSelectProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ language, onLanguageChange }) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'es', name: 'Español' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="appearance-none bg-white border border-ink/15 rounded-full font-semibold text-sm text-ink px-4 py-2 pr-9 cursor-pointer hover:border-ink/30 focus:outline-none focus:ring-2 focus:ring-lilac"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-soft pointer-events-none" />
    </div>
  );
};

export default LanguageSelect;