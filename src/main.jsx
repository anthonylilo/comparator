import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/styles.css';
import Nutrition from './pages/nutrition';
import Proffessional from './pages/nestlePro';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/comparator/" element={<HomePage />} />
        <Route path="/comparator/nutrition" element={<Nutrition />} />
        <Route path="/comparator/proffessional" element={<Proffessional />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
