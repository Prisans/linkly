import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure API key is properly loaded
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error('Gemini API key is missing in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

const postLengths = {
    short: '300-500',
    medium: '500-800',
    long: '800-1200'
};

export const generateLinkedInPost = async (topic, tone, length) => {
    if (!topic) {
        throw new Error('Topic is required');
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Create a professional LinkedIn post about ${topic}.
            Length: ${length}
            Tone: ${tone}
            
            Include:
            1. An attention-grabbing headline with emoji
            2. Brief introduction
            3. Main points as bullet points
            4. Call to action
            5. Relevant hashtags
            
            Make it engaging and professional.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
};

// Add this function to test the API
export const testGeminiAPI = async () => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say hello!");
        const response = await result.response;
        console.log("API Test Response:", response.text());
        return true;
    } catch (error) {
        console.error("API Test Error:", error);
        return false;
    }
}; 