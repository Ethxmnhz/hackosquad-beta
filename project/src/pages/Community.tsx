import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Send, Users, MessageSquare, Hash, Search, PlusCircle, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  timestamp: any;
  channel: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
}

const Community = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [newChannelIsPublic, setNewChannelIsPublic] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch channels
    const fetchChannels = async () => {
      try {
        // In a real app, you would fetch channels from Firestore
        // For now, we'll use mock data
        const mockChannels: Channel[] = [
          { id: 'general', name: 'general', description: 'General discussion about CTF and cybersecurity', isPublic: true },
          { id: 'help', name: 'help', description: 'Get help with challenges', isPublic: true },
          { id: 'web', name: 'web', description: 'Web security discussions', isPublic: true },
          { id: 'crypto', name: 'crypto', description: 'Cryptography discussions', isPublic: true },
          { id: 'forensics', name: 'forensics', description: 'Digital forensics discussions', isPublic: true },
        ];
        
        setChannels(mockChannels);
        setActiveChannel(mockChannels[0]);
      } catch (error) {
        console.error('Error fetching channels:', error);
        toast.error('Failed to load channels');
      }
    };
    
    fetchChannels();
  }, []);

  useEffect(() => {
    if (!activeChannel) return;
    
    // Set up real-time listener for messages in the active channel
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc'),
      // In a real app, you would filter by channel ID
      // where('channel', '==', activeChannel.id)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      
      // Filter messages for the active channel
      // In a real app, this filtering would happen in the Firestore query
      const filteredMessages = fetchedMessages.filter(msg => msg.channel === activeChannel.id);
      
      setMessages(filteredMessages);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [activeChannel]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !activeChannel || messageInput.trim() === '') return;
    
    try {
      await addDoc(collection(db, 'messages'), {
        content: messageInput,
        userId: user.uid,
        userName: user.displayName,
        userPhotoURL: user.photoURL || null,
        timestamp: serverTimestamp(),
        channel: activeChannel.id
      });
      
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || newChannelName.trim() === '') return;
    
    try {
      // In a real app, you would create a new channel in Firestore
      const newChannel: Channel = {
        id: newChannelName.toLowerCase().replace(/\s+/g, '-'),
        name: newChannelName,
        description: newChannelDescription,
        isPublic: newChannelIsPublic
      };
      
      setChannels([...channels, newChannel]);
      setActiveChannel(newChannel);
      setShowNewChannelModal(false);
      
      // Reset form
      setNewChannelName('');
      setNewChannelDescription('');
      setNewChannelIsPublic(true);
      
      toast.success('Channel created successfully!');
    } catch (error) {
      console.error('Error creating channel:', error);
      toast.error('Failed to create channel');
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Please log in to access the community</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
        <p className="text-gray-400">Connect with other hackers and share knowledge</p>
      </div>
      
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="flex h-[calc(100vh-16rem)]">
          {/* Channels Sidebar */}
          <div className="w-64 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search channels..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Channels
                  </h3>
                  <button 
                    onClick={() => setShowNewChannelModal(true)}
                    className="text-gray-400 hover:text-white"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-2 space-y-1 px-2">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={`flex items-center px-2 py-1.5 rounded-md w-full text-left ${
                      activeChannel?.id === channel.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    <span className="truncate">{channel.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="px-4 pt-6 pb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Online Users
                </h3>
              </div>
              
              <div className="mt-2 space-y-1 px-2">
                <div className="flex items-center px-2 py-1.5 text-gray-400">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>User1</span>
                </div>
                <div className="flex items-center px-2 py-1.5 text-gray-400">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>User2</span>
                </div>
                <div className="flex items-center px-2 py-1.5 text-gray-400">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>User3</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Channel Header */}
            {activeChannel && (
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <Hash className="h-5 w-5 text-gray-400 mr-2" />
                    <h2 className="text-lg font-bold text-white">{activeChannel.name}</h2>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{activeChannel.description}</p>
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="h-5 w-5 mr-2" />
                  <span>3</span>
                </div>
              </div>
            )}
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageSquare className="h-12 w-12 mb-3" />
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Be the first to send a message!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                          {message.userPhotoURL ? (
                            <img 
                              src={message.userPhotoURL} 
                              alt={message.userName} 
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <span className="text-sm font-medium">
                              {message.userName.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-white">{message.userName}</span>
                          <span className="text-xs text-gray-500 ml-2">{formatTimestamp(message.timestamp)}</span>
                        </div>
                        <div className="mt-1 text-gray-300">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-800">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message #${activeChannel?.name || 'channel'}`}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-l-md bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <Button
                  type="submit"
                  className="rounded-l-none"
                  disabled={!messageInput.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Channel Modal */}
      {showNewChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-md">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Create New Channel</h2>
            </div>
            <form onSubmit={handleCreateChannel}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="channelName" className="block text-sm font-medium text-gray-300 mb-1">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    id="channelName"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="channelDescription" className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="channelDescription"
                    value={newChannelDescription}
                    onChange={(e) => setNewChannelDescription(e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="channelIsPublic"
                    checked={newChannelIsPublic}
                    onChange={(e) => setNewChannelIsPublic(e.target.checked)}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-700 rounded bg-gray-800"
                  />
                  <label htmlFor="channelIsPublic" className="ml-2 block text-sm text-gray-300">
                    Public channel
                  </label>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-start">
                  <Info className="h-5 w-5 text-cyan-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-400">
                    Public channels can be joined by anyone. Private channels require an invitation.
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-800 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowNewChannelModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!newChannelName.trim()}
                >
                  Create Channel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;