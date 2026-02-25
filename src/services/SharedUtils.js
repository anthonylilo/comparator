export const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

export const toProxied = (u) => {
  if (!u) return u;
  const trimmed = u.trim();
  return trimmed.startsWith(PROXY_URL) ? trimmed : PROXY_URL + trimmed;
};

export const checkUrlStatus = async (url) => {
  if (!url) return null;
  try {
    // Use HEAD first (lighter), then fallback to GET if HEAD is not allowed.
    const head = await fetch(toProxied(url), { method: "HEAD" });
    if (head && typeof head.status === "number") return head.status;

    const get = await fetch(toProxied(url), { method: "GET" });
    return get && typeof get.status === "number" ? get.status : null;
  } catch (error) {
    console.error("Error fetching URL status:", error);
    return null;
  }
};

export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return null;
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const fetchImageDetails = async (imageUrl) => {
  // Get width/height without CORS by using the browser Image() loader.
  const { width, height } = await new Promise((resolve) => {
    if (!imageUrl) return resolve({ width: null, height: null });
    const img = new Image();
    img.onload = () =>
      resolve({
        width: img.naturalWidth || null,
        height: img.naturalHeight || null,
      });
    img.onerror = () => resolve({ width: null, height: null });
    img.src = imageUrl;
  });

  // Get file size (Content-Length) via proxy using HEAD request.
  let size = null;
  try {
    const resp = await fetch(toProxied(imageUrl), { method: "HEAD" });
    const len = resp.headers.get("content-length");
    if (len) size = formatFileSize(parseInt(len, 10));
  } catch (e) {
    // Leave size as null if headers are not exposed or the proxy request fails.
  }

  return { width, height, size };
};

export const extractMetaData = ($) => {
  const title = $("title").text();
  const metaDescription = $("meta[name='description']").attr("content");
  const metaRobots = $("meta[name='robots']").attr("content");
  const metaKeyWords = $("meta[name='keywords']").attr("content");
  const metaGeoRegion = $("meta[name='geo.region']").attr("content");
  const metaGeoPlacename = $("meta[name='geo.placename']").attr("content");
  const h1Title = $("h1")
    .map((_, el) => $(el).text().trim())
    .get();

  return {
    title,
    metaDescription,
    metaRobots,
    metaKeyWords,
    metaGeoRegion,
    metaGeoPlacename,
    h1Title,
  };
};

export const extractJsonLdSchema = ($) => {
  const schemaScripts = $('script[type="application/ld+json"]');
  const schemas = [];

  schemaScripts.each((_, el) => {
    const schema = $(el).html();
    if (schema) {
      try {
        schemas.push(JSON.parse(schema));
      } catch (err) {
        console.warn("Malformed JSON-LD detected:", err);
      }
    }
  });

  return schemas.length > 0 ? schemas[0] : null;
};
