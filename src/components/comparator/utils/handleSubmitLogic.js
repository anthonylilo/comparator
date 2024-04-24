import axios from "axios";
import cheerio from "cheerio";

const checkUrlStatus = (url) => {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const requestUrl = proxyUrl + url;
  return new Promise((resolve) => {
    fetch(requestUrl, { method: "GET" })
      .then((response) => resolve(response.status))
      .catch((error) => resolve(error.status));
  });
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleSubmitLogic = async (
  url,
  setUrl,
  setLoading,
  setTextareaValue,
  setImageUrls,
  setInvalidLinks,
  setLinkStatuses,
  setSchema,
  setShowAdditionalFields,
  setTitle,
  setMetaDescription
) => {
  setLoading(true);
  try {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const requestUrl = proxyUrl + url;
    const response = await axios.get(requestUrl);
    const $ = cheerio.load(response.data);
    const articleContent = $(".article-internal.article-container").html();
    const title = $("title").text();
    const metaDescription = $("meta[name='description']").attr("content");
    const extractedUrl = response.config.url;
    setTitle(title);
    setMetaDescription(metaDescription);
    setTextareaValue(articleContent);
    setUrl(extractedUrl)

    const baseUrl = new URL(url).origin;
    const baseDomain = baseUrl.split(".").slice(-2).join(".");
    const urls = [];
    const invalid = [];
    const imageInfo = [];
    // Images
    $(".article-internal.article-container img").each(async (index, element) => {
      const relativeUrl = $(element).attr("src");
      const absoluteUrl = new URL(relativeUrl, baseUrl).href;
      const altText = $(element).attr("alt") || "Empty";
      const imageTitle = $(element).attr("title") || "Empty";
      const imageName = relativeUrl.substring(relativeUrl.lastIndexOf("/") + 1);

      // Get image size
      try {
        const imageResponse = await axios.head(absoluteUrl);
        const imageSize = imageResponse.headers['content-length'];
        const formattedSize = formatFileSize(imageSize);
        imageInfo.push({
          src: absoluteUrl,
          alt: altText,
          title: imageTitle,
          imageName: imageName,
          size: formattedSize
        });
      } catch (error) {
        console.error("Error fetching image size:", error);
      }
    });
    setImageUrls(imageInfo);

    // Invalid links
    const linkStatusesObj = {};
    for (const element of $(".article-internal.article-container a")) {
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
    }
    setInvalidLinks(invalid);
    setLinkStatuses(linkStatusesObj);

    const schemaScripts = $('script[type="application/ld+json"]');
    const schemas = [];
    schemaScripts.each((index, element) => {
      const schema = $(element).html();
      if (schema) {
        schemas.push(JSON.parse(schema));
      }
    });
    if (schemas.length > 0) {
      setSchema(schemas[0]);
    } else {
      setSchema(null);
    }

    setShowAdditionalFields(true);
  } catch (error) {
    console.error("Error fetching HTML:", error);
  }
  setLoading(false);
};

export default handleSubmitLogic;
