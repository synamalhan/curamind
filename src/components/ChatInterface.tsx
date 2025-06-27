import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Bot, Heart, AlertCircle } from 'lucide-react';
import { chatService } from '../services/chatService';
import { emotionService } from '../services/emotionService';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../hooks/useLanguage';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
}, []); // ✅ only on mount


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
}, [language]); // ✅ triggers when language changes



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

  const getEmotionColor = (emotion: string) => {
    const colors = {
      happy: 'text-yellow-500',
      sad: 'text-blue-500',
      angry: 'text-red-500',
      anxious: 'text-purple-500',
      calm: 'text-green-500',
      neutral: 'text-gray-500'
    };
    return colors[emotion as keyof typeof colors] || 'text-gray-500';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      calm: '😌',
      neutral: '😐'
    };
    return emojis[emotion as keyof typeof emojis] || '🙂';
  };

  return (
    <div className="flex flex-col h-[70vh]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">{t('chat_title')}</h3>
              <p className="text-sm text-blue-100">{t('chat_subtitle')}</p>
            </div>
          </div>

          {currentEmotion && (
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
              <span className="text-lg">{getEmotionEmoji(currentEmotion)}</span>
              <span className="text-sm font-medium">{t(`emotion_${currentEmotion}`)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  {message.isVoice && (
                    <div className="flex items-center space-x-1 mt-1 opacity-70">
                      <Mic className="w-3 h-3" />
                      <span className="text-xs">{t('voice_message')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {message.emotion && (
                      <span className="text-xs opacity-70">
                        {getEmotionEmoji(message.emotion)} {t(`emotion_${message.emotion}`)}
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
            <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="bg-amber-50 border-t border-amber-200 p-3">
          <div className="flex items-center space-x-2 text-amber-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{t('offline_notice')}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {voiceSupported && (
            <button
              onClick={handleVoiceToggle}
              className={`p-3 rounded-xl transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={isLoading}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
