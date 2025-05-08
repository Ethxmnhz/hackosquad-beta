import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Plus, FileText, Clock, CheckCircle, XCircle, Trash } from 'lucide-react';
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
  approved: boolean;
  rejected: boolean;
  rejection_note?: string;
  solved_count: number;
}

const CreatorZone = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showRejectionFeedback, setShowRejectionFeedback] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'insane'>('easy');
  const [points, setPoints] = useState(100);
  const [flag, setFlag] = useState('');
  const [hints, setHints] = useState<string[]>(['']);
  const [targetUrl, setTargetUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [icon, setIcon] = useState('');

  const categories = ['Web', 'Crypto', 'Forensics', 'Reverse Engineering', 'Binary Exploitation', 'OSINT'];
  const difficulties = ['easy', 'medium', 'hard', 'insane'];

  const fetchUserChallenges = async () => {
    try {
      const data = await ChallengeService.fetchUserChallenges();
      setChallenges(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load your challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserChallenges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await ChallengeService.createChallenge({
        title,
        description,
        category,
        difficulty,
        points,
        flag,
        target_url: targetUrl,
        icon,
        hints: hints.filter(hint => hint.trim() !== '')
      });

      toast.success('Challenge created successfully!');
      setShowCreateForm(false);
      resetForm();
      fetchUserChallenges();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create challenge');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Web');
    setDifficulty('easy');
    setPoints(100);
    setFlag('');
    setHints(['']);
    setTargetUrl('');
    setIcon('');
  };

  const handleAddHint = () => {
    setHints([...hints, '']);
  };

  const handleRemoveHint = (index: number) => {
    setHints(hints.filter((_, i) => i !== index));
  };

  const handleHintChange = (index: number, value: string) => {
    const newHints = [...hints];
    newHints[index] = value;
    setHints(newHints);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Creator Zone</h1>
          <p className="text-gray-400">Create and manage your cybersecurity challenges</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-5 w-5 mr-2" />
          Create Challenge
        </Button>
      </div>

      {showCreateForm && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Create New Challenge</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Points</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100"
                    min="100"
                    step="100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Flag</label>
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100"
                  placeholder="flag{...}"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">Hints</label>
                  <button
                    type="button"
                    onClick={handleAddHint}
                    className="text-sm text-cyan-500 hover:text-cyan-400"
                  >
                    + Add Hint
                  </button>
                </div>
                <div className="space-y-3">
                  {hints.map((hint, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={hint}
                        onChange={(e) => handleHintChange(index, e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100"
                        placeholder={`Hint ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHint(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target URL (Optional)</label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Icon URL (Optional)</label>
                <input
                  type="url"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100"
                  placeholder="https://example.com/icon.svg"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={submitting}
                >
                  Create Challenge
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Your Challenges</h2>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading challenges...</div>
          ) : challenges.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-600" />
              <p>You haven't created any challenges yet</p>
            </div>
          ) : (
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
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Solved By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {challenges.map((challenge) => (
                  <tr key={challenge.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-medium">{challenge.title}</span>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {challenge.approved ? (
                        <span className="inline-flex items-center text-green-500">
                          <CheckCircle className="h-4 w-4 mr-1" /> Approved
                        </span>
                      ) : challenge.rejected ? (
                        <span className="inline-flex items-center text-red-500">
                          <XCircle className="h-4 w-4 mr-1" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-yellow-500">
                          <Clock className="h-4 w-4 mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {challenge.solved_count || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorZone;