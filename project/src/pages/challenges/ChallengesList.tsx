import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Users, 
  Trophy,
  BarChart,
  Target,
  Tag,
  Layers,
  Flame
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCategoryIcon } from '@/lib/icons';
import Button from '@/components/ui/Button';
import { ChallengeService } from '@/services/ChallengeService';

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

const ChallengesList = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState({
    totalChallenges: 0,
    solvedChallenges: 0,
    totalPoints: 0,
    earnedPoints: 0
  });
  
  const categories = ['Web', 'Crypto', 'Forensics', 'Reverse Engineering', 'Binary Exploitation', 'OSINT'];
  const difficulties = ['easy', 'medium', 'hard', 'insane'];
  
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await ChallengeService.fetchChallenges();
      setChallenges(data);

      // Calculate stats
      const totalPoints = data.reduce((sum, challenge) => sum + challenge.points, 0);
      setStats({
        totalChallenges: data.length,
        solvedChallenges: data.filter(c => c.solved_count > 0).length,
        totalPoints,
        earnedPoints: data.filter(c => c.solved_count > 0).reduce((sum, c) => sum + c.points, 0)
      });
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? challenge.category === selectedCategory : true;
    const matchesDifficulty = selectedDifficulty ? challenge.difficulty === selectedDifficulty : true;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'hard': return 'bg-orange-500/20 text-orange-500';
      default: return 'bg-red-500/20 text-red-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Challenges</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalChallenges}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <Layers className="h-6 w-6 text-cyan-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Solved Challenges</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.solvedChallenges}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Available Points</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalPoints}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Your Points</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.earnedPoints}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <Target className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white">Your Progress</h2>
          <span className="text-gray-400 text-sm">
            {stats.solvedChallenges} / {stats.totalChallenges} completed
          </span>
        </div>
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ 
              width: `${(stats.solvedChallenges / stats.totalChallenges) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search challenges by name or description..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Tag className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Flame className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="flex rounded-md shadow-sm">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                  className="rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <Layers className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'secondary'}
                  className="rounded-l-none"
                  onClick={() => setViewMode('list')}
                >
                  <BarChart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Cards */}
        {viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : filteredChallenges.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No challenges found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                filteredChallenges.map((challenge) => {
                  const CategoryIcon = getCategoryIcon(challenge.category);
                  
                  return (
                    <Link
                      key={challenge.id}
                      to={`/challenges/${challenge.id}`}
                      className={`block bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors overflow-hidden group`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            {challenge.icon ? (
                              <img 
                                src={challenge.icon} 
                                alt={challenge.title}
                                className="w-8 h-8 mr-3"
                              />
                            ) : (
                              <div className="p-2 bg-gray-700 rounded-lg mr-3">
                                <CategoryIcon className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-white group-hover:text-cyan-500 transition-colors">
                                {challenge.title}
                              </h3>
                              <span className="text-sm text-gray-400">{challenge.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                          {challenge.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                            </span>
                            <span className="text-gray-500 text-sm flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {challenge.solved_count}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-yellow-500 font-medium">{challenge.points}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Solved By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Loading challenges...
                    </td>
                  </tr>
                ) : filteredChallenges.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No challenges found
                    </td>
                  </tr>
                ) : (
                  filteredChallenges.map((challenge) => {
                    const CategoryIcon = getCategoryIcon(challenge.category);
                    return (
                      <tr 
                        key={challenge.id} 
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/challenges/${challenge.id}`} className="flex items-center text-white font-medium hover:text-cyan-500">
                            {challenge.icon ? (
                              <img 
                                src={challenge.icon} 
                                alt={challenge.title}
                                className="w-6 h-6 mr-2"
                              />
                            ) : (
                              <CategoryIcon className="w-5 h-5 mr-2 text-gray-400" />
                            )}
                            {challenge.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          {challenge.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-cyan-500 font-medium">{challenge.points}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          {challenge.solved_count}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesList;