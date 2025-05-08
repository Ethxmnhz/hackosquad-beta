const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'insane';
  points: number;
  flag: string;
  target_url?: string;
  icon?: string;
  hints?: string[];
  solved_count: number;
}

export const ChallengeService = {
  async fetchChallenges(): Promise<Challenge[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/challenges`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch challenges');
    return response.json();
  },

  async fetchUserChallenges(): Promise<Challenge[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/challenges/created`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user challenges');
    return response.json();
  },

  async createChallenge(challengeData: Omit<Challenge, 'id' | 'solved_count'>): Promise<Challenge> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/challenges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(challengeData)
    });
    if (!response.ok) throw new Error('Failed to create challenge');
    return response.json();
  },

  async solveChallenge(challengeId: number, flag: string): Promise<{ points: number }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/challenges/${challengeId}/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ flag })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit flag');
    }
    return response.json();
  },

  async approveChallenge(challengeId: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/challenges/${challengeId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to approve challenge');
  },

  async rejectChallenge(challengeId: number, feedback: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/challenges/${challengeId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ feedback })
    });
    if (!response.ok) throw new Error('Failed to reject challenge');
  }
};