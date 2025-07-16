import React, { useState } from 'react';
import {
  Copy,
  Send,
  Loader,
  CheckCircle,
  Briefcase,
  MessageSquare,
} from 'lucide-react';
import { QUESTION_OPTIONS, SYSTEM_PROMPT } from '../utils/constants';

export default function Dashboard({ settings }) {
  const [formData, setFormData] = useState({
    jobDescription: '',
    questionType: '',
    customQuestion: '',
  });
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'questionType' && value !== 'custom') {
      setFormData((prev) => ({
        ...prev,
        customQuestion: '',
      }));
    }
  };

  const getQuestionText = () => {
    const selected = QUESTION_OPTIONS.find(
      (opt) => opt.value === formData.questionType
    );
    if (formData.questionType === 'custom') {
      return formData.customQuestion;
    }
    return selected ? selected.label : '';
  };

  const generateResponse = async () => {
    if (!formData.jobDescription.trim() || !formData.questionType) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.questionType === 'custom' && !formData.customQuestion.trim()) {
      setError('Please enter your custom question');
      return;
    }

    if (!settings.apiKey.trim()) {
      setError('Please configure your API key in settings');
      return;
    }

    if (!settings.resumeText.trim()) {
      setError('Please add your resume text in settings');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const questionText = getQuestionText();
      const prompt = `${SYSTEM_PROMPT}

Job Description:
${formData.jobDescription}

Question to Answer:
${questionText}

Resume/Background (use relevant details from this):
${settings.resumeText}

Please provide a tailored response to the question based on the job description and background provided.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${settings.model}:generateContent?key=${settings.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedText = data.candidates[0].content.parts[0].text;
        setResponse(generatedText);
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (err) {
      setError(`Failed to generate response: ${err.message}`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="space-y-6">
          {/* Job Description Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Job Description *
            </label>
            <div className="relative">
              <textarea
                className="w-full h-36 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none bg-gray-50/50 text-gray-800 placeholder-gray-500"
                placeholder="Paste the complete job description here..."
                value={formData.jobDescription}
                onChange={(e) =>
                  handleInputChange('jobDescription', e.target.value)
                }
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {formData.jobDescription.length} characters
              </div>
            </div>
          </div>

          {/* Question Type Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Question Type *
            </label>
            <select
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 text-gray-800 appearance-none cursor-pointer"
              value={formData.questionType}
              onChange={(e) =>
                handleInputChange('questionType', e.target.value)
              }
            >
              <option value="" className="text-gray-500">
                Choose the type of question you need help with...
              </option>
              {QUESTION_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-gray-800"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Question Input */}
          {formData.questionType === 'custom' && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-semibold text-gray-800">
                Custom Question *
              </label>
              <input
                type="text"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 text-gray-800 placeholder-gray-500"
                placeholder="Enter your specific question here..."
                value={formData.customQuestion}
                onChange={(e) =>
                  handleInputChange('customQuestion', e.target.value)
                }
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateResponse}
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Generating Response...</span>
                <span className="sm:hidden">Generating...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate Response
              </>
            )}
          </button>

          {/* Response Display */}
          {response && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Generated Response
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-700 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Copied Successfully!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 shadow-inner">
                <pre className="whitespace-pre-wrap text-gray-800 text-sm sm:text-base leading-relaxed font-sans">
                  {response}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}