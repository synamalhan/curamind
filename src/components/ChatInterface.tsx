import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Bot, Heart, AlertCircle } from 'lucide-react';
import { chatService } from '../services/chatService';
import { emotionService } from '../services/emotionService';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../hooks/useLanguage';
import { emotionColors } from '../emotionColors';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  emotion?: string;
  timestamp: string; // stored as ISO string
  isVoice?: boolean;
}

interface ChatInterfaceProps {
  language: string;
  isOnline: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language, isOnline }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const messagesRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();

  const {
    isRecording,
    isSupported: voiceSupported,
    startRecording,
    stopRecording,
    transcript
  } = useVoice();

  // Auto-scroll
  useEffect(() => {
    // Scroll only the message list; scrollIntoView would also scroll the page.
    const el = messagesRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

const hasWelcomedRef = useRef(false);
useEffect(() => {
  const welcomeMsgId = 'welcome-1';

  // Only run once on initial load
  if (!hasWelcomedRef.current) {
    hasWelcomedRef.current = true;

    const welcomeMessage: Message = {
      id: welcomeMsgId,
      text: t('welcome_message'),
      sender: 'bot',
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [welcomeMessage, ...prev]);
  }
}, []); // only on mount


useEffect(() => {
  const welcomeMsgId = 'welcome-1';
  const translatedText = t('welcome_message');
 // console.log("Welcome message (translated):", translatedText);

  setMessages((prev) => {
    const alreadyWelcomed = prev.some((m) => m.id === welcomeMsgId);

    if (alreadyWelcomed) {
      return prev.map((m) =>
        m.id === welcomeMsgId ? { ...m, text: translatedText } : m
      );
    }

    if (!hasWelcomedRef.current) {
      hasWelcomedRef.current = true;
      return [
        {
          id: welcomeMsgId,
          text: translatedText,
          sender: 'bot',
          timestamp: new Date().toISOString()
        },
        ...prev
      ];
    }

    return prev;
  });
}, [language]); // triggers when language changes



  const handleSendMessage = async (text: string, isVoiceInput = false) => {
    if (!text.trim()) return;

   // console.log('Sending message:', text); // Debug

    const userMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      isVoice: isVoiceInput
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const emotion = await emotionService.detectEmotion(text, isOnline);
      setCurrentEmotion(emotion);

      const response = await chatService.sendMessage(text, emotion, language, isOnline);

      const botMessage: Message = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        text: response,
        sender: 'bot',
        emotion: emotion,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMessage]);

      if (isVoiceInput && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang =
          language === 'hi' ? 'hi-IN' :
          language === 'ta' ? 'ta-IN' :
          language === 'es' ? 'es-ES' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `${Date.now()}-err`,
        text: t('error_message'),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-[72vh]">
      {/* Header */}
      <div className="bg-lilac-light text-ink px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-lilac-deep">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">{t('chat_title')}</h3>
              <p className="text-sm text-ink-soft">{t('chat_subtitle')}</p>
            </div>
          </div>

          {currentEmotion && (
            <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: emotionColors[currentEmotion] }} />
              <span className="text-sm font-bold">{t(`emotion_${currentEmotion}`)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-[22px] ${
                message.sender === 'user'
                  ? 'bg-lilac text-ink rounded-br-md'
                  : 'bg-paper text-ink rounded-bl-md'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <div className="w-7 h-7 bg-lilac-light rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-3.5 h-3.5 text-lilac-deep fill-lilac" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-[15px] leading-relaxed">{message.text}</p>
                  {message.isVoice && (
                    <div className="flex items-center space-x-1 mt-1 opacity-70">
                      <Mic className="w-3 h-3" />
                      <span className="text-xs">{t('voice_message')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-ink-soft">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {message.emotion && (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-ink-soft">
                        <span className="w-2 h-2 rounded-full" style={{ background: emotionColors[message.emotion] }} />
                        {t(`emotion_${message.emotion}`)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-paper rounded-[22px] rounded-bl-md px-4 py-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-lilac-light rounded-full flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 text-lilac-deep fill-lilac" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-lilac-deep/50 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-lilac-deep/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-lilac-deep/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="bg-peach-light p-3">
          <div className="flex items-center space-x-2 text-peach-deep font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{t('offline_notice')}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-ink/10 bg-white p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
              placeholder={t('chat_placeholder')}
              className="w-full px-5 py-3 bg-paper border border-ink/10 rounded-full text-ink placeholder:text-ink-soft/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-lilac transition"
              disabled={isLoading}
            />
          </div>

          {voiceSupported && (
            <button
              onClick={handleVoiceToggle}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
              className={`p-3 rounded-full transition-all duration-200 ${
                isRecording
                  ? 'bg-peach text-ink scale-105'
                  : 'bg-lilac-light text-lilac-deep hover:bg-lilac'
              }`}
              disabled={isLoading}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => handleSendMessage(inputText)}
            aria-label="Send message"
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-ink text-paper rounded-full hover:bg-ink/85 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
