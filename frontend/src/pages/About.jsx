import React from "react";
import {
  CheckCircle,
  Briefcase,
  Info,
  Sparkles,
  Zap,
  Target,
  Brain,
} from "lucide-react";

export default function About() {
  const features = [
    {
      text: "AI-powered cover letter generation",
      icon: Brain,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      text: "Personalized responses to company-specific questions",
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      text: "Resume-based content tailoring",
      icon: Sparkles,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      text: "Multiple Gemini AI model support",
      icon: Zap,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const steps = [
    {
      text: "Configure your API key and resume in settings",
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      text: "Paste the job description you're applying for",
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      text: "Select the type of response you need",
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      text: "Get AI-generated, personalized content",
      color: "bg-orange-500",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="h-full max-h-screen overflow-hidden">
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl border border-gray-100/50 p-4 lg:p-6 h-full backdrop-blur-sm">
        <div className="h-full flex flex-col">
          {/* App Info - Enhanced */}
          <div className="text-center space-y-4 mb-7">
            <div className="flex justify-center"></div>
            <div className="space-y-2">
              <div className="flex flex-row items-center gap-x-4 justify-center">
                <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  AI GenX
                </h2>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
            </div>
            <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your AI-powered companion for crafting compelling job application
              responses tailored specifically for startup roles and tech
              companies.
            </p>
          </div>

          {/* Main Content Grid - Enhanced */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* Features - Enhanced */}
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                Features
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/60 transition-all duration-200 hover:shadow-md"
                    >
                      <div
                        className={`p-2 ${feature.bg} rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className={`w-4 h-4 ${feature.color}`} />
                      </div>
                      <span className="text-sm lg:text-base text-gray-700 leading-relaxed font-medium">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How It Works - Enhanced */}
            <div className="space-y-4">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                How It Works
              </h3>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/60 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-110 transition-transform duration-200`}
                      >
                        {index + 1}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-gray-300 to-transparent"></div>
                      )}
                    </div>
                    <span className="text-sm lg:text-base text-gray-700 leading-relaxed font-medium pt-1">
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="border-t border-gray-200/50 pt-2">
            <div className="text-center space-y-1">
              <div className="inline-block px-4 py-2 rounded-full">
                <p className="text-sm text-gray-600 font-medium">
                  © 2025 AI GenX. Empowering professionals to land their dream jobs.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Developed by{" "}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                >
                  Chiranjeev Sehgal
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
