import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from './auth/LoginModal';
import { SignupModal } from './auth/SignupModal';
import { PasswordResetModal } from './auth/PasswordResetModal';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface NavbarProps {
  onOpenSignup?: () => void;
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSignup, onOpenLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleOpenSignup = () => {
    if (onOpenSignup) {
      onOpenSignup();
    } else {
      setSignupOpen(true);
    }
  };

  const handleOpenLogin = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                viralink.pro
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {!user ? (
                <>
                  <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-purple-600 transition-colors">Features</button>
                  <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-purple-600 transition-colors">Pricing</button>
                  <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-purple-600 transition-colors">FAQ</button>
                  <Button variant="outline" onClick={handleOpenLogin}>Log In</Button>
                  <Button onClick={handleOpenSignup}>Sign Up</Button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/dashboard')} className="text-gray-700 hover:text-purple-600 transition-colors">Dashboard</button>
                  <button onClick={() => navigate('/templates')} className="text-gray-700 hover:text-purple-600 transition-colors">Templates</button>
                  <button onClick={() => navigate('/analytics')} className="text-gray-700 hover:text-purple-600 transition-colors">Analytics</button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {user.email?.[0].toUpperCase()}
                        </div>
                        <span className="text-sm">{profile?.tier === 'pro' ? '⭐ Pro' : 'Free'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>Log Out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              {!user ? (
                <>
                  <button onClick={() => scrollToSection('features')} className="block w-full text-left text-gray-700">Features</button>
                  <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-gray-700">Pricing</button>
                  <button onClick={() => scrollToSection('faq')} className="block w-full text-left text-gray-700">FAQ</button>
                  <Button variant="outline" className="w-full" onClick={handleOpenLogin}>Log In</Button>
                  <Button className="w-full" onClick={handleOpenSignup}>Sign Up</Button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/dashboard')} className="block w-full text-left text-gray-700">Dashboard</button>
                  <button onClick={() => navigate('/templates')} className="block w-full text-left text-gray-700">Templates</button>
                  <button onClick={() => navigate('/analytics')} className="block w-full text-left text-gray-700">Analytics</button>
                  <button onClick={() => navigate('/profile')} className="block w-full text-left text-gray-700">Profile</button>
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>Log Out</Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {!onOpenSignup && <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onSwitchToSignup={() => { setLoginOpen(false); setSignupOpen(true); }} onForgotPassword={() => { setLoginOpen(false); setResetOpen(true); }} />}

      {!onOpenSignup && <SignupModal open={signupOpen} onOpenChange={setSignupOpen} onSwitchToLogin={() => { setSignupOpen(false); setLoginOpen(true); }} />}
      {!onOpenSignup && <PasswordResetModal open={resetOpen} onOpenChange={setResetOpen} onSwitchToLogin={() => { setResetOpen(false); setLoginOpen(true); }} />}
    </>
  );
};
