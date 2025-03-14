const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const API_URL = "https://api.mistral.ai/v1/chat/completions";

export const generateLinkedInPost = async (topic, tone, length) => {
    if (!topic) {
        throw new Error('Topic is required');
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-tiny",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional LinkedIn content creator. Create engaging posts that are well-structured and impactful."
                    },
                    {
                        role: "user",
                        content: `Create a professional LinkedIn post about ${topic}.
                            Length: ${length}
                            Tone: ${tone}
                            
                            The post should include:
                            1. An attention-grabbing headline with emoji
                            2. Brief introduction
                            3. Main points as bullet points
                            4. Call to action
                            5. Relevant hashtags
                            
                            Make it engaging and professional.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error?.message || 'Failed to generate content');
        }

        const data = await response.json();
        const generatedText = data.choices[0]?.message?.content?.trim();

        if (!generatedText) {
            throw new Error('No content generated');
        }

        return generatedText;
    } catch (error) {
        console.error('Mistral API Error:', error);
        throw new Error('Failed to generate content. Please try again.');
    }
}; 