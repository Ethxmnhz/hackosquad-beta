import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, Bell, Shield, User, Palette } from 'lucide-react';
import Button from '@/components/ui/Button';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const { themes, setTheme, currentTheme } = useTheme();
  const [showThemes, setShowThemes] = React.useState(false);

  return (
    <header className="bg-card-bg border-b border-border py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white mr-4 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center lg:hidden">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-lg font-bold text-white">HackoSquad</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="hidden md:flex items-center bg-gray-800 rounded-full px-3 py-1">
              <span className="text-primary font-medium mr-1">{user.points || 0}</span>
              <span className="text-gray-400 text-sm">points</span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowThemes(!showThemes)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"
              >
                <Palette size={20} />
              </button>
              
              {showThemes && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-card-bg border border-border shadow-lg py-1 z-50">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setTheme(theme.id);
                        setShowThemes(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-800 ${
                        currentTheme.id === theme.id ? 'text-primary' : 'text-gray-300'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="text-gray-400 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            <Link to="/profile" className="text-gray-400 hover:text-white">
              <User size={20} />
            </Link>
          </>
        ) : (
          <div className="flex space-x-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;