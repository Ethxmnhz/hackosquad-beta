import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Challenge } from '@/types';
import { 
  Shield, 
  Award, 
  Medal, 
  AlignCenterVertical as Certificate, 
  Calendar, 
  User as UserIcon, 
  Mail, 
  Flag,
  Trophy,
  Lock
} from 'lucide-react';
import Button from '@/components/ui/Button';

const Profile = () => {
  const { user } = useAuth();
  const [solvedChallenges, setSolvedChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'certificates' | 'challenges'>('overview');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch solved challenges
        if (user.solvedChallenges && user.solvedChallenges.length > 0) {
          const challengesData: Challenge[] = [];
          
          for (const challengeId of user.solvedChallenges) {
            const challengeDoc = await getDoc(doc(db, 'challenges', challengeId));
            if (challengeDoc.exists()) {
              challengesData.push({ id: challengeDoc.id, ...challengeDoc.data() } as Challenge);
            }
          }
          
          setSolvedChallenges(challengesData);
        }
        
        // Fetch badges (simulated for now)
        const mockBadges = [
          { id: '1', name: 'First Blood', description: 'First to solve a challenge', icon: 'award', color: 'text-red-500', earned: true, date: new Date('2023-10-15') },
          { id: '2', name: 'Web Warrior', description: 'Solved 5 web challenges', icon: 'globe', color: 'text-blue-500', earned: true, date: new Date('2023-10-20') },
          { id: '3', name: 'Crypto Master', description: 'Solved 5 crypto challenges', icon: 'key', color: 'text-yellow-500', earned: false },
          { id: '4', name: 'Forensics Expert', description: 'Solved 5 forensics challenges', icon: 'search', color: 'text-green-500', earned: false },
          { id: '5', name: 'Top 10', description: 'Reached top 10 on the leaderboard', icon: 'trophy', color: 'text-purple-500', earned: true, date: new Date('2023-11-01') },
        ];
        setBadges(mockBadges);
        
        // Fetch certificates (simulated for now)
        const mockCertificates = [
          { id: '1', name: 'CTF Participant', description: 'Successfully participated in HackoSquad CTF 2023', date: new Date('2023-11-15'), image: 'https://images.unsplash.com/photo-1569098644584-210bcd375b59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
          { id: '2', name: 'Web Security Specialist', description: 'Demonstrated expertise in web security challenges', date: new Date('2023-11-20'), image: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' },
        ];
        setCertificates(mockCertificates);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
        <p className="text-gray-400">View your achievements, badges, and certificates</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden sticky top-4">
            <div className="p-6 border-b border-gray-800 flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="h-24 w-24 rounded-full"
                  />
                ) : (
                  <UserIcon className="h-12 w-12 text-gray-600" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{user.displayName}</h2>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
              <div className="mt-3 flex items-center bg-gray-800 rounded-full px-3 py-1">
                <span className="text-cyan-500 font-medium mr-1">{user.points || 0}</span>
                <span className="text-gray-400 text-sm">points</span>
              </div>
            </div>
            
            <div className="p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-3 py-2 rounded-md ${
                    activeTab === 'overview' 
                      ? 'bg-gray-800 text-cyan-500' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <UserIcon className="h-5 w-5 mr-3" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('badges')}
                  className={`w-full flex items-center px-3 py-2 rounded-md ${
                    activeTab === 'badges' 
                      ? 'bg-gray-800 text-cyan-500' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Award className="h-5 w-5 mr-3" />
                  Badges
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`w-full flex items-center px-3 py-2 rounded-md ${
                    activeTab === 'certificates' 
                      ? 'bg-gray-800 text-cyan-500' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Certificate className="h-5 w-5 mr-3" />
                  Certificates
                </button>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className={`w-full flex items-center px-3 py-2 rounded-md ${
                    activeTab === 'challenges' 
                      ? 'bg-gray-800 text-cyan-500' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Flag className="h-5 w-5 mr-3" />
                  Solved Challenges
                </button>
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <Button variant="secondary" className="w-full">
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">User Information</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Display Name</div>
                      <div className="text-white font-medium">{user.displayName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Email</div>
                      <div className="text-white font-medium">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Role</div>
                      <div className="text-white font-medium capitalize">{user.role}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Member Since</div>
                      <div className="text-white font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold text-white">Stats</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-400">Points</div>
                          <div className="text-2xl font-bold text-cyan-500 mt-1">{user.points || 0}</div>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-700">
                          <Trophy className="h-6 w-6 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-400">Challenges Solved</div>
                          <div className="text-2xl font-bold text-cyan-500 mt-1">{user.solvedChallenges?.length || 0}</div>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-700">
                          <Flag className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-400">Badges Earned</div>
                          <div className="text-2xl font-bold text-cyan-500 mt-1">{badges.filter(b => b.earned).length}</div>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-700">
                          <Award className="h-6 w-6 text-purple-500" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-400">Certificates</div>
                          <div className="text-2xl font-bold text-cyan-500 mt-1">{certificates.length}</div>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-700">
                          <Certificate className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Recent Badges</h2>
                  </div>
                  <div className="p-6">
                    {badges.filter(b => b.earned).slice(0, 3).map((badge) => (
                      <div key={badge.id} className="flex items-center mb-4 last:mb-0">
                        <div className={`p-2 rounded-lg bg-gray-800 ${badge.color}`}>
                          <Award className="h-6 w-6" />
                        </div>
                        <div className="ml-3">
                          <div className="text-white font-medium">{badge.name}</div>
                          <div className="text-sm text-gray-400">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                    {badges.filter(b => b.earned).length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        No badges earned yet
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Recent Challenges</h2>
                  </div>
                  <div className="p-6">
                    {solvedChallenges.slice(0, 3).map((challenge) => (
                      <div key={challenge.id} className="flex items-center mb-4 last:mb-0">
                        <div className="p-2 rounded-lg bg-gray-800 text-cyan-500">
                          <Flag className="h-6 w-6" />
                        </div>
                        <div className="ml-3">
                          <div className="text-white font-medium">{challenge.title}</div>
                          <div className="text-sm text-gray-400">{challenge.category} • {challenge.points} points</div>
                        </div>
                      </div>
                    ))}
                    {solvedChallenges.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        No challenges solved yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'badges' && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Badges</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className={`bg-gray-800 rounded-lg p-4 border ${badge.earned ? 'border-gray-700' : 'border-gray-800 opacity-50'}`}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg bg-gray-700 ${badge.color}`}>
                          <Award className="h-6 w-6" />
                        </div>
                        <div className="ml-3">
                          <div className="text-white font-medium">{badge.name}</div>
                          {badge.earned && badge.date && (
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {badge.date.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{badge.description}</p>
                      {!badge.earned && (
                        <div className="mt-3 text-xs text-gray-500 flex items-center">
                          <Lock className="h-3 w-3 mr-1" />
                          Not yet earned
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'certificates' && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Certificates</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="bg-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src={certificate.image} 
                        alt={certificate.name} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white">{certificate.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{certificate.description}</p>
                        <div className="flex items-center mt-3 text-xs text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          Issued on {certificate.date.toLocaleDateString()}
                        </div>
                        <div className="mt-4">
                          <Button size="sm" className="w-full">
                            View Certificate
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {certificates.length === 0 && (
                    <div className="col-span-2 text-center text-gray-500 py-8">
                      <Certificate className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                      <p>No certificates earned yet</p>
                      <p className="mt-2 text-sm">
                        Complete challenges and participate in events to earn certificates
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'challenges' && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Solved Challenges</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center text-gray-500 py-4">
                    Loading challenges...
                  </div>
                ) : solvedChallenges.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Flag className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                    <p>You haven't solved any challenges yet</p>
                    <p className="mt-2 text-sm">
                      Head over to the challenges page to start solving
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Challenge
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Difficulty
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-900 divide-y divide-gray-800">
                        {solvedChallenges.map((challenge) => (
                          <tr key={challenge.id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white font-medium">{challenge.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                              {challenge.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
                                challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                challenge.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-500' :
                                'bg-red-500/20 text-red-500'
                              }`}>
                                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-cyan-500 font-medium">{challenge.points}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;