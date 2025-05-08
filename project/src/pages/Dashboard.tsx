import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, limit, orderBy, QuerySnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Challenge, User } from '@/types';
import { Trophy, Users, Target, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentChallenges, setRecentChallenges] = useState<Challenge[]>([]);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [daysActive, setDaysActive] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent challenges
        const challengesQuery = query(
          collection(db, 'challenges'),
          where('approved', '==', true),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        let challengesSnapshot: QuerySnapshot;
        try {
          challengesSnapshot = await getDocs(challengesQuery);
          const challenges: Challenge[] = [];
          challengesSnapshot.forEach((doc) => {
            challenges.push({ id: doc.id, ...doc.data() } as Challenge);
          });
          setRecentChallenges(challenges);
        } catch (error: any) {
          console.error('Error fetching challenges:', error);
          if (error.code === 'failed-precondition') {
            toast.error('Please wait while we set up the database indexes...');
          } else {
            toast.error('Failed to load recent challenges');
          }
        }

        // Fetch top users for leaderboard
        const usersQuery = query(
          collection(db, 'users'),
          orderBy('points', 'desc'),
          limit(5)
        );
        
        try {
          const usersSnapshot = await getDocs(usersQuery);
          const users: User[] = [];
          usersSnapshot.forEach((doc) => {
            users.push({ ...doc.data() } as User);
          });
          setTopUsers(users);
        } catch (error) {
          console.error('Error fetching top users:', error);
          toast.error('Failed to load leaderboard');
        }

        // Calculate user rank
        if (user) {
          try {
            const allUsersQuery = query(
              collection(db, 'users'),
              orderBy('points', 'desc')
            );
            const allUsersSnapshot = await getDocs(allUsersQuery);
            const rank = allUsersSnapshot.docs.findIndex(doc => doc.id === user.uid) + 1;
            setUserRank(rank);

            // Calculate days active
            if (user.createdAt) {
              const createdAt = new Date(user.createdAt);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - createdAt.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              setDaysActive(diffDays);
            }
          } catch (error) {
            console.error('Error calculating user rank:', error);
            toast.error('Failed to load user statistics');
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const stats = [
    { 
      title: 'Your Points', 
      value: user?.points || 0, 
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-500/10 border-yellow-500/20'
    },
    { 
      title: 'Challenges Solved', 
      value: user?.solvedChallenges?.length || 0, 
      icon: <Target className="h-6 w-6 text-green-500" />,
      color: 'bg-green-500/10 border-green-500/20'
    },
    { 
      title: 'Global Rank', 
      value: `#${userRank || '---'}`, 
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-500/10 border-blue-500/20'
    },
    { 
      title: 'Days Active', 
      value: daysActive || 0, 
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-500/10 border-purple-500/20'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.displayName || 'Hacker'}</h1>
        <p className="text-gray-400">Track your progress and discover new challenges</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-lg border ${stat.color} bg-card-bg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-800">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card-bg rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Recent Challenges</h2>
              <Link to="/challenges" className="text-primary hover:text-accent text-sm flex items-center">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-border">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading challenges...</div>
            ) : recentChallenges.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No challenges available yet</div>
            ) : (
              recentChallenges.map((challenge) => (
                <div key={challenge.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                  <Link to={`/challenges/${challenge.id}`} className="block">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-white">{challenge.title}</h3>
                        <div className="flex items-center mt-1 space-x-3 text-sm">
                          <span className="text-gray-400">{challenge.category}</span>
                          <span className="text-gray-600">•</span>
                          <span className={`
                            ${challenge.difficulty === 'easy' ? 'text-green-500' : ''}
                            ${challenge.difficulty === 'medium' ? 'text-yellow-500' : ''}
                            ${challenge.difficulty === 'hard' ? 'text-orange-500' : ''}
                            ${challenge.difficulty === 'insane' ? 'text-red-500' : ''}
                          `}>
                            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-gray-800 rounded-lg px-3 py-1 text-primary font-medium">
                          {challenge.points} pts
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="bg-card-bg rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-white">Leaderboard</h2>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {topUsers.map((topUser, position) => (
                <div key={topUser.uid} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 text-gray-500 font-medium">#{position + 1}</div>
                    <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center ml-3">
                      {topUser.photoURL ? (
                        <img 
                          src={topUser.photoURL} 
                          alt={topUser.displayName} 
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {topUser.displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-white font-medium">{topUser.displayName}</div>
                    </div>
                  </div>
                  <div className="text-primary font-medium">{topUser.points} pts</div>
                </div>
              ))}
              {topUsers.length === 0 && !loading && (
                <div className="text-center text-gray-500 py-4">
                  No users found
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <Link 
                to="/leaderboard" 
                className="block text-center text-primary hover:text-accent py-2"
              >
                View full leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;