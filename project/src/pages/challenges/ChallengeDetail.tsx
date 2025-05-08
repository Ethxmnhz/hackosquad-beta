import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Download, ExternalLink, Flag, AlertTriangle, LockKeyhole, Award, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
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

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingFlag, setSubmittingFlag] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [showHints, setShowHints] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return;
      
      try {
        const challenges = await ChallengeService.fetchChallenges();
        const challengeData = challenges.find(c => c.id === parseInt(id));
        
        if (challengeData) {
          setChallenge(challengeData);
          if (challengeData.hints) {
            setShowHints(new Array(challengeData.hints.length).fill(false));
          }
        } else {
          toast.error('Challenge not found');
          navigate('/challenges');
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
        toast.error('Error loading challenge');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenge();
  }, [id, navigate]);
  
  const toggleHint = (index: number) => {
    const newShowHints = [...showHints];
    newShowHints[index] = !newShowHints[index];
    setShowHints(newShowHints);
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!challenge || !user) return;
    
    setSubmittingFlag(true);
    
    try {
      const result = await ChallengeService.solveChallenge(challenge.id, flagInput);
      toast.success(`Congratulations! You earned ${result.points} points!`);
      // Refresh challenge data to update solved count
      const challenges = await ChallengeService.fetchChallenges();
      const updatedChallenge = challenges.find(c => c.id === challenge.id);
      if (updatedChallenge) {
        setChallenge(updatedChallenge);
      }
    } catch (error: any) {
      toast.error(error.message || 'Incorrect flag. Try again!');
    } finally {
      setSubmittingFlag(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-800 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Challenge not found</h2>
        <Button onClick={() => navigate('/challenges')}>Back to Challenges</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{challenge.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            {challenge.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
            challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
            challenge.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-500' :
            'bg-red-500/20 text-red-500'
          }`}>
            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
          </span>
          <span className="bg-cyan-500/20 text-cyan-500 px-3 py-1 rounded-full text-sm">
            {challenge.points} points
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Description</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-300 whitespace-pre-line">{challenge.description}</p>
            </div>
          </div>
          
          {challenge.target_url && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Target</h2>
              </div>
              <div className="p-6">
                <a 
                  href={challenge.target_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-cyan-500 hover:text-cyan-400"
                >
                  {challenge.target_url}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
                <div className="mt-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-400">
                      This challenge involves interacting with a remote target. Please ensure you only attack the designated target and follow responsible disclosure practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {challenge.hints && challenge.hints.length > 0 && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Hints</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {challenge.hints.map((hint, index) => (
                    <li key={index} className="border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleHint(index)}
                        className="w-full p-4 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        <span className="font-medium text-gray-300">Hint #{index + 1}</span>
                        <LockKeyhole className={`h-5 w-5 ${showHints[index] ? 'text-cyan-500' : 'text-gray-500'}`} />
                      </button>
                      {showHints[index] && (
                        <div className="p-4 bg-gray-800/50">
                          <p className="text-gray-300">{hint}</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden sticky top-4">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Submit Flag</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleFlagSubmit}>
                <div className="mb-4">
                  <label htmlFor="flag" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter the flag
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Flag className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="flag"
                      placeholder="flag{...}"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      value={flagInput}
                      onChange={(e) => setFlagInput(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={submittingFlag}
                >
                  Submit Flag
                </Button>
              </form>
              
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="text-sm text-gray-400">
                  <p className="mb-2">
                    <span className="font-medium text-gray-300">Solved by:</span> {challenge.solved_count} users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;