import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SettingsModal from "./components/SettingsModal";
import { DEFAULT_SETTINGS } from "./utils/constants";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    
    const savedSettings = localStorage.getItem("ai-genx-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error("No settings found in localStorage:", error);
      }
    }
  }, []);

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
  };

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard settings={settings} />;
      case "about":
        return <About />;
      default:
        return <Dashboard settings={settings} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSettingsOpen={handleSettingsOpen}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <Header currentPage={currentPage} settings={settings} />

          {/* Page Content */}
          {renderContent()}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSettingsSave}
      />
    </div>
  );
}
