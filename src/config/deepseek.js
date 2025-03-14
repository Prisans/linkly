const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateLinkedInPost = async (topic, tone, length) => {
    if (!topic) {
        throw new Error('Topic is required');
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                "HTTP-Referer": window.location.origin,
                "X-Title": "LinkedIn Post Generator",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1:free",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional LinkedIn content creator. Create engaging posts with emojis, bullet points, and hashtags."
                    },
                    {
                        role: "user",
                        content: `Write a ${length} LinkedIn post about ${topic} in a ${tone} tone. Include:
                            - A headline with emoji
                            - Brief introduction
                            - 3 key points
                            - Call to action
                            - 3-5 relevant hashtags`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                top_p: 0.9,
                frequency_penalty: 0.5,
                presence_penalty: 0.5
            })
        });

        const data = await response.json();

        // Log the response for debugging
        console.log('API Response:', data);

        // Check for API errors first
        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }

        // Extract the generated text
        const generatedText = data.choices?.[0]?.message?.content;

        if (!generatedText) {
            console.error('Invalid response structure:', data);
            throw new Error('No content in response');
        }

        return generatedText.trim();
    } catch (error) {
        console.error('Generation Error:', error);
        throw new Error(
            error.message === 'No content in response' 
                ? 'Failed to generate content. Please try a different topic.' 
                : 'Service temporarily unavailable. Please try again in a moment.'
        );
    }
}; 