import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Heart, Globe, Wifi, WifiOff } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import EmotionDashboard from './components/EmotionDashboard';
import Toolbox from './components/Toolbox';
import LanguageSelect from './components/LanguageSelect';
import Navigation from './components/Navigation';
import { useConnection } from './hooks/useConnection';
import { useLanguage } from './hooks/useLanguage';

function App() {
  const { isOnline } = useConnection();
  const { language, setLanguage, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState('chat');

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-paper/95 border-b border-ink/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-lilac rounded-[18px_18px_18px_6px] flex items-center justify-center -rotate-6">
                <Heart className="w-6 h-6 text-ink fill-peach" strokeWidth={2.25} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-ink">
                  CuraMind
                </h1>
                <p className="hidden sm:block text-sm text-ink-soft">{t('tagline')}</p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <LanguageSelect language={language} onLanguageChange={setLanguage} />
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <div className="flex items-center space-x-1.5 bg-mint-light text-mint-deep rounded-full px-3 py-1.5">
                    <Wifi className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-medium">{t('online')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 bg-peach-light text-peach-deep rounded-full px-3 py-1.5">
                    <WifiOff className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-medium">{t('offline')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Navigation 
              currentPage={currentPage} 
              onPageChange={setCurrentPage}
              language={language}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[28px] border border-ink/10 overflow-hidden">
              {currentPage === 'chat' && <ChatInterface language={language} isOnline={isOnline} />}
              {currentPage === 'dashboard' && <EmotionDashboard language={language} />}
              {currentPage === 'toolbox' && <Toolbox language={language} />}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-ink/10 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-ink-soft">
            <p className="text-sm">
              {t('footer_text')} • {t('crisis_help')}
            </p>
            <p className="text-xs mt-2 text-ink-soft/80">
              {t('emergency_disclaimer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;