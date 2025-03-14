import { useState } from 'react';
import './PostGenerator.css';

const toneOptions = ['professional', 'corporate', 'thought leadership'];
const lengthOptions = ['brief', 'standard', 'detailed'];

function PostGenerator() {
    const [formData, setFormData] = useState({
        topic: '',
        tone: 'professional',
        length: 'medium'
    });
    const [generatedPost, setGeneratedPost] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
            const dummyPost = `🎯 Exciting insights about ${formData.topic}!\n\n` +
                `As a professional in this field, I've discovered that innovation and creativity are key to success. ${formData.topic} represents a fascinating opportunity for growth and development.\n\n` +
                `🔑 Key takeaways:\n` +
                `• Embrace continuous learning\n` +
                `• Focus on value creation\n` +
                `• Build meaningful connections\n\n` +
                `What are your thoughts on ${formData.topic}? Let's discuss in the comments! 👇\n\n` +
                `#${formData.topic.replace(/\s+/g, '')} #Innovation #Professional #LinkedIn #Growth`;
            setGeneratedPost(dummyPost);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="post-generator">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="topic">Topic or Key Message</label>
                    <input
                        id="topic"
                        type="text"
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        placeholder="Enter your topic or keywords"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tone">Communication Style</label>
                    <select
                        id="tone"
                        value={formData.tone}
                        onChange={(e) => setFormData({...formData, tone: e.target.value})}
                    >
                        {toneOptions.map(tone => (
                            <option key={tone} value={tone}>
                                {tone.charAt(0).toUpperCase() + tone.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="length">Content Length</label>
                    <select
                        id="length"
                        value={formData.length}
                        onChange={(e) => setFormData({...formData, length: e.target.value})}
                    >
                        {lengthOptions.map(length => (
                            <option key={length} value={length}>
                                {length.charAt(0).toUpperCase() + length.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Generating Content...' : 'Generate Professional Post'}
                </button>
            </form>

            {generatedPost && (
                <div className="generated-content">
                    <h3>Your Professional Content</h3>
                    <div className="post-preview">
                        {generatedPost}
                    </div>
                    <div className="post-actions">
                        <button onClick={() => navigator.clipboard.writeText(generatedPost)}>
                            📋 Copy to Clipboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostGenerator; 