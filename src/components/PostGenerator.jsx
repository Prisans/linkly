import { useState, useEffect, useCallback } from 'react';
import { generateLinkedInPost } from '../config/deepseek';
import './PostGenerator.css';

const toneOptions = ['Professional', 'Casual'];
const lengthOptions = ['Standard', 'Extended'];

function PostGenerator({ selectedPost, setSelectedPost }) {
    const initialFormData = {
        topic: '',
        tone: 'Professional',
        length: 'Standard',
        includeHashtags: false,
        includeEmojis: false,
        variations: 1,
        wordCount: 50
    };

    const [formData, setFormData] = useState(initialFormData);
    const [generatedPost, setGeneratedPost] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (selectedPost) {
            setFormData(prevData => ({
                ...prevData,
                topic: selectedPost.content
            }));
            setSelectedPost(null);
        }
    }, [selectedPost, setSelectedPost]);

    const handleInputChange = useCallback((e) => {
        e.stopPropagation();
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (name === 'topic') setError('');
    }, []);

    const handleWordCountChange = useCallback((e) => {
        e.stopPropagation();
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            setFormData(prev => ({...prev, wordCount: value}));
        }
    }, []);

    const saveToHistory = useCallback((content) => {
        const savedPosts = JSON.parse(localStorage.getItem('linkedinPosts') || '[]');
        const newPost = {
            content,
            date: new Date().toISOString(),
            favorite: false
        };
        savedPosts.unshift(newPost);
        localStorage.setItem('linkedinPosts', JSON.stringify(savedPosts));
    }, []);

    const resetForm = useCallback((e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setFormData(initialFormData);
        setGeneratedPost('');
        setError('');
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
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
                formData.tone.toLowerCase(),
                formData.length.toLowerCase(),
                formData.wordCount
            );
            setGeneratedPost(post);
            saveToHistory(post);
        } catch (error) {
            console.error('Generation error:', error);
            setError(error.message || 'Failed to generate post. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [formData, saveToHistory]);

    const handleTextareaClick = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return (
        <div className="post-generator-container">
            <div className="prompt-section">
                <h2>Your Prompt</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <textarea
                            name="topic"
                            value={formData.topic}
                            onChange={handleInputChange}
                            onClick={handleTextareaClick}
                            onFocus={handleTextareaClick}
                            placeholder="Describe the topic for which you need LinkedIn Post Ideas.

For example:
'Technology & Gadgets', 'Upcoming Companies', 'Innovation'"
                            required
                            autoFocus
                            spellCheck="true"
                        />
                    </div>

                    <div className="form-options">
                        <div className="form-group">
                            <label>Voice Tone</label>
                            <div className="tone-options">
                                {toneOptions.map(tone => (
                                    <div
                                        key={tone}
                                        className={`tone-option ${formData.tone === tone ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({...prev, tone: tone}))}
                                    >
                                        {tone}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Post Length</label>
                            <div className="length-options">
                                {lengthOptions.map(length => (
                                    <div
                                        key={length}
                                        className={`length-option ${formData.length === length ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({...prev, length: length}))}
                                    >
                                        {length}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="word-count">
                            <label>Approx. Words</label>
                            <div className="word-count-control">
                                <input
                                    type="range"
                                    min="30"
                                    max="200"
                                    step="10"
                                    name="wordCount"
                                    value={formData.wordCount}
                                    onChange={handleWordCountChange}
                                    onClick={e => e.stopPropagation()}
                                />
                                <span>{formData.wordCount}</span>
                            </div>
                        </div>

                        <div className="checkbox-options">
                            <label>
                                <input
                                    type="checkbox"
                                    name="includeHashtags"
                                    checked={formData.includeHashtags}
                                    onChange={handleInputChange}
                                    onClick={e => e.stopPropagation()}
                                />
                                Generate Hashtags
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="includeEmojis"
                                    checked={formData.includeEmojis}
                                    onChange={handleInputChange}
                                    onClick={e => e.stopPropagation()}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData(prev => ({...prev, variations: num}));
                                        }}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className={`generate-button ${loading ? 'loading' : ''}`}
                                disabled={loading || !formData.topic.trim()}
                                onClick={e => e.stopPropagation()}
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
                            {generatedPost && (
                                <button 
                                    type="button"
                                    className="reset-button"
                                    onClick={resetForm}
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <div className="results-section">
                <h2>Results</h2>
                {!generatedPost && !loading && !error && (
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
                )}

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
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(generatedPost);
                                }}
                                className="copy-button"
                            >
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