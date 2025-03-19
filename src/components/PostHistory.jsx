import { useState, useEffect } from 'react';
import { FaRegStar, FaStar, FaEdit, FaTrash, FaFileDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import './PostHistory.css';

function PostHistory({ onEditPost }) {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = () => {
        const savedPosts = JSON.parse(localStorage.getItem('linkedinPosts') || '[]');
        setPosts(savedPosts);
    };

    const toggleFavorite = (index) => {
        const updatedPosts = [...posts];
        updatedPosts[index].favorite = !updatedPosts[index].favorite;
        localStorage.setItem('linkedinPosts', JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
    };

    const deletePost = (index) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const updatedPosts = posts.filter((_, i) => i !== index);
            localStorage.setItem('linkedinPosts', JSON.stringify(updatedPosts));
            setPosts(updatedPosts);
        }
    };

    const exportToPDF = (post) => {
        const doc = new jsPDF();
        const splitText = doc.splitTextToSize(post.content, 180);
        
        // Add title
        doc.setFontSize(16);
        doc.text('LinkedIn Post', 105, 20, { align: 'center' });
        
        // Add content
        doc.setFontSize(12);
        doc.text(splitText, 15, 40);
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date(post.date).toLocaleString()}`, 15, doc.internal.pageSize.height - 20);
        
        doc.save(`linkedin-post-${new Date().toISOString().slice(0,10)}.pdf`);
    };

    const filteredPosts = posts.filter(post => {
        if (filter === 'favorites') return post.favorite;
        return true;
    });

    return (
        <div className="post-history">
            <div className="history-header">
                <h2>Post History</h2>
                <div className="filter-options">
                    <button 
                        className={filter === 'all' ? 'active' : ''} 
                        onClick={() => setFilter('all')}
                    >
                        All Posts
                    </button>
                    <button 
                        className={filter === 'favorites' ? 'active' : ''} 
                        onClick={() => setFilter('favorites')}
                    >
                        Favorites
                    </button>
                </div>
            </div>

            <div className="history-list">
                {filteredPosts.length === 0 ? (
                    <div className="no-posts">
                        <p>{filter === 'favorites' ? 'No favorite posts yet.' : 'No posts in history yet.'}</p>
                        <p>Generated posts will appear here.</p>
                    </div>
                ) : (
                    filteredPosts.map((post, index) => (
                        <div key={index} className="history-item">
                            <div className="post-content">
                                <p>{post.content}</p>
                                <div className="post-meta">
                                    <span className="post-date">
                                        {new Date(post.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="post-actions">
                                <button
                                    className={`favorite-btn ${post.favorite ? 'active' : ''}`}
                                    onClick={() => toggleFavorite(index)}
                                    title={post.favorite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    {post.favorite ? <FaStar /> : <FaRegStar />}
                                </button>
                                <button
                                    className="edit-btn"
                                    onClick={() => onEditPost(post)}
                                    title="Edit post"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="export-btn"
                                    onClick={() => exportToPDF(post)}
                                    title="Export as PDF"
                                >
                                    <FaFileDownload />
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => deletePost(index)}
                                    title="Delete post"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PostHistory;
