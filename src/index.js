import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/styles.css";
import routesData from "../src/languages/routes.json";

// Import components
import AboutPage from "./pages/about";
import Purina from "./pages/purina";
import Recetas from "./pages/recetas";
import Nutrition from "./pages/nutrition";
import Professional from "./pages/nestlePro";
import SeoCheckerPage from "./pages/seoCheckerPage";
import Redirection from "./pages/redirection";

// Map the component names to the actual components
const componentsMap = {
  AboutPage,
  Purina,
  Recetas,
  Nutrition,
  Professional,
  SeoCheckerPage,
  Redirection
};

console.log("Esta funcionando");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <Router>
    <Routes>
      {routesData.map((route, index) => {
        const Component = componentsMap[route.component];
        return <Route key={index} path={route.path} element={<Component />} />;
      })}
    </Routes>
  </Router>
</React.StrictMode>
);
