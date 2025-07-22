const axios = require("axios");

// Generate content using Gemini API
const generateContent = async (req, res) => {
  try {
    const { model, jobDescription, resume, resumeFile } = req.body;

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Configuration Error",
        message: "Gemini API key not configured on server",
      });
    }

    // Validate required fields
    if (!model || !jobDescription) {
      return res.status(400).json({
        error: "Missing Required Fields",
        message: "Model and jobDescription are required",
      });
    }

    // Check if we have either resume text or resume file
    if (!resume && !resumeFile) {
      return res.status(400).json({
        error: "Missing Resume",
        message: "Either resume text or resumeFile is required",
      });
    }

    // Get system prompt from environment variables
    const systemPrompt = process.env.SYSTEM_PROMPT;

    // Build the prompt
    let prompt = `${systemPrompt}\n\nJob Description:\n${jobDescription}`;

    if (resume) {
      prompt += `\n\nResume/Background:\n${resume}`;
    }

    prompt +=
      "\n\nPlease provide a tailored response based on the job description and resume information provided.";

    // Prepare the parts array
    const parts = [
      {
        text: prompt,
      },
    ];

    // Add resume file if provided
    if (resumeFile && resumeFile.data && resumeFile.mimeType) {
      parts.push({
        inline_data: {
          mime_type: resumeFile.mimeType,
          data: resumeFile.data, // base64 encoded file data
        },
      });
    }

    // Prepare request body for Gemini API
    const requestBody = {
      contents: [
        {
          parts: parts,
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8096,
        ...(model === "gemini-2.5-flash" && {
          thinkingConfig: {
            thinkingBudget: 0,
          },
        }),
      },
    };

    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    // Extract the generated text
    const generatedText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("Invalid response fofrmat from Gemini API");
    }

    // Return response
    res.json({
      success: true,
      model: model,
      timestamp: new Date().toISOString(),
      generatedText: generatedText,
      // usageMetadata: response.data.usageMetadata,
    });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);

    // Handle specific API errors
    if (error.response?.status === 400) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid request parameters",
        details:
          error.response?.data?.error?.message || "Invalid request format",
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        error: "API Key Error",
        message: "Invalid or expired Gemini API key",
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "Rate Limit Exceeded",
        message: "Too many requests to Gemini API. Please try again later.",
      });
    }

    if (error.code === "ECONNABORTED") {
      return res.status(408).json({
        error: "Request Timeout",
        message: "Request to Gemini API timed out. Please try again.",
      });
    }

    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "Unable to connect to Gemini API. Please try again later.",
      });
    }

    // Generic error
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to generate content. Please try again.",
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
        details: error.response?.data,
      }),
    });
  }
};

module.exports = {
  generateContent,
};
