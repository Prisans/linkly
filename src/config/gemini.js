import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const postLengths = {
    short: '300-500',
    medium: '500-800',
    long: '800-1200'
};

export const generatePost = async (topic, tone, length) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Create a ${tone} LinkedIn post about ${topic}.
    The post should be ${postLengths[length]} characters long.
    Include relevant hashtags and format with appropriate line breaks.
    The tone should be ${tone}, making sure it resonates with a professional LinkedIn audience.
    Structure the post with:
    - An engaging opening hook
    - Main content with valuable insights
    - A clear call-to-action
    - 3-5 relevant hashtags`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        throw new Error(`Failed to generate post: ${error.message}`);
    }
}; 