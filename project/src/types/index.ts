export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  points: number;
  solvedChallenges: string[];
}

export interface ChallengeSection {
  title: string;
  content: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  sections?: ChallengeSection[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'insane';
  points: number;
  flags: string[];
  hints: string[];
  files?: string[];
  createdBy: string;
  createdAt: Date;
  approved: boolean;
  solvedBy: number;
  targetUrl?: string;
  icon?: string; // Add icon field
}

export interface Submission {
  id: string;
  challengeId: string;
  userId: string;
  flag: string;
  correct: boolean;
  timestamp: Date;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  timestamp: any;
  channel: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  timestamp: any;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  solved: boolean;
}

export interface ForumComment {
  id: string;
  postId: string;
  content: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  timestamp: any;
  likes: number;
  isAnswer: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  date?: Date;
}

export interface Certificate {
  id: string;
  name: string;
  description: string;
  date: Date;
  image: string;
}