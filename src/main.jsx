import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Purina from './pages/purina';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/styles.css';
import Nutrition from './pages/nutrition';
import Professional from './pages/nestlePro';
import HttpChecker from './pages/httpChecker';
import MetaData from './pages/metaData';
import Redirection from './pages/redirection';
import AboutPage from './pages/about'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/comparator" element={<AboutPage />} />
        <Route path="/comparator/purina" element={<Purina />} />
        <Route path="/comparator/nutrition" element={<Nutrition />} />
        <Route path="/comparator/professional" element={<Professional />} />
        <Route path="/comparator/http-checker" element={<HttpChecker />} />
        <Route path="/comparator/meta-data-checker" element={<MetaData />} />
        <Route path="/comparator/redirection-validation" element={<Redirection />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
