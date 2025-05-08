import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [pendingChallenges, setPendingChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  
  const fetchPendingChallenges = async () => {
    try {
      const q = query(
        collection(db, 'challenges'),
        where('approved', '==', false),
        where('rejected', '==', false), // Only fetch non-rejected challenges
        where('pending', '==', true) // Only fetch pending challenges
      );
      
      const querySnapshot = await getDocs(q);
      const challenges: any[] = [];
      
      querySnapshot.forEach((doc) => {
        challenges.push({ id: doc.id, ...doc.data() });
      });
      
      setPendingChallenges(challenges);
    } catch (error) {
      console.error('Error fetching pending challenges:', error);
      toast.error('Failed to load pending challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      toast.error('You do not have permission to access the admin panel');
    }
    
    if (user && user.role === 'admin') {
      fetchPendingChallenges();
    }
  }, [user, navigate]);
  
  const handleApprove = async (challengeId: string) => {
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        approved: true,
        approvedAt: new Date(),
        approvedBy: user?.uid
      });
      
      // Update local state
      setPendingChallenges(pendingChallenges.filter(challenge => challenge.id !== challengeId));
      setSelectedChallenge(null);
      
      toast.success('Challenge approved successfully!');
      
      // Refresh the pending challenges list
      await fetchPendingChallenges();
    } catch (error) {
      console.error('Error approving challenge:', error);
      toast.error('Failed to approve challenge');
    }
  };
  
  const handleReject = async (challengeId: string) => {
    if (!rejectionNote.trim()) {
      toast.error('Please provide rejection feedback');
      return;
    }

    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        rejected: true,
        rejectedAt: new Date(),
        rejectedBy: user?.uid,
        rejectionNote: rejectionNote,
        status: 'rejected',
        approved: false, // Set approved to false
        pending: false // Remove from pending state
      });
      
      // Update local state
      setPendingChallenges(pendingChallenges.filter(challenge => challenge.id !== challengeId));
      setSelectedChallenge(null);
      setRejectionNote('');
      
      toast.success('Challenge rejected with feedback');
    } catch (error) {
      console.error('Error rejecting challenge:', error);
      toast.error('Failed to reject challenge');
    }
  };

  if (user && user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-gray-400">Manage challenges and platform settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Pending Challenges</h2>
          </div>
          
          <div className="overflow-y-auto max-h-[600px]">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading challenges...</div>
            ) : pendingChallenges.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No pending challenges</div>
            ) : (
              <div className="divide-y divide-gray-800">
                {pendingChallenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    className={`w-full p-4 text-left hover:bg-gray-800/50 transition-colors ${
                      selectedChallenge?.id === challenge.id ? 'bg-gray-800' : ''
                    }`}
                    onClick={() => setSelectedChallenge(challenge)}
                  >
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
                    <div className="text-sm text-gray-500 mt-1">
                      By {challenge.createdBy}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Challenge Details</h2>
          </div>
          
          {selectedChallenge ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedChallenge.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {selectedChallenge.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedChallenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
                    selectedChallenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                    selectedChallenge.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {selectedChallenge.difficulty.charAt(0).toUpperCase() + selectedChallenge.difficulty.slice(1)}
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-500 px-3 py-1 rounded-full text-sm">
                    {selectedChallenge.points} points
                  </span>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                  <p className="text-gray-300 whitespace-pre-line">{selectedChallenge.description}</p>
                </div>
                
                {selectedChallenge.targetUrl && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Target URL</h4>
                    <a 
                      href={selectedChallenge.targetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-500 hover:text-cyan-400"
                    >
                      {selectedChallenge.targetUrl}
                    </a>
                  </div>
                )}
                
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Flag</h4>
                  <p className="font-mono bg-gray-900 p-2 rounded text-gray-300">{selectedChallenge.flag}</p>
                </div>
                
                {selectedChallenge.hints && selectedChallenge.hints.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Hints</h4>
                    <ul className="space-y-2">
                      {selectedChallenge.hints.map((hint: string, index: number) => (
                        <li key={index} className="bg-gray-900 p-2 rounded text-gray-300">
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rejection Feedback
                </label>
                <textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows={4}
                  placeholder="Provide feedback about why the challenge was rejected..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <Button
                  variant="danger"
                  onClick={() => handleReject(selectedChallenge.id)}
                  className="flex items-center"
                  disabled={!rejectionNote.trim()}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Reject with Feedback
                </Button>
                <Button
                  onClick={() => handleApprove(selectedChallenge.id)}
                  className="flex items-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-3 text-gray-600" />
              <p>Select a challenge to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;