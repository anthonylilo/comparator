import routesStr from "../strings/routes.json";

export const switchLanguage = (lang) => {
  localStorage.setItem("language", lang);
  document.location.href = routesStr.app.path;
};

export const routes = routesStr;
