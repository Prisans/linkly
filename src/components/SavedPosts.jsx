import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './SavedPosts.css';

function SavedPosts({ user }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [user]);

    const fetchPosts = async () => {
        try {
            const q = query(
                collection(db, 'posts'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await deleteDoc(doc(db, 'posts', postId));
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            alert('Failed to delete post. Please try again.');
        }
    };

    const handleCopy = async (content) => {
        try {
            await navigator.clipboard.writeText(content);
            alert('Post copied to clipboard!');
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            alert('Failed to copy post. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading">Loading saved posts...</div>;
    }

    return (
        <div className="saved-posts">
            <h2>Saved Posts</h2>
            {posts.length === 0 ? (
                <div className="no-posts">
                    <p>No saved posts yet. Generate and save some posts to see them here!</p>
                </div>
            ) : (
                <div className="posts-grid">
                    {posts.map(post => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <h3>{post.topic}</h3>
                                <div className="post-meta">
                                    <span className="post-tone">{post.tone}</span>
                                    <span className="post-length">{post.length}</span>
                                </div>
                            </div>
                            <div className="post-content">
                                {post.content}
                            </div>
                            <div className="post-actions">
                                <button 
                                    className="copy-btn"
                                    onClick={() => handleCopy(post.content)}
                                >
                                    Copy
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SavedPosts; 