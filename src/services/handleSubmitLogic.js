import axios from "axios";
import { load } from 'cheerio';

const checkUrlStatus = async (url) => {
  try {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const requestUrl = url.startsWith(proxyUrl) ? url : proxyUrl + url.trim();
    const response = await fetch(requestUrl, { method: "GET" });
    return response.status;
  } catch (error) {
    console.error("Error fetching URL status:", error);
    return null;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const fetchImageDetails = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      axios
        .get(imageUrl, { responseType: "arraybuffer" })
        .then((response) => {
          const size = formatFileSize(response.headers["content-length"]);
          resolve({ width, height, size });
        })
        .catch(reject);
    };
    img.onerror = reject;
  });
};

const extractMetaData = ($) => {
  const title = $("title").text();
  const metaDescription = $("meta[name='description']").attr("content");
  const articleTitle = $(".article-internal-title span").text();
  const h1Title = $("h1").map((i, el) => $(el).text().trim()).get();
  return { title, metaDescription, articleTitle, h1Title };
};

// Función para extraer esquema JSON-LD
const extractJsonLdSchema = ($) => {
  const schemaScripts = $('script[type="application/ld+json"]');
  const schemas = [];
  schemaScripts.each((index, element) => {
    const schema = $(element).html();
    if (schema) {
      schemas.push(JSON.parse(schema));
    }
  });
  return schemas.length > 0 ? schemas[0] : null;
};

// Función principal
const handleSubmitLogic = async (
  url,
  redirectUrls,
  setUrl,
  setLoading,
  setInvalidLinks,
  setLinkStatuses,
  setSchema,
  setShowAdditionalFields,
  setTitle,
  setMetaDescription,
  setBanner,
  setArticleContent,
  setRedirectStatuses,
  setArticleTitle,
  setH1Title // Corrected parameter name
) => {
  setLoading(true);
  try {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const requestUrl = url.startsWith(proxyUrl) ? url : proxyUrl + url.trim();
    const response = await axios.get(requestUrl);
    const $ = load(response.data);

    // **Extraer metadatos usando la nueva función**
    const { title, metaDescription, articleTitle, h1Title } = extractMetaData($);
    setTitle(title);
    setMetaDescription(metaDescription);
    setArticleTitle(articleTitle);
    setH1Title(h1Title); // Corrected function call

    // Extraer banner
    const bannerSrc = $(".article-internal-header-img img").attr("src");
    const bannerAlt = $(".article-internal-header-img img").attr("alt");
    const bannerSrcUrl = new URL(bannerSrc, url.trim()).href;
    const bannerTitle = $(".article-internal-header-img img").attr("title");
    const bannerFilename = bannerSrc.substring(bannerSrc.lastIndexOf("/") + 1);

    const bannerDetails = await fetchImageDetails(bannerSrcUrl);
    setBanner({
      src: bannerSrcUrl,
      alt: bannerAlt,
      title: bannerTitle,
      width: bannerDetails.width,
      height: bannerDetails.height,
      size: bannerDetails.size,
      imageName: bannerFilename,
    });

    // Extraer el contenido del artículo
    const contentArray = [];
    const elements = $(
      ".article-internal-body .wysiwyg, .article-internal-body img"
    );
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if ($(element).is("img")) {
        const imgSrc = $(element).attr("src");
        const imgAlt = $(element).attr("alt") || "Empty";
        const imgTitle = $(element).attr("title") || "Empty";
        const imgSrcUrl = new URL(imgSrc, url.trim()).href;
        const imgFilename = imgSrc.substring(imgSrc.lastIndexOf("/") + 1);

        const imgDetails = await fetchImageDetails(imgSrcUrl);
        contentArray.push({
          type: "image",
          src: imgSrcUrl,
          alt: imgAlt,
          title: imgTitle,
          imageName: imgFilename,
          width: imgDetails.width,
          height: imgDetails.height,
          size: imgDetails.size,
        });
      } else if ($(element).is("div")) {
        const htmlContent = $(element).html();
        contentArray.push({
          type: "html",
          content: htmlContent,
        });
      }
    }

    setArticleContent(contentArray);

    const saveContentToLocalStorage = (contentArray) => {
      localStorage.setItem("articleContent", JSON.stringify(contentArray));
    };
    saveContentToLocalStorage(contentArray);

    // Check invalid links
    const baseUrl = new URL(url.trim()).origin;
    const baseDomain = baseUrl.split(".").slice(-2).join(".");
    const invalid = [];
    const linkStatusesObj = {};

    $(".article-internal-body a").each(async (index, element) => {
      const linkUrl = new URL($(element).attr("href"), baseUrl).href;
      const linkStatus = await checkUrlStatus(linkUrl);
      const linkDomain = new URL(linkUrl).origin.split(".").slice(-2).join(".");

      if (linkStatus === undefined) {
        linkStatusesObj[linkUrl] = "No se pudo obtener el estado";
      } else {
        linkStatusesObj[linkUrl] = linkStatus;
      }

      if (linkDomain !== baseDomain) {
        invalid.push(linkUrl);
      }
    });
    setInvalidLinks(invalid);
    setLinkStatuses(linkStatusesObj);

    // **Extraer esquema usando la nueva función**
    const schema = extractJsonLdSchema($);
    setSchema(schema);

    // Manejar URLs de redirección
    const redirectUrlsArray = redirectUrls.split(",");
    const redirectStatuses = {};
    for (const redirectUrl of redirectUrlsArray) {
      const trimmedUrl = redirectUrl.trim();
      const status = await checkUrlStatus(trimmedUrl);
      redirectStatuses[trimmedUrl] = status;
    }
    setRedirectStatuses(redirectStatuses);

    setShowAdditionalFields(true);
  } catch (error) {
    console.error("Error fetching HTML:", error);
  }
  setLoading(false);
};

export default handleSubmitLogic;
