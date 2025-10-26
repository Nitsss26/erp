import React from 'react';
import { BellIcon, UserCircleIcon, Bars3Icon } from './Icons';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  pageTitle: string;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, pageTitle, toggleSidebar }) => {
  return (
    <header className="h-20 bg-[--card] flex items-center justify-between px-6 z-10 shrink-0 border-b border-[--card-border]">
        <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-full text-[--text-secondary] hover:bg-gray-100/50 mr-2"
              aria-label="Toggle sidebar"
            >
                <Bars3Icon className="w-6 h-6"/>
            </button>
            <h1 className="text-2xl font-bold text-[--text-primary] hidden sm:block">{pageTitle}</h1>
        </div>
      <div className="flex items-center space-x-6">
        <button className="relative text-[--text-secondary] hover:text-[--primary] transition-colors">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-200">
                <UserCircleIcon className="w-10 h-10 text-orange-400"/>
            </div>
            <div className="hidden md:block">
                <p className="font-semibold text-[--text-primary] capitalize">{user.name} {user.surname}</p>
                <p className="text-xs text-[--text-secondary] capitalize">{user.role}</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
