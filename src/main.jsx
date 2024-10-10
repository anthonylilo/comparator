import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Purina from './pages/purina';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/styles.css';
import Nutrition from './pages/nutrition';
import Professional from './pages/nestlePro';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/comparator" element={<Purina />} />
        <Route path="/comparator/nutrition" element={<Nutrition />} />
        <Route path="/comparator/professional" element={<Professional />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
