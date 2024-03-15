import axios from "axios";
import cheerio from "cheerio";

const handleSubmitLogic = async (
  url,
  setLoading,
  setTextareaValue,
  setImageUrls,
  setInvalidLinks,
  setSchema,
  setShowAdditionalFields
) => {
  setLoading(true);
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const articleContent = $(".article-internal.article-container").html();
    setTextareaValue(articleContent);

    const baseUrl = new URL(url).origin;
    const baseDomain = baseUrl.split(".").slice(-2).join(".");
    const urls = [];
    const invalid = [];
    $(".article-internal.article-container img").each((index, element) => {
      const relativeUrl = $(element).attr("src");
      const absoluteUrl = new URL(relativeUrl, baseUrl).href;
      const altText = $(element).attr("alt") || "Empty";
      const imageTitle = $(element).attr("title") || "Empty";
      urls.push({ src: absoluteUrl, alt: altText, title: imageTitle });
    });
    setImageUrls(urls);

    $(".article-internal.article-container a").each((index, element) => {
      const linkUrl = new URL($(element).attr("href"), baseUrl).href;
      const linkDomain = new URL(linkUrl).origin.split(".").slice(-2).join(".");
      if (linkDomain !== baseDomain) {
        invalid.push(linkUrl);
      }
    });

    setInvalidLinks(invalid);

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
