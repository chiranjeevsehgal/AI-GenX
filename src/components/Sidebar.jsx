import React from 'react';
import { Briefcase, Settings, Home, Info } from 'lucide-react';

export default function Sidebar({ currentPage, onPageChange, onSettingsOpen }) {
  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">
                AI Gen Helper
              </h1>
              <p className="text-xs text-gray-500">
                Job Application Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
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
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onSettingsOpen}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}