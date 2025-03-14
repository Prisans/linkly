import { useState } from 'react';
import { generateLinkedInPost } from '../config/deepseek';
import './PostGenerator.css';

const toneOptions = ['professional', 'corporate', 'thought leadership'];
const lengthOptions = ['brief', 'standard', 'detailed'];

function PostGenerator() {
    const [formData, setFormData] = useState({
        topic: '',
        tone: 'professional',
        length: 'standard'
    });
    const [generatedPost, setGeneratedPost] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setLoading(true);
        setError('');
        setGeneratedPost('');

        try {
            const post = await generateLinkedInPost(
                formData.topic.trim(),
                formData.tone,
                formData.length
            );
            setGeneratedPost(post);
        } catch (error) {
            console.error('Generation error:', error);
            setError(error.message || 'Failed to generate post. Please try again.');
            if (error.message.includes('busy')) {
                setTimeout(() => handleSubmit(e), 5000);
            }
        } finally {
            setLoading(false);
        }
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
                        onChange={(e) => {
                            setFormData({...formData, topic: e.target.value});
                            setError(''); // Clear error when user types
                        }}
                        placeholder="Enter your topic or area of expertise"
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

                <button 
                    type="submit" 
                    disabled={loading || !formData.topic.trim()}
                >
                    {loading ? 'Crafting Your Content...' : 'Generate Professional Post'}
                </button>
            </form>

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            {generatedPost && (
                <div className="generated-content">
                    <h3>Your Professional Content</h3>
                    <div className="post-preview">
                        {generatedPost}
                    </div>
                    <div className="post-actions">
                        <button onClick={() => {
                            navigator.clipboard.writeText(generatedPost);
                            alert('Content copied to clipboard!');
                        }}>
                            Copy to Clipboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostGenerator; 