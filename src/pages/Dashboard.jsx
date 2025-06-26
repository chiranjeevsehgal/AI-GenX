import React, { useState } from 'react';
import { Copy, Send, Loader, CheckCircle, Briefcase, MessageSquare } from 'lucide-react';

const QUESTION_OPTIONS = [
    { value: 'cover_letter', label: 'Cover Letter' },
    { value: 'company_interest', label: 'What interests you about working for [Company Name]' },
    { value: 'custom', label: 'Other (Custom Question)' }
];

const SYSTEM_PROMPT = `You are an expert career advisor and professional writer specializing in job applications for tech startups and companies found on Wellfound (formerly AngelList). Your task is to help candidates create compelling, personalized responses to job application questions.

Context: You will be provided with a job description, a specific question to answer, and the candidate's resume/background information. Use these three inputs to craft professional responses that will stand out to hiring managers and founders.

Instructions:
- Write in a human, conversational way that feels natural and authentic - not robotic or overly formal
- Write in a professional yet authentic tone that shows personality
- Keep responses concise but impactful (typically 2-4 paragraphs)
- Focus on specific skills, experiences, and achievements relevant to startups
- Show genuine enthusiasm and cultural fit
- Use concrete examples when possible from the provided resume data
- Avoid generic statements and clichés
- Make the response feel personal and tailored to the specific company/role based on the job description
- For cover letters: Write in paragraph form (no formal letter format with headers/addresses/dates), keep it conversational and direct, focus on relevant experience and impact, avoid placeholders like [Company Name] - use the actual company name from the job description, make it ready to submit without any editing needed
- For company interest questions: Use insights from the job description, show alignment with company mission/values, and give specific reasons for interest
- Write as if you're the candidate speaking in first person
- Sound human and relatable, not like an AI-generated response
- Never use placeholders like [Your Name], [Company Name], etc. - extract real company names from job description and write complete responses
- Make responses immediately usable without any additional editing

Always maintain a balance between confidence and humility, showing you're both capable and eager to contribute to the company's growth. Make sure to weave in relevant details from the resume that match the job requirements.`;

export default function Dashboard() {
    const [formData, setFormData] = useState({
        jobDescription: '',
        questionType: '',
        customQuestion: ''
    });
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear custom question when switching away from custom
        if (field === 'questionType' && value !== 'custom') {
            setFormData(prev => ({
                ...prev,
                customQuestion: ''
            }));
        }
    };

    const getQuestionText = () => {
        const selected = QUESTION_OPTIONS.find(opt => opt.value === formData.questionType);
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
${import.meta.env.VITE_RESUME_TEXT}

Please provide a tailored response to the question based on the job description and background provided.`;

            const model = import.meta.env.VITE_GEMINI_MODEL;
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error('Gemini API key not found in environment variables');
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4 items-center gap-x-5 mt-12">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            AI Gen Helper
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Get AI-powered help with your job application responses tailored to startup roles
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <div className="p-6 sm:p-8 space-y-8">
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
                                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
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
                                onChange={(e) => handleInputChange('questionType', e.target.value)}
                            >
                                <option value="" className="text-gray-500">Choose the type of question you need help with...</option>
                                {QUESTION_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value} className="text-gray-800">
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
                                    onChange={(e) => handleInputChange('customQuestion', e.target.value)}
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

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        Crafted to help you land your dream startup role 🚀
                    </p>
                </div>
            </div>
        </div>
    );
}