import { useState } from 'react';
import { generateLinkedInPost } from '../config/deepseek';
import './PostGenerator.css';

const toneOptions = ['professional', 'corporate', 'thought leadership'];
const lengthOptions = ['brief', 'standard', 'detailed'];

function PostGenerator() {
    const [formData, setFormData] = useState({
        topic: '',
        tone: 'professional',
        length: 'standard',
        includeHashtags: false,
        includeEmojis: false,
        variations: 1,
        wordCount: 50
    });
    const [generatedPost, setGeneratedPost] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleWordCountChange = (e) => {
        const value = parseInt(e.target.value);
        setFormData({...formData, wordCount: value});
    };

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
                formData.length,
                formData.wordCount
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
        <div className="post-generator-container">
            <div className="prompt-section">
                <h2>Your Prompt</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <textarea
                            value={formData.topic}
                            onChange={(e) => {
                                setFormData({...formData, topic: e.target.value});
                                setError('');
                            }}
                            placeholder="Describe the topic for which you need LinkedIn Post Ideas.

For example:
'Technology & Gadgets', 'Upcoming Companies', 'Innovation'"
                            required
                        />
                    </div>

                    <div className="form-options">
                        <div className="word-count">
                            <label>Approx. Words</label>
                            <div className="word-count-control">
                                <input
                                    type="range"
                                    min="30"
                                    max="200"
                                    value={formData.wordCount}
                                    onChange={handleWordCountChange}
                                />
                                <span>{formData.wordCount}</span>
                            </div>
                        </div>

                        <div className="voice-tone">
                            <label>Voice Tone</label>
                            <select
                                value={formData.tone}
                                onChange={(e) => setFormData({...formData, tone: e.target.value})}
                            >
                                <option value="">Pick a tone</option>
                                {toneOptions.map(tone => (
                                    <option key={tone} value={tone}>
                                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="checkbox-options">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.includeHashtags}
                                    onChange={(e) => setFormData({...formData, includeHashtags: e.target.checked})}
                                />
                                Generate Hashtags
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.includeEmojis}
                                    onChange={(e) => setFormData({...formData, includeEmojis: e.target.checked})}
                                />
                                Include Emojis
                            </label>
                        </div>

                        <div className="variations">
                            <label>Number of Variations</label>
                            <div className="variation-buttons">
                                {[1, 2, 3].map(num => (
                                    <button
                                        key={num}
                                        type="button"
                                        className={formData.variations === num ? 'active' : ''}
                                        onClick={() => setFormData({...formData, variations: num})}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className={`generate-button ${loading ? 'loading' : ''}`}
                            disabled={loading || !formData.topic.trim()}
                        >
                            <span className="button-text">
                                {loading ? 'Crafting Your Content...' : 'Generate'}
                            </span>
                            {loading && (
                                <div className="loading-animation">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="results-section">
                <h2>Results</h2>
                <div className="instructions">
                    <p>Let Linkly craft your social media captions in seconds:</p>
                    <ol>
                        <li>Simply enter your prompt.</li>
                        <li>Tailor the word count to match your requirements.</li>
                        <li>Define the tone that fits your requirements.</li>
                        <li>Toggle hashtags and emojis as required.</li>
                        <li>Choose the number of variations you want.</li>
                        <li>Click 'Generate' to let the magic happen.</li>
                    </ol>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="typing-animation">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                        <p>AI is crafting your perfect LinkedIn post...</p>
                    </div>
                )}

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
        </div>
    );
}

export default PostGenerator;