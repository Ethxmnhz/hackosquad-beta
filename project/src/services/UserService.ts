const API_URL = 'http://localhost:5000/api';

interface UserProgress {
  points: number;
  solved_challenges: number[];
  total_challenges: number;
  rank: number;
}

export const UserService = {
  async fetchUserProgress(): Promise<UserProgress> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user progress');
    return response.json();
  },

  async updateUserPoints(points: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/user/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ points })
    });
    if (!response.ok) throw new Error('Failed to update user points');
  }
};