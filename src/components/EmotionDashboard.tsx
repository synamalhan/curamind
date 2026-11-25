import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Calendar, TrendingUp, Heart, Smile, Frown, Meh } from 'lucide-react';
import { emotionService } from '../services/emotionService';
import { useLanguage } from '../hooks/useLanguage';
import { emotionColors } from '../emotionColors';

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

  // Average mood score per day
  const dailyScores = emotionData.reduce((acc, entry) => {
    (acc[entry.date] ||= []).push(entry.score);
    return acc;
  }, {} as Record<string, number[]>);
  const chartData = Object.entries(dailyScores).map(([date, scores]) => ({
    date: new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    score: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
  }));

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


  const getEmotionIcon = (emotion: string) => {
    const Face = emotion === 'happy' || emotion === 'calm' ? Smile : emotion === 'neutral' ? Meh : Frown;
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${emotionColors[emotion] ?? '#A8A2B3'}33` }}>
        <Face className="w-5 h-5" style={{ color: emotionColors[emotion] ?? '#A8A2B3' }} strokeWidth={2.25} />
      </div>
    );
  };

  const averageScore = emotionData.length > 0 
    ? emotionData.reduce((sum, entry) => sum + entry.score, 0) / emotionData.length 
    : 0;

  const getMoodDescription = (score: number) => {
    if (score >= 4) return { text: t('mood_great'), color: 'text-mint-deep', Face: Smile };
    if (score >= 3) return { text: t('mood_good'), color: 'text-sky-deep', Face: Smile };
    if (score >= 2) return { text: t('mood_okay'), color: 'text-butter-deep', Face: Meh };
    return { text: t('mood_low'), color: 'text-peach-deep', Face: Frown };
  };

  const currentMood = emotionData.length > 0
    ? getMoodDescription(averageScore)
    : { text: t('no_data_yet'), color: 'text-ink-soft', Face: Meh };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
        <span className="ml-3 text-ink-soft">{t('loading_dashboard')}</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-butter rounded-[18px_18px_18px_6px] -rotate-6 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-ink" strokeWidth={2.25} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-ink">{t('emotion_dashboard')}</h2>
            <p className="text-ink-soft">{t('dashboard_subtitle')}</p>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-paper border border-ink/10 rounded-full p-1">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              timeRange === '7d' 
                ? 'bg-butter text-ink' 
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {t('7_days')}
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              timeRange === '30d' 
                ? 'bg-butter text-ink' 
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            {t('30_days')}
          </button>
        </div>
      </div>

      {/* Current Mood Summary */}
      <div className="bg-butter-light rounded-[24px] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center"><currentMood.Face className={`w-9 h-9 ${currentMood.color}`} strokeWidth={2} /></div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-butter-deep">{t('current_mood')}</h3>
              <p className="text-3xl font-extrabold text-ink">
                {currentMood.text}
              </p>
              <p className="text-sm text-ink-soft">
                {emotionData.length > 0
                  ? `${t('average_score')}: ${averageScore.toFixed(1)}/5`
                  : t('start_chatting_to_track')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold text-ink">{emotionData.length}</div>
            <div className="text-sm font-semibold text-butter-deep">{t('total_entries')}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Trend Chart */}
        <div className="bg-sky-light rounded-[24px] p-6">
          <h3 className="text-lg font-extrabold text-ink mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-sky-deep" />
            {t('emotion_trends')}
          </h3>
          
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6F9FE6" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#6F9FE6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff" strokeWidth={2} vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v}/5`, t('average_score')]} contentStyle={{ borderRadius: 14, border: 'none', fontFamily: 'Nunito', fontWeight: 700 }} />
                <Area type="monotone" dataKey="score" stroke="#2D5FA8" strokeWidth={3} fill="url(#moodFill)" dot={{ r: 5, fill: '#fff', stroke: '#2D5FA8', strokeWidth: 2.5 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-ink-soft">
              <div className="text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-ink/20" />
                <p>{t('no_data_yet')}</p>
                <p className="text-sm mt-2">{t('start_chatting_to_track')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Emotion Distribution */}
        <div className="bg-lilac-light rounded-[24px] p-6">
          <h3 className="text-lg font-extrabold text-ink mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-lilac-deep" />
            {t('emotion_distribution')}
          </h3>
          
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  // Recharts 2.x can leave an animated labelled Pie blank after async data loads.
                  isAnimationActive={false}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={emotionColors[entry.emotion as keyof typeof emotionColors]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-ink-soft">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-ink/20" />
                <p>{t('no_data_yet')}</p>
                <p className="text-sm mt-2">{t('start_chatting_to_track')}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Emotions */}
      <div className="bg-white rounded-[24px] border border-ink/10 p-6">
        <h3 className="text-lg font-extrabold text-ink mb-4">{t('recent_emotions')}</h3>
        
        {emotionData.length > 0 ? (
          <div className="space-y-3">
            {emotionData.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-paper rounded-2xl">
                <div className="flex items-center space-x-3">
                  {getEmotionIcon(entry.emotion)}
                  <div>
                    <span className="font-bold text-ink">
                      {t(`emotion_${entry.emotion}`)}
                    </span>
                    <div className="text-sm text-ink-soft">
                      {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-bold text-ink-soft">
                    {entry.score.toFixed(1)}/5
                  </div>
                  <div className="w-20 bg-ink/10 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{ width: `${(entry.score / 5) * 100}%`, background: emotionColors[entry.emotion] }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-ink-soft">
            <Heart className="w-12 h-12 mx-auto mb-4 text-ink/20" />
            <p>{t('no_recent_emotions')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDashboard;