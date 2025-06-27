import React, { useState, useEffect , useRef} from 'react';
import { Waves, BookOpen, Headphones, Flower, Play, Pause, RotateCcw } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

import rain from "../assets/rain.mp3";
import ocean from "../assets/ocean.mp3";
import forest from "../assets/forest.mp3";
import white_noise from "../assets/white_noise.mp3";



interface ToolboxProps {
  language: string;
}

const Toolbox: React.FC<ToolboxProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'journal' | 'sounds'>('breathing');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const { t } = useLanguage();

  // Breathing exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingCount(prev => {
          const newCount = prev + 1;
          const cycle = newCount % 16; // 4s inhale + 4s hold + 8s exhale
          
          if (cycle < 4) {
            setBreathingPhase('inhale');
          } else if (cycle < 8) {
            setBreathingPhase('hold');
          } else {
            setBreathingPhase('exhale');
          }
          
          return newCount;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [breathingActive]);


  useEffect(() => {
  // Stop all sounds
  Object.values(audioRefs.current).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });

  // Play selected sound
  if (ambientSound) {
    const selectedAudio = audioRefs.current[ambientSound];
    if (selectedAudio) {
      selectedAudio.loop = true;
      selectedAudio.play();
    }
  }

  // Cleanup on unmount
  return () => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
    });
  };
}, [ambientSound]);


  const audioRefs = useRef<Record<string, HTMLAudioElement>>({
  rain: new Audio(rain),
  ocean: new Audio(ocean),
  forest: new Audio(forest),
  white_noise: new Audio(white_noise),
});

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathingCount(0);
  };

  const saveJournal = () => {
    if (journalEntry.trim()) {
      const entry = {
        date: new Date().toISOString(),
        content: journalEntry,
        mood: 'neutral' // This could be detected from the content
      };
      
      // Save to localStorage
      const existingEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]');
      existingEntries.push(entry);
      localStorage.setItem('journal_entries', JSON.stringify(existingEntries));
      
      setJournalEntry('');
      alert(t('journal_saved'));
    }
  };

  const ambientSounds = [
    { id: 'rain', name: t('sound_rain'), icon: '🌧️' },
    { id: 'ocean', name: t('sound_ocean'), icon: '🌊' },
    { id: 'forest', name: t('sound_forest'), icon: '🌲' },
    { id: 'white_noise', name: t('sound_white_noise'), icon: '📻' }
  ];

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return t('breathe_in');
      case 'hold':
        return t('hold_breath');
      case 'exhale':
        return t('breathe_out');
      default:
        return t('breathe_in');
    }
  };

  const getBreathingDuration = () => {
    const cycle = breathingCount % 16;
    if (cycle < 4) return 4 - cycle;
    if (cycle < 8) return 8 - cycle;
    return 16 - cycle;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <Flower className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('wellness_toolbox')}</h2>
          <p className="text-gray-600">{t('toolbox_subtitle')}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
            activeTab === 'breathing'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Waves className="w-5 h-5" />
          <span className="font-medium">{t('breathing')}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
            activeTab === 'journal'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">{t('journal')}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('sounds')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
            activeTab === 'sounds'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Headphones className="w-5 h-5" />
          <span className="font-medium">{t('sounds')}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Breathing Exercise */}
        {activeTab === 'breathing' && (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">{t('breathing_exercise')}</h3>
            <p className="text-gray-600">{t('breathing_description')}</p>
            
            {/* Breathing Circle */}
            <div className="relative mx-auto w-64 h-64">
              <div 
                className={`absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-1000 ${
                  breathingActive ? 'animate-pulse' : ''
                }`}
                style={{
                  transform: breathingActive ? 
                    (breathingPhase === 'inhale' ? 'scale(1.2)' : 
                     breathingPhase === 'hold' ? 'scale(1.2)' : 'scale(1)') : 'scale(1)'
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {breathingActive ? getBreathingDuration() : '4'}
                    </div>
                    <div className="text-lg font-medium text-gray-600">
                      {breathingActive ? getBreathingInstruction() : t('ready_to_breathe')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Breathing Controls */}
            <div className="flex justify-center space-x-4">
              {!breathingActive ? (
                <button
                  onClick={startBreathing}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-green-600 transition-all"
                >
                  <Play className="w-5 h-5" />
                  <span>{t('start_breathing')}</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={stopBreathing}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all"
                  >
                    <Pause className="w-5 h-5" />
                    <span>{t('stop')}</span>
                  </button>
                  <button
                    onClick={() => {
                      stopBreathing();
                      setTimeout(startBreathing, 100);
                    }}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>{t('restart')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Journal */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('daily_journal')}</h3>
              <p className="text-gray-600">{t('journal_description')}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('how_are_you_feeling')}
                </label>
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder={t('journal_placeholder')}
                  className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {journalEntry.length}/1000 {t('characters')}
                </div>
                <button
                  onClick={saveJournal}
                  disabled={!journalEntry.trim()}
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {t('save_entry')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ambient Sounds */}
        {activeTab === 'sounds' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('ambient_sounds')}</h3>
              <p className="text-gray-600">{t('sounds_description')}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {ambientSounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => setAmbientSound(ambientSound === sound.id ? null : sound.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    ambientSound === sound.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-3">{sound.icon}</div>
                  <div className="font-medium">{sound.name}</div>
                  {ambientSound === sound.id && (
                    <div className="mt-2 text-sm text-blue-600">
                      {t('playing')}...
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {ambientSound && (
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-blue-700 mb-3">{t('playing_sound')}</p>
                <button
                  onClick={() => setAmbientSound(null)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {t('stop_sound')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbox;