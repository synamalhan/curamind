import React from 'react';
import { MessageCircle, BarChart3, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  language: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange, language }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'chat', label: t('chat'), icon: MessageCircle },
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'toolbox', label: t('toolbox'), icon: Heart }
  ];

  return (
    <nav className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Quick Tips */}
      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">{t('quick_tip')}</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {t('tip_of_the_day')}
        </p>
      </div>
    </nav>
  );
};

export default Navigation;