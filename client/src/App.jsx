import React from 'react'
import './index.css'

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#48bb78' }}>🌬️ Breathe Well</h1>
      <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>Testing React</p>
      <button 
        onClick={() => alert('React is working!')}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#48bb78',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Click Me
      </button>
    </div>
  )
}

export default App
