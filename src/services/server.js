import { routes } from "./languages";

export const ApiServer = () => {
  const url = new URL(document.location.href);
  if (mode() === "local") {
    return process.env.REACT_APP_API_SERVER;
  }
  return (
    url.protocol +
    "//" +
    url.hostname +
    ":" +
    process.env.REACT_APP_API_PORT +
    process.env.REACT_APP_API_PATH +
    "/"
  );
};

export const AppServer = () => {
  const url = new URL(document.location.href);
  return url.protocol + "//" + url.hostname + ":" + url.port + "/";
};

export const AppPath = () => {
  const url = new URL(document.location.href);
  return url.protocol + "//" + url.hostname + ":" + url.port + routes.app.path;
};

export const AuthServer = () => {
  if (mode() === "local") {
    return mode();
  }
  if (mode() === "mat") {
    return process.env.REACT_APP_WINDOWS_AUTH_PREPROD;
  }
  if (mode() === "prod") {
    return process.env.REACT_APP_WINDOWS_AUTH_PROD;
  }
};

const mode = () => {
  const url = new URL(document.location.href);
  const prefix = url.hostname.substring(0, 2);
  if (prefix === "br") {
    return "mat";
  } else if (prefix === "xw") {
    return "prod";
  }
  return "local";
};
