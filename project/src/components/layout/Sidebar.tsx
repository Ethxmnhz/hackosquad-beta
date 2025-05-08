import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  FileCode, 
  Settings, 
  LogOut, 
  Shield, 
  PlusCircle,
  BarChart3,
  User,
  MessageSquare
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Challenges', path: '/challenges', icon: <Trophy size={20} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <BarChart3 size={20} /> },
    { name: 'Creator Zone', path: '/creator', icon: <FileCode size={20} /> },
    { name: 'Community', path: '/community', icon: <MessageSquare size={20} /> },
  ];

  const adminItems = [
    { name: 'Admin Panel', path: '/admin', icon: <Shield size={20} /> },
    { name: 'Approve Challenges', path: '/admin/challenges', icon: <PlusCircle size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-100 flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-cyan-500" />
          <h1 className="text-xl font-bold">HackoSquad</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg ${
                    isActive
                      ? 'bg-gray-800 text-cyan-500'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
          
          {isAdmin && (
            <>
              <li className="pt-4 pb-2">
                <div className="text-xs uppercase text-gray-500 font-semibold px-2">
                  Admin
                </div>
              </li>
              {adminItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg ${
                        isActive
                          ? 'bg-gray-800 text-cyan-500'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <Link to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <span className="text-sm font-medium">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium">{user?.displayName || user?.email}</div>
              <div className="text-xs text-gray-500">{user?.role}</div>
            </div>
          </Link>
          <button 
            onClick={logout}
            className="text-gray-400 hover:text-white"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;