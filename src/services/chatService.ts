import { offlineResponses } from './offlineResponses';

interface ChatResponse {
  message: string;
  emotion: string;
  suggestions?: string[];
}

class ChatService {
  private baseUrl = 'http://localhost:8000';

  async sendMessage(message: string, emotion: string, language: string, isOnline: boolean): Promise<string> {
    if (!isOnline) {
      return this.getOfflineResponse(message, emotion, language);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          emotion,
          language
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data: ChatResponse = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error sending message:', error);
      return this.getOfflineResponse(message, emotion, language);
    }
  }

  private getOfflineResponse(message: string, emotion: string, language: string): string {
    return offlineResponses.getResponse(emotion, language);
  }

  async getToolkitSuggestions(emotion: string, isOnline: boolean): Promise<string[]> {
    if (!isOnline) {
      return offlineResponses.getToolkitSuggestions(emotion);
    }

    try {
      const response = await fetch(`${this.baseUrl}/toolkit?emotion=${emotion}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get toolkit suggestions');
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Error getting toolkit suggestions:', error);
      return offlineResponses.getToolkitSuggestions(emotion);
    }
  }
}

export const chatService = new ChatService();