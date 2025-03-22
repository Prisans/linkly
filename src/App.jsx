import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Navbar from './components/Navbar/Navbar';
import PostGenerator from './components/PostGenerator';
import PostHistory from './components/PostHistory';
import { FaHistory, FaTimes } from 'react-icons/fa'
import './App.css'

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState(null);

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setIsHistoryOpen(false);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="app-dashboard">
                <Navbar />
                <div className="app-content">
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
              </div>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App