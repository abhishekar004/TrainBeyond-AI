import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, Trophy, Menu, X } from 'lucide-react';

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        to="/workouts"
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
          location.pathname === '/workouts' ? 'text-primary' : 'text-foreground/80'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <Dumbbell className="h-4 w-4" />
        Workouts
      </Link>
      {user && (
        <Link
          to="/progress"
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            location.pathname === '/progress' ? 'text-primary' : 'text-foreground/80'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Trophy className="h-4 w-4" />
          Progress
        </Link>
      )}
      <Link
        to="/about"
        className={`transition-colors hover:text-primary ${
          location.pathname === '/about' ? 'text-primary' : 'text-foreground/80'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        About
      </Link>
    </>
  );

  const authLinks = user ? (
    <div className="flex flex-col gap-2 mt-4 md:mt-0 md:flex-row md:items-center md:space-x-2">
      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
        <Button
          variant={location.pathname === '/profile' ? 'default' : 'ghost'}
          className="transition-colors w-full md:w-auto"
        >
          Profile
        </Button>
      </Link>
      <Button variant="outline" onClick={() => { setMobileMenuOpen(false); signOut(); }} className="w-full md:w-auto">
        Sign Out
      </Button>
    </div>
  ) : (
    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
      <Button variant={location.pathname === '/auth' ? 'secondary' : 'default'} className="w-full md:w-auto">
        Sign In
      </Button>
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link
            to={user ? "/home" : "/"}
            className="mr-6 flex items-center space-x-2 font-bold hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Dumbbell className="h-6 w-6" />
            <span className="font-bold text-lg">TrainBeyond AI</span>
          </Link>
          {/* Left-aligned nav links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-4">
            {navLinks}
          </nav>
        </div>
        {/* Auth links right-aligned */}
        <div className="hidden md:flex items-center space-x-2">
          {authLinks}
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden ml-auto p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Open navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        {/* Mobile Menu Overlay rendered via Portal */}
        {mobileMenuOpen && ReactDOM.createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/60 flex flex-col md:hidden">
            <div className="bg-background w-full h-full flex flex-col justify-start p-6 pt-16 overflow-y-auto relative">
              {/* Close button at top right */}
              <button
                className="absolute top-4 right-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
              {/* Logo centered below close button */}
              <div className="flex flex-col items-center mb-6">
                <Link
                  to={user ? "/home" : "/"}
                  className="flex items-center space-x-2 font-bold hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Dumbbell className="h-6 w-6" />
                  <span className="font-bold text-lg">TrainBeyond AI</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 text-lg font-medium w-full">
                {navLinks}
              </nav>
              <div className="mt-8 w-full">{authLinks}</div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </header>
  );
}
