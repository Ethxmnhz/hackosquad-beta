import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types';
import { Trophy, Medal, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Leaderboard = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('points', 'desc'),
          limit(100)
        );
        
        const querySnapshot = await getDocs(q);
        const leaderboardUsers: User[] = [];
        
        querySnapshot.forEach((doc) => {
          leaderboardUsers.push({ ...doc.data() } as User);
        });
        
        setUsers(leaderboardUsers);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  const filteredUsers = users.filter((user) => 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getUserRank = (userId: string) => {
    return users.findIndex(user => user.uid === userId) + 1;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">See who's leading the pack in the hacking challenges</p>
      </div>
      
      {currentUser && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-cyan-500">
                  {getUserRank(currentUser.uid)}
                </div>
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-bold text-white">Your Ranking</h2>
                <div className="mt-1 flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-gray-300">
                    {currentUser.displayName} • {currentUser.points} points • {currentUser.solvedChallenges?.length || 0} challenges solved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-bold text-white">Top Hackers</h2>
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Points
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Challenges Solved
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Loading leaderboard...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user.uid} 
                    className={`hover:bg-gray-800/50 transition-colors ${
                      currentUser?.uid === user.uid ? 'bg-cyan-900/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <Medal className="h-6 w-6 text-yellow-500" />
                          <span className="ml-2 font-bold text-yellow-500">1st</span>
                        </div>
                      ) : index === 1 ? (
                        <div className="flex items-center">
                          <Medal className="h-6 w-6 text-gray-400" />
                          <span className="ml-2 font-bold text-gray-400">2nd</span>
                        </div>
                      ) : index === 2 ? (
                        <div className="flex items-center">
                          <Medal className="h-6 w-6 text-amber-700" />
                          <span className="ml-2 font-bold text-amber-700">3rd</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-medium">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                          {user.photoURL ? (
                            <img 
                              src={user.photoURL} 
                              alt={user.displayName} 
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium">
                              {user.displayName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-white font-medium">
                            {user.displayName}
                            {currentUser?.uid === user.uid && (
                              <span className="ml-2 text-xs bg-cyan-500/20 text-cyan-500 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-cyan-500 font-medium">{user.points}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {user.solvedChallenges?.length || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;