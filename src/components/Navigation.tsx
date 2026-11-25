import React from 'react';
import { MessageCircle, BarChart3, Heart } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  language: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange, language }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'chat', label: t('chat'), icon: MessageCircle, active: 'bg-lilac-light text-lilac-deep', dot: 'bg-lilac' },
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3, active: 'bg-butter-light text-butter-deep', dot: 'bg-butter' },
    { id: 'toolbox', label: t('toolbox'), icon: Heart, active: 'bg-mint-light text-mint-deep', dot: 'bg-mint' }
  ];

  return (
    <nav className="bg-white rounded-[28px] border border-ink/10 p-3 lg:sticky lg:top-28">
      {/* Horizontal tabs on mobile, vertical list on desktop */}
      <div className="flex gap-2 lg:flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-3 rounded-2xl font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 ${
                isActive
                  ? item.active
                  : 'text-ink-soft hover:bg-paper hover:text-ink'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm lg:text-base">{item.label}</span>
              {isActive && <span aria-hidden className={`hidden lg:block ml-auto w-2.5 h-2.5 rounded-full ${item.dot}`} />}
            </button>
          );
        })}
      </div>
      
      {/* Quick Tips */}
      <div className="hidden lg:block mt-4 p-4 bg-peach-light rounded-[22px] relative overflow-hidden">
        {/* Little sun doodle */}
        <svg aria-hidden viewBox="0 0 64 64" className="absolute -right-3 -top-3 w-16 h-16 text-peach">
          <circle cx="32" cy="32" r="12" fill="currentColor" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="32" y1="10" x2="32" y2="4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" transform={`rotate(${a} 32 32)`} />
          ))}
        </svg>
        <span className="text-sm font-extrabold text-peach-deep">{t('quick_tip')}</span>
        <p className="mt-1.5 text-sm text-ink/80 leading-relaxed pr-6">
          {t('tip_of_the_day')}
        </p>
      </div>
    </nav>
  );
};

export default Navigation;