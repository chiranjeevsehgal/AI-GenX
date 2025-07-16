import React from 'react';

export default function Header({ currentPage, settings }) {
  const getPageDescription = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Generate personalized job application responses';
      case 'about':
        return 'Learn more about AI Gen Helper';
      default:
        return '';
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {currentPage}
            </h2>
            <p className="text-gray-600 mt-1">
              {getPageDescription()}
            </p>
          </div>
          {currentPage === 'dashboard' && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">API Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      settings.apiKey ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {settings.apiKey ? 'Connected' : 'Not Configured'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}