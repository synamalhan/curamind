import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Heart, Smile, Frown, Meh } from 'lucide-react';
import { emotionService } from '../services/emotionService';
import { useLanguage } from '../hooks/useLanguage';

interface EmotionEntry {
  date: string;
  emotion: string;
  score: number;
  timestamp: Date;
}

interface EmotionDashboardProps {
  language: string;
}

const EmotionDashboard: React.FC<EmotionDashboardProps> = ({ language }) => {
  const [emotionData, setEmotionData] = useState<EmotionEntry[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadEmotionData();
  }, [timeRange]);

  const loadEmotionData = async () => {
    setLoading(true);
    try {
      const data = await emotionService.getEmotionHistory(timeRange);
      setEmotionData(data);
    } catch (error) {
      console.error('Error loading emotion data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for line chart
  const chartData = emotionData.reduce((acc, entry) => {
    const date = entry.date;
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing[entry.emotion] = (existing[entry.emotion] || 0) + entry.score;
      existing.count = (existing.count || 0) + 1;
    } else {
      acc.push({
        date,
        [entry.emotion]: entry.score,
        count: 1
      });
    }
    
    return acc;
  }, [] as any[]);

  // Prepare data for pie chart
  const emotionCounts = emotionData.reduce((acc, entry) => {
    acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    name: t(`emotion_${emotion}`),
    value: count,
    emotion
  }));

  const emotionColors = {
    happy: '#F59E0B',
    sad: '#3B82F6',
    angry: '#EF4444',
    anxious: '#8B5CF6',
    calm: '#10B981',
    neutral: '#6B7280'
  };

  const getEmotionIcon = (emotion: string) => {
    const icons = {
      happy: <Smile className="w-5 h-5 text-yellow-500" />,
      sad: <Frown className="w-5 h-5 text-blue-500" />,
      angry: <Frown className="w-5 h-5 text-red-500" />,
      anxious: <Frown className="w-5 h-5 text-purple-500" />,
      calm: <Smile className="w-5 h-5 text-green-500" />,
      neutral: <Meh className="w-5 h-5 text-gray-500" />
    };
    return icons[emotion as keyof typeof icons] || <Meh className="w-5 h-5 text-gray-500" />;
  };

  const averageScore = emotionData.length > 0 
    ? emotionData.reduce((sum, entry) => sum + entry.score, 0) / emotionData.length 
    : 0;

  const getMoodDescription = (score: number) => {
    if (score >= 4) return { text: t('mood_great'), color: 'text-green-600', icon: '😊' };
    if (score >= 3) return { text: t('mood_good'), color: 'text-blue-600', icon: '🙂' };
    if (score >= 2) return { text: t('mood_okay'), color: 'text-yellow-600', icon: '😐' };
    return { text: t('mood_low'), color: 'text-red-600', icon: '😔' };
  };

  const currentMood = getMoodDescription(averageScore);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">{t('loading_dashboard')}</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('emotion_dashboard')}</h2>
            <p className="text-gray-600">{t('dashboard_subtitle')}</p>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === '7d' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t('7_days')}
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === '30d' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {t('30_days')}
          </button>
        </div>
      </div>

      {/* Current Mood Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{currentMood.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{t('current_mood')}</h3>
              <p className={`text-2xl font-bold ${currentMood.color}`}>
                {currentMood.text}
              </p>
              <p className="text-sm text-gray-600">
                {t('average_score')}: {averageScore.toFixed(1)}/5
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800">{emotionData.length}</div>
            <div className="text-sm text-gray-600">{t('total_entries')}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Trend Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            {t('emotion_trends')}
          </h3>
          
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                {Object.keys(emotionColors).map(emotion => (
                  <Line
                    key={emotion}
                    type="monotone"
                    dataKey={emotion}
                    stroke={emotionColors[emotion as keyof typeof emotionColors]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{t('no_data_yet')}</p>
                <p className="text-sm mt-2">{t('start_chatting_to_track')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Emotion Distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            {t('emotion_distribution')}
          </h3>
          
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={emotionColors[entry.emotion as keyof typeof emotionColors]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{t('no_data_yet')}</p>
                <p className="text-sm mt-2">{t('start_chatting_to_track')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Emotions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('recent_emotions')}</h3>
        
        {emotionData.length > 0 ? (
          <div className="space-y-3">
            {emotionData.slice(-10).reverse().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getEmotionIcon(entry.emotion)}
                  <div>
                    <span className="font-medium text-gray-800">
                      {t(`emotion_${entry.emotion}`)}
                    </span>
                    <div className="text-sm text-gray-600">
                      {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-gray-600">
                    {entry.score.toFixed(1)}/5
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${(entry.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>{t('no_recent_emotions')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDashboard;