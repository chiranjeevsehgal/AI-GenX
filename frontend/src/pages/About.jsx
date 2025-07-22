import React from "react";
import {
  CheckCircle,
  Briefcase,
  Info,
  Sparkles,
  Zap,
  Target,
  Brain,
  Shield,
  Lock,
  Database,
  ExternalLink,
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

  const privacyFeatures = [
    {
      text: "All data stored locally",
      icon: Database,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      text: "API keys never leave device",
      icon: Lock,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      text: "Resume files stored in browser",
      icon: Shield,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const steps = [
    {
      text: "Configure API key & resume",
      color: "bg-blue-500",
    },
    {
      text: "Paste job description",
      color: "bg-green-500",
    },
    {
      text: "Select response type",
      color: "bg-purple-500",
    },
    {
      text: "Get AI-generated content",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-xl border border-gray-100/50 p-4 lg:p-6 backdrop-blur-sm flex-1 flex flex-col">
        
        {/* App Info - Compact */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex flex-row items-center gap-x-3 justify-center">
            <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              AI GenX
            </h2>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            AI-powered companion for crafting compelling job application responses tailored for startup roles and tech companies.
          </p>
        </div>


        {/* Main Content Grid - Centered with equal heights */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4 max-w-4xl mx-auto items-start">
          {/* Features - Compact */}
          <div className="space-y-3 h-full">
            <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center lg:justify-start gap-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              Features
            </h3>
            <div className="space-y-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/60 transition-all duration-200 min-h-[48px]">
                    <div className={`p-1.5 ${feature.bg} rounded-lg flex-shrink-0 mt-0.5`}>
                      <Icon className={`w-3.5 h-3.5 ${feature.color}`} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium leading-relaxed pt-0.5">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How It Works - Compact with matching height */}
          <div className="space-y-3 h-full">
            <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center lg:justify-start gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              How It Works
            </h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/60 transition-all duration-200 min-h-[48px]">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`w-6 h-6 ${step.color} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                      {index + 1}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium leading-relaxed pt-0.5">
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

                {/* Privacy First - Compact */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200/50 mb-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Privacy First</h3>
            </div>
            <p className="text-sm text-gray-700 max-w-2xl mx-auto">
              <strong>Your data stays with you.</strong> We don't store any information on our servers. 
              Everything is stored locally in your browser.
            </p>
            
            <div className="grid grid-cols-3 gap-3 mt-4">
              {privacyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex flex-col items-center gap-2 p-3 bg-white/60 rounded-lg">
                    <div className={`p-2 ${feature.bg} rounded-lg`}>
                      <Icon className={`w-4 h-4 ${feature.color}`} />
                    </div>
                    <span className="text-xs text-center text-gray-700 font-medium leading-tight">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer - Compact */}
           <div className="border-t border-gray-200/50 pt-3 text-center space-y-1">
          <p className="text-xs text-gray-600">
            © 2025 AI GenX • Developed by{" "}
            <a
              href="https://www.chiranjeevsehgal.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Chiranjeev Sehgal
              <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </a>
          </p>
          {/* <div className="flex justify-center">
            <div className="px-3 py-1 bg-blue-50 rounded-full">
              <p className="text-xs text-blue-700 font-medium">
                Privacy Focused • No Data Collection • Open Source
              </p>
            </div>
          </div> */}
        </div>

      </div>
    </div>
  );
}