import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
import { User, LogIn, Shield, Zap, Key, CheckCircle } from "lucide-react";

export default function Header({ currentPage, settings }) {
  const { isSignedIn } = useAuth();

  const getPageDescription = () => {
    switch (currentPage) {
      case "dashboard":
        return "Generate personalized job application responses";
      case "about":
        return "Learn more about AI GenX";
      default:
        return "";
    }
  };

  // Determine API status based on authentication and settings
  const getApiStatus = () => {
    if (isSignedIn && !settings.useCustomApiKey) {
      // User is signed in and using provided API key
      
      return {
        status: "provided",
        label: "API Provided",
        color: "bg-green-500",
        icon: Shield
      };
    } else if (settings.apiKey?.trim()) {
      // User has configured their own API key
      return {
        status: "configured",
        label: "API Configured", 
        color: "bg-blue-500",
        icon: Key
      };
    } else {
      // No API key configured
      return {
        status: "missing",
        label: "Setup Required",
        color: "bg-red-500",
        icon: Shield
      };
    }
  };

  const apiStatus = getApiStatus();

  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
              {currentPage === "dashboard" && (
                <Zap className="w-6 h-6 text-blue-600" />
              )}
              {currentPage}
            </h2>
            <p className="text-gray-600 mt-1">{getPageDescription()}</p>
          </div>

          {/* API Status - Only show on dashboard */}
          {currentPage === "dashboard" && (
            <div className="flex items-center gap-4 mx-4 mr-14">
              <div className="text-right">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <apiStatus.icon className="w-3 h-3" />
                  API Status
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${apiStatus.color} ${
                      apiStatus.status === "missing" ? "animate-pulse" : ""
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {apiStatus.label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Authentication Section */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-sm">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-gray-500">Welcome back!</p>
                  <p className="text-sm font-medium text-gray-700">
                    Ready to generate?
                  </p>
                </div>
                <div className="relative">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-10 h-10 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-200 shadow-md hover:shadow-lg",
                        userButtonPopoverCard:
                          "shadow-2xl border-0 rounded-2xl",
                        userButtonPopoverActionButton:
                          "hover:bg-blue-50 rounded-lg transition-colors duration-200",
                        userButtonPopoverActionButtonIcon: "text-blue-600",
                        userButtonPopoverActionButtonText:
                          "text-gray-700 font-medium",
                        userButtonPopoverFooter: "hidden",
                      },
                    }}
                    showName={false}
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}