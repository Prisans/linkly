import React, { useState } from 'react'
import './App.css'
import PostGenerator from './components/PostGenerator'
import PostHistory from './components/PostHistory'
import { FaHistory, FaTimes } from 'react-icons/fa'

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setIsHistoryOpen(false);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <div className="app">
      <button 
        className="toggle-history" 
        onClick={toggleHistory}
        title={isHistoryOpen ? "Close History" : "Open History"}
      >
        {isHistoryOpen ? <FaTimes /> : <FaHistory />}
      </button>
      
      <div className={`sidebar ${isHistoryOpen ? 'open' : ''}`}>
        <PostHistory onEditPost={handleEditPost} />
      </div>

      <div className="main-content">
        <header>
          <div className="header-content">
            <h1>LinkedIn Post Generator</h1>
            <p className="subtitle">Transform your ideas into engaging professional content</p>
          </div>
        </header>
        <main>
          <PostGenerator selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
        </main>
        <footer>
          <p>Elevate your LinkedIn presence • Drive engagement • Build your professional brand</p>
        </footer>
      </div>
    </div>
  )
}

export default App