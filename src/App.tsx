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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  CuraMind
                </h1>
                <p className="text-sm text-gray-600">{t('tagline')}</p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center space-x-4">
              <LanguageSelect language={language} onLanguageChange={setLanguage} />
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs font-medium">{t('online')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-amber-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs font-medium">{t('offline')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-4 py-6">
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
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              {currentPage === 'chat' && <ChatInterface language={language} isOnline={isOnline} />}
              {currentPage === 'dashboard' && <EmotionDashboard language={language} />}
              {currentPage === 'toolbox' && <Toolbox language={language} />}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-blue-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              {t('footer_text')} • {t('crisis_help')}
            </p>
            <p className="text-xs mt-2 text-gray-500">
              {t('emergency_disclaimer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;