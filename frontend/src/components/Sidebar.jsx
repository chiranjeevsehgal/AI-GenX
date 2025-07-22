import React, { useState } from 'react';
import { Briefcase, Settings, Home, Info, Menu, X, LogIn } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export default function Sidebar({ currentPage, onPageChange, onSettingsOpen }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'about', label: 'About', icon: Info },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleSettingsOpen = () => {
    onSettingsOpen();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">AI GenX</h1>
              <p className="text-xs text-gray-500">Job Application Assistant</p>
            </div>
          </div>

          {/* Mobile Auth in Navbar */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md text-sm">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="relative">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-200 shadow-md",
                      userButtonPopoverCard: "shadow-2xl border-0 rounded-2xl",
                      userButtonPopoverActionButton: "hover:bg-blue-50 rounded-lg transition-colors duration-200",
                      userButtonPopoverActionButtonIcon: "text-blue-600",
                      userButtonPopoverActionButtonText: "text-gray-700 font-medium",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                  showName={false}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 min-h-screen z-40 
        w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full min-h-screen">
          {/* Logo - Hidden on mobile */}
          <div className="hidden lg:block p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">
                  AI GenX
                </h1>
                <p className="text-xs text-gray-500">
                  Job Application Assistant
                </p>
              </div>
            </div>
          </div>

          {/* Mobile spacing */}
          <div className="lg:hidden h-20 flex-shrink-0"></div>

          {/* Navigation - This will grow to fill space */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Settings Button */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <button
              onClick={handleSettingsOpen}
              className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}