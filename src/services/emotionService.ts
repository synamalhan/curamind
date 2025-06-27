import { openDB } from 'idb';

interface EmotionEntry {
  id?: number;
  date: string;
  emotion: string;
  score: number;
  timestamp: Date;
  text: string;
}

class EmotionService {
  private dbName = 'CuraMindDB';
  private dbVersion = 1;
  private baseUrl = 'http://localhost:8000';

  async initDB() {
    return openDB(this.dbName, this.dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('emotions')) {
          const store = db.createObjectStore('emotions', { keyPath: 'id', autoIncrement: true });
          store.createIndex('date', 'date');
          store.createIndex('emotion', 'emotion');
          store.createIndex('timestamp', 'timestamp');
        }
      },
    });
  }

  async detectEmotion(text: string, isOnline: boolean): Promise<string> {
    if (!isOnline) {
      return this.detectEmotionOffline(text);
    }

    try {
      const response = await fetch(`${this.baseUrl}/emotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to detect emotion');
      }

      const data = await response.json();
      const emotion = data.emotion;
      
      // Store the emotion locally
      await this.storeEmotion(text, emotion);
      
      return emotion;
    } catch (error) {
      console.error('Error detecting emotion:', error);
      const emotion = this.detectEmotionOffline(text);
      await this.storeEmotion(text, emotion);
      return emotion;
    }
  }

  private detectEmotionOffline(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Simple keyword-based emotion detection
    const emotionKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'good', 'glad', 'pleased', 'fantastic'],
      sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'awful', 'terrible', 'bad', 'upset', 'crying'],
      angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'rage', 'hate', 'bitter'],
      anxious: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'stress', 'overwhelmed', 'tense'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'content', 'tranquil', 'comfortable', 'settled']
    };

    let maxScore = 0;
    let detectedEmotion = 'neutral';

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (lowerText.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    }

    return detectedEmotion;
  }

  async storeEmotion(text: string, emotion: string): Promise<void> {
    try {
      const db = await this.initDB();
      const score = this.calculateEmotionScore(emotion);
      
      const entry: EmotionEntry = {
        date: new Date().toISOString().split('T')[0],
        emotion,
        score,
        timestamp: new Date(),
        text
      };

      await db.add('emotions', entry);
      
      // Also track server-side if online
      if (navigator.onLine) {
        try {
          await fetch(`${this.baseUrl}/track`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry),
          });
        } catch (error) {
          console.error('Error tracking emotion on server:', error);
        }
      }
    } catch (error) {
      console.error('Error storing emotion:', error);
    }
  }

  private calculateEmotionScore(emotion: string): number {
    const scores = {
      happy: 4.5,
      calm: 4.0,
      neutral: 3.0,
      anxious: 2.0,
      sad: 1.5,
      angry: 1.0
    };
    return scores[emotion as keyof typeof scores] || 3.0;
  }

  async getEmotionHistory(timeRange: '7d' | '30d'): Promise<EmotionEntry[]> {
    try {
      const db = await this.initDB();
      const days = timeRange === '7d' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const tx = db.transaction('emotions', 'readonly');
      const store = tx.objectStore('emotions');
      const index = store.index('timestamp');
      
      const range = IDBKeyRange.lowerBound(startDate);
      const entries = await index.getAll(range);
      
      return entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    } catch (error) {
      console.error('Error getting emotion history:', error);
      return [];
    }
  }

  async getEmotionStats(): Promise<{ totalEntries: number; averageScore: number; mostCommon: string }> {
    try {
      const db = await this.initDB();
      const tx = db.transaction('emotions', 'readonly');
      const store = tx.objectStore('emotions');
      const entries = await store.getAll();
      
      if (entries.length === 0) {
        return { totalEntries: 0, averageScore: 0, mostCommon: 'neutral' };
      }

      const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
      const averageScore = totalScore / entries.length;
      
      const emotionCounts = entries.reduce((acc, entry) => {
        acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostCommon = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';

      return {
        totalEntries: entries.length,
        averageScore: Math.round(averageScore * 10) / 10,
        mostCommon
      };
    } catch (error) {
      console.error('Error getting emotion stats:', error);
      return { totalEntries: 0, averageScore: 0, mostCommon: 'neutral' };
    }
  }
}

export const emotionService = new EmotionService();