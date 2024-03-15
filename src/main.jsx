import React from 'react'
import ReactDOM from 'react-dom/client'
import HomePage from './pages/home'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
)
