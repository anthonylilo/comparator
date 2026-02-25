import routesStr from "../strings/routes.json";

export const Language = (lang) => {
  localStorage.setItem("language", lang);
  document.location.href = routesStr.app.path;
};

export const routes = routesStr;
