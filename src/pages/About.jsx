import React from 'react';
import {
  CheckCircle,
  Briefcase,
  Info,
  Github,
  Mail,
  Heart,
} from 'lucide-react';
import { TECH_STACK } from '../utils/constants';

export default function About() {
  const features = [
    'AI-powered cover letter generation',
    'Personalized responses to company-specific questions',
    'Resume-based content tailoring',
    'Startup and tech-focused optimization',
    'Multiple Gemini AI model support',
  ];

  const steps = [
    'Configure your API key and resume in settings',
    'Paste the job description you\'re applying for',
    'Select the type of response you need',
    'Get AI-generated, personalized content',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="space-y-8">
          {/* App Info */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Briefcase className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">AI GenX</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your AI-powered companion for crafting compelling job application
              responses tailored specifically for startup roles and tech
              companies.
            </p>
          </div>

          {/* Features and How It Works */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Features
              </h3>
              <ul className="space-y-3 text-gray-600">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How It Works */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                How It Works
              </h3>
              <div className="space-y-3 text-gray-600">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                About the Developer
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 max-w-2xl mx-auto">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Built with{' '}
                  <Heart className="w-4 h-4 text-red-500 inline mx-1" /> by a
                  passionate developer who understands the challenges of job
                  hunting in the tech industry. This tool was created to help
                  fellow developers and tech professionals stand out in the
                  competitive startup ecosystem.
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href="mailto:developer@example.com"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Built With</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}