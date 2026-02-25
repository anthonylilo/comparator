import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/styles.css";
import routesData from "../src/languages/routes.json";

// Import components
import AboutPage from "./pages/AboutPage";
import Purina from "./pages/Purina";
import Recetas from "./pages/Recetas";
import Nutrition from "./pages/Nutrition";
import Professional from "./pages/Professional";
import SeoCheckerPage from "./pages/SeoCheckerPage";
import Redirection from "./pages/Redirection";
import Ndg from "./pages/Ndg";

// Map the component names to the actual components
const componentsMap = {
  AboutPage,
  Purina,
  Recetas,
  Nutrition,
  Professional,
  SeoCheckerPage,
  Redirection,
  Ndg,
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {routesData.map((route, index) => {
          const Component = componentsMap[route.component];
          return (
            <Route key={index} path={route.path} element={<Component />} />
          );
        })}
      </Routes>
    </Router>
  </React.StrictMode>,
);
