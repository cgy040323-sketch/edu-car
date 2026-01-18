import React from 'react'
import ReactDOM from 'react-dom/client'
import EduCarPage from './pages/EduCarPage'
import './main.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root container not found')
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <EduCarPage />
  </React.StrictMode>
)
