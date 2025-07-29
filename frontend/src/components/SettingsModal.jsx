import React, { useState, useEffect } from "react";
import {
  Settings,
  X,
  Save,
  Key,
  Cpu,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  Trash2,
  Shield,
  User,
  Zap,
  Info,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { GEMINI_MODELS } from "../utils/constants";
import { indexedDBHelper } from "../utils/indexedDBHelper";

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const [tempSettings, setTempSettings] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showApiHelp, setShowApiHelp] = useState(false);
  const [showModelHelp, setShowModelHelp] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [useCustomApiKey, setUseCustomApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  // Update tempSettings when settings prop changes
  useEffect(() => {
    setTempSettings(settings);
    setResumeText(settings.resumeText || "");
    setUseCustomApiKey(settings.useCustomApiKey || true);
  }, [settings]);

  // Load settings from localStorage on mount (user-specific if logged in)
  useEffect(() => {
    const settingsKey = "ai-genx-settings";
    const savedSettings = localStorage.getItem(settingsKey);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setTempSettings(parsed);
        setResumeText(parsed.resumeText || "");
        setUseCustomApiKey(parsed.useCustomApiKey || false);
      } catch (error) {
        console.error("Error loading settings from localStorage:", error);
      }
    }
  }, [isSignedIn, userId]);

  // Load resume from indexeddb on mount
  useEffect(() => {
    const loadResumeFromIndexedDB = async () => {
      try {
        const fileId = "current-resume";
        const savedFileData = await indexedDBHelper.getFile(fileId);
        if (savedFileData) {
          const mockFile = {
            name: savedFileData.name,
            type: savedFileData.type,
            size: savedFileData.size,
            lastModified: savedFileData.lastModified,
            data: savedFileData.data,
          };
          setResumeFile(mockFile);
        }
      } catch (error) {
        console.error("Error loading resume from IndexedDB:", error);
        setUploadError("Failed to load saved resume data");
      }
    };

    if (isOpen) {
      loadResumeFromIndexedDB();
    }
  }, [isOpen, isSignedIn, userId]);

  const handleSave = async () => {
    setIsLoading(true);
    setLoadingStep("Validating settings...");
    
    try {
      setLoadingStep("Saving configuration...");
      
      const settingsToSave = {
        ...tempSettings,
        resumeText: resumeText,
        useCustomApiKey: useCustomApiKey,
        apiKey: useCustomApiKey ? tempSettings.apiKey : "",
      };
      
      // Save to localStorage (user-specific if logged in)
      const settingsKey = "ai-genx-settings";
      localStorage.setItem(settingsKey, JSON.stringify(settingsToSave));
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (resumeFile) {
        setLoadingStep("Saving resume file...");
        const fileId = "current-resume";
        await indexedDBHelper.saveFile(resumeFile.data, fileId);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setLoadingStep("Finalizing...");
      await new Promise(resolve => setTimeout(resolve, 200));

      // Call parent callback
      onSaveSettings(settingsToSave);

      setIsLoading(false);
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error saving settings:", error);
      setIsLoading(false);
      setUploadError("Failed to save settings. Please try again.");
      setLoadingStep("");
    }
  };

  const handleInputChange = (field, value) => {
    setTempSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadError("");

    try {
      // Check file type
      const allowedTypes = [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Please upload a PDF, Word document, or text file");
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return;
      }

      const fileWithData = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        data: file,
      };
      setResumeFile(fileWithData);

      // For text files, read content directly
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumeText(e.target.result);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadError("Failed to process file. Please try again.");
    }
  };

  const handleRemoveFile = async () => {
    try {
      const fileId = "current-resume";
      await indexedDBHelper.deleteFile(fileId);

      // Clear local state
      setResumeFile(null);
      setUploadError("");

      // Reset file input
      const fileInput = document.getElementById("resume-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error removing file from IndexedDB:", error);
      setUploadError("Failed to remove file completely. Please try again.");

      // Still clear local state even if IndexedDB deletion fails
      setResumeFile(null);
      const fileInput = document.getElementById("resume-upload");
      if (fileInput) fileInput.value = "";
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isLoading]);

  // Check if form is valid
  const isFormValid = () => {
    if (!isSignedIn && !useCustomApiKey && !tempSettings.apiKey?.trim()) {
      return false;
    }
    if (!resumeText.trim() && !resumeFile) {
      return false;
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-screen sm:max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Settings
              </h2>
              {isSignedIn && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6 sm:space-y-8">
            {/* API Key Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Key className="w-4 h-4 text-blue-600" />
                  API Configuration
                </div>
                <button
                  onClick={() => setShowApiHelp(!showApiHelp)}
                  className="flex items-center cursor-pointer gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showApiHelp ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {showApiHelp ? "Hide" : "Show"} Help
                </button>
              </div>

              {/* API Key Status Card */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      {isSignedIn ? (
                        <Shield className="w-4 h-4 text-green-600" />
                      ) : (
                        <Key className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {isSignedIn ? "Ready to Go!" : "API Key Required"}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {isSignedIn
                          ? "API key provided - no setup needed!"
                          : "Enter your Gemini API key to get started"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isSignedIn ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-xs font-medium text-gray-700">
                      {isSignedIn ? "Ready" : "Setup Required"}
                    </span>
                  </div>
                </div>
              </div>

              {/* API Key Input */}
              <div className="space-y-3">
                {isSignedIn && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {!useCustomApiKey ? (
                          <>
                          Using System Provided API Key
                        </>
                      ) : (
                        <>
                          Using Custom API Key
                        </>
                      )}
                      </span>
                    </div>
                    <button
                      onClick={() => setUseCustomApiKey(!useCustomApiKey)}
                      className="flex items-center cursor-pointer gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {useCustomApiKey ? (
                        <>
                          <Lock className="w-3 h-3" />
                          Use Provided Key
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" />
                          Use My Own Key
                        </>
                      )}
                    </button>
                  </div>
                )}

                {(!isSignedIn || useCustomApiKey) && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">
                      Gemini API Key <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 text-gray-800 placeholder-gray-500 text-sm sm:text-base"
                      placeholder="Enter your Gemini API key..."
                      value={tempSettings.apiKey || ""}
                      onChange={(e) =>
                        handleInputChange("apiKey", e.target.value)
                      }
                    />
                  </>
                )}

                {isSignedIn && !useCustomApiKey && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-500 text-sm"
                      placeholder="••••••••••••••••••••••••••••••••••••••••"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      API key is provided for convenience
                    </p>
                  </div>
                )}

                {showApiHelp && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-in slide-in-from-top-2 duration-200">
                    {isSignedIn ? (
                      <div>
                        <p className="text-xs sm:text-sm text-blue-700">
                          <strong>Signed-in Benefits:</strong>
                        </p>
                        <ul className="text-xs sm:text-sm text-blue-600 mt-1 ml-4 list-disc space-y-1">
                          <li>No API key setup required</li>
                          <li>Instant access to all features</li>
                          <li>Settings saved locally in your browser</li>
                          <li>Easy access across sessions</li>
                        </ul>
                        <div className="mt-2 pt-2 border-t border-blue-200">
                          <p className="text-xs sm:text-sm text-blue-700">
                            <strong>Want to use your own API key?</strong>
                          </p>
                          <p className="text-xs sm:text-sm text-blue-600">
                            Click "Use My Own Key" above to enter your personal
                            Gemini API key.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs sm:text-sm text-blue-700">
                          <strong>How to get your API key:</strong>
                        </p>
                        <ol className="text-xs sm:text-sm text-blue-600 mt-1 ml-4 list-decimal space-y-1">
                          <li>
                            Visit{" "}
                            <a
                              href="https://aistudio.google.com/app/apikey"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-blue-800 font-semibold"
                            >
                              Google AI Studio
                            </a>
                          </li>
                          <li>Sign in with your Google account</li>
                          <li>
                            Click <strong>Get API key</strong>
                          </li>
                          <li>Copy and paste the key here</li>
                        </ol>
                        <div className="mt-2 pt-2 border-t border-blue-200">
                          <p className="text-xs sm:text-sm text-blue-700 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            <strong>Pro tip:</strong> Sign in to skip the API
                            key setup!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Model Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Model Selection
                </div>
                <button
                  onClick={() => setShowModelHelp(!showModelHelp)}
                  className="flex items-center cursor-pointer gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showModelHelp ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {showModelHelp ? "Hide" : "Show"} Help
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Gemini Model <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 text-gray-800 appearance-none cursor-pointer text-sm sm:text-base"
                    value={tempSettings.model || "gemini-1.5-flash"}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                  >
                    {GEMINI_MODELS.map((model) => (
                      <option
                        key={model.value}
                        value={model.value}
                        className="text-gray-800"
                      >
                        {model.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {showModelHelp && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-xs sm:text-sm text-gray-600">
                      <strong>Model recommendations:</strong>
                    </p>
                    <ul className="text-xs sm:text-sm text-gray-600 mt-1 space-y-1">
                      <li>
                        • <strong>2.5 Flash:</strong> Latest model, best for
                        complex cover letters and detailed responses
                      </li>
                      <li>
                        • <strong>2.0 Flash:</strong> Great for most job
                        applications, balanced speed and quality
                      </li>
                      <li>
                        • <strong>2.0 Flash-Lite:</strong> Fastest for quick
                        responses and simple application questions
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Resume/Background <span className="text-red-600">*</span>
              </div>

              <div className="space-y-4">
                {/* File Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Resume File
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".txt,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors bg-gray-50/50">
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {resumeFile ? resumeFile.name : "Choose file"}
                        </span>
                      </div>
                    </label>
                    {resumeFile && (
                      <button
                        onClick={handleRemoveFile}
                        className="p-2 text-red-500 cursor-pointer hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {uploadError && (
                    <p className="text-red-600 text-xs">{uploadError}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Supported formats: PDF, Word (.doc, .docx), Text (.txt) -
                    Max 5MB
                  </p>
                </div>
                <h2 className="text-center text-gray-400 font-medium">or</h2>
                {/* Text Area */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Resume Summary
                  </label>
                  <textarea
                    className="w-full h-32 sm:h-40 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50/50 text-gray-800 placeholder-gray-500 text-sm"
                    placeholder="Enter your resume summary here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                  <div className="flex items-start justify-between text-xs text-gray-500">
                    <p>This will be used to personalize your responses</p>
                    <span className="ml-2 flex-shrink-0">
                      {resumeText.length} characters
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Success Message */}
            {saveSuccess && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="text-center">
                    <p className="text-green-700 text-lg font-semibold">
                      Settings Saved Successfully!
                    </p>
                    <p className="text-green-600 text-sm">
                      Your configuration has been updated and is ready to use.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Centered Save Button - Fixed */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex flex-col items-center space-y-4">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-blue-700">
                    {loadingStep}
                  </span>
                </div>
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 animate-pulse" 
                       style={{ width: '70%' }}></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 w-full max-w-md">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 cursor-pointer border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSave}
                disabled={!isFormValid() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex cursor-pointer items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </button>
            </div>

            {/* Form Validation Message */}
            {!isFormValid() && !isLoading && !saveSuccess && (
              <div className="text-center space-y-1">
                <p className="text-xs text-amber-600 font-medium">
                  Please complete all required fields to save
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  {!isSignedIn && !useCustomApiKey && !tempSettings.apiKey?.trim() && (
                    <p>• API key is required</p>
                  )}
                  {!resumeText.trim() && !resumeFile && (
                    <p>• Resume information is required</p>
                  )}
                </div>
              </div>
            )}

            {/* Mobile-specific help text */}
            <div className="sm:hidden">
              <p className="text-xs text-gray-500 text-center">
                Tip: Rotate your device to landscape for a better experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}