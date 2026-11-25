import React, { useState, useEffect , useRef} from 'react';
import { Waves, BookOpen, Headphones, Flower, Play, Pause, RotateCcw, CloudRain, Trees, Radio } from 'lucide-react';
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
    { id: 'rain', name: t('sound_rain'), Icon: CloudRain, tone: 'bg-sky-light text-sky-deep', on: 'bg-sky' },
    { id: 'ocean', name: t('sound_ocean'), Icon: Waves, tone: 'bg-lilac-light text-lilac-deep', on: 'bg-lilac' },
    { id: 'forest', name: t('sound_forest'), Icon: Trees, tone: 'bg-mint-light text-mint-deep', on: 'bg-mint' },
    { id: 'white_noise', name: t('sound_white_noise'), Icon: Radio, tone: 'bg-peach-light text-peach-deep', on: 'bg-peach' }
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
        <div className="w-11 h-11 bg-mint rounded-[18px_18px_18px_6px] -rotate-6 flex items-center justify-center">
          <Flower className="w-6 h-6 text-ink" strokeWidth={2.25} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-ink">{t('wellness_toolbox')}</h2>
          <p className="text-ink-soft">{t('toolbox_subtitle')}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-mint-light rounded-full p-1.5">
        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full font-bold transition-colors ${
            activeTab === 'breathing'
              ? 'bg-white text-mint-deep'
              : 'text-ink-soft hover:text-ink'
          }`}
        >
          <Waves className="w-5 h-5" />
          <span>{t('breathing')}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full font-bold transition-colors ${
            activeTab === 'journal'
              ? 'bg-white text-mint-deep'
              : 'text-ink-soft hover:text-ink'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>{t('journal')}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('sounds')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full font-bold transition-colors ${
            activeTab === 'sounds'
              ? 'bg-white text-mint-deep'
              : 'text-ink-soft hover:text-ink'
          }`}
        >
          <Headphones className="w-5 h-5" />
          <span>{t('sounds')}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {/* Breathing Exercise */}
        {activeTab === 'breathing' && (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-extrabold text-ink">{t('breathing_exercise')}</h3>
            <p className="text-ink-soft">{t('breathing_description')}</p>
            
            {/* Breathing Circle */}
            <div className="relative mx-auto w-72 h-72 flex items-center justify-center">
              {/* Static guide ring shows the full-breath size */}
              <div aria-hidden className="absolute inset-0 rounded-full border-2 border-dashed border-mint" />
              <div
                className="w-56 h-56 rounded-full ring-8 ring-mint-light ease-in-out"
                style={{
                  transform: breathingActive && breathingPhase !== 'exhale' ? 'scale(1.25)' : 'scale(1)',
                  transition: `transform ${breathingPhase === 'exhale' ? 8 : 4}s ease-in-out`
                }}
              >
                <div className="w-full h-full rounded-full bg-mint flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-ink mb-1 tabular-nums">
                      {breathingActive ? getBreathingDuration() : '4'}
                    </div>
                    <div className="text-base font-bold text-mint-deep">
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
                  className="flex items-center space-x-2 bg-ink text-paper font-bold px-6 py-3 rounded-full hover:bg-ink/85 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>{t('start_breathing')}</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={stopBreathing}
                    className="flex items-center space-x-2 bg-white text-ink font-bold border border-ink/15 px-6 py-3 rounded-full hover:bg-paper transition-all"
                  >
                    <Pause className="w-5 h-5" />
                    <span>{t('stop')}</span>
                  </button>
                  <button
                    onClick={() => {
                      stopBreathing();
                      setTimeout(startBreathing, 100);
                    }}
                    className="flex items-center space-x-2 bg-mint-light text-mint-deep font-bold px-6 py-3 rounded-full hover:bg-mint transition-all"
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
              <h3 className="text-xl font-extrabold text-ink mb-2">{t('daily_journal')}</h3>
              <p className="text-ink-soft">{t('journal_description')}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink mb-2">
                  {t('how_are_you_feeling')}
                </label>
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder={t('journal_placeholder')}
                  className="w-full h-44 p-5 bg-butter-light border-0 rounded-[22px] text-ink leading-relaxed placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-butter resize-none"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-ink-soft">
                  {journalEntry.length}/1000 {t('characters')}
                </div>
                <button
                  onClick={saveJournal}
                  disabled={!journalEntry.trim()}
                  className="bg-ink text-paper font-bold px-6 py-3 rounded-full hover:bg-ink/85 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
              <h3 className="text-xl font-extrabold text-ink mb-2">{t('ambient_sounds')}</h3>
              <p className="text-ink-soft">{t('sounds_description')}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {ambientSounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => setAmbientSound(ambientSound === sound.id ? null : sound.id)}
                  className={`p-6 rounded-[24px] text-left transition-transform hover:-translate-y-0.5 ${sound.tone} ${
                    ambientSound === sound.id ? 'ring-2 ring-ink' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${ambientSound === sound.id ? sound.on : 'bg-white'}`}>
                    <sound.Icon className="w-6 h-6" strokeWidth={2.25} />
                  </div>
                  <div className="font-extrabold text-ink">{sound.name}</div>
                  {ambientSound === sound.id && (
                    <div className="mt-1 text-sm font-bold">
                      {t('playing')}...
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {ambientSound && (
              <div className="bg-paper rounded-[22px] p-4 flex items-center justify-between">
                <p className="text-ink font-semibold">{t('playing_sound')}</p>
                <button
                  onClick={() => setAmbientSound(null)}
                  className="bg-ink text-paper font-bold px-5 py-2 rounded-full hover:bg-ink/85 transition-colors"
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