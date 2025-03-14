import React from 'react'
import './App.css'
import PostGenerator from './components/PostGenerator'

function App() {
  return (
    <div className="app">
      <header>
        <div className="header-content">
          <h1>LinkedIn Post Generator</h1>
          <p className="subtitle">Transform your ideas into engaging professional content</p>
        </div>
      </header>
      <main>
        <PostGenerator />
      </main>
      <footer>
        <p>Elevate your LinkedIn presence • Drive engagement • Build your professional brand</p>
      </footer>
    </div>
  )
}

export default App