import { load } from "cheerio";
import { ProjectSettings } from "./settings/ProjectSettings";
import {
  checkUrlStatus,
  fetchImageDetails,
  extractMetaData,
  extractJsonLdSchema,
  PROXY_URL,
} from "./SharedUtils";

const HandleSubmitLogic = async (
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
  setMetaRobots,
  setMetaKeyWords,
  setMetaGeoRegion,
  setMetaGeoPlacename,
  setBanner,
  setArticleContent,
  setRedirectStatuses,
  setArticleTitle,
  setHeadingTitle,
  setModalText,
  setShowModal,
  setDescriptionIntro,
  setBrandSelected,
  setCategory,
) => {
  setLoading(true);

  try {
    const requestUrl = url.startsWith(PROXY_URL) ? url : PROXY_URL + url.trim();

    const response = await fetch(requestUrl);
    const html = await response.text();
    const $ = load(html);

    const { config, crawler } = ProjectSettings();

    // Validation: missing or invalid configuration.
    if (!config || !crawler) {
      throw new Error("No valid configuration was found for this project.");
    }

    // Validation: project marked as in progress.
    if (config.status === "inProgress") {
      throw new Error("This project is still under development.");
    }

    // Validation: crawler not available or not ready.
    if (config.crawler === "notReady" || typeof crawler !== "function") {
      throw new Error("The crawler is not yet ready for this project.");
    }

    await crawler({
      url,
      $,
      setUrl,
      setInvalidLinks,
      setLinkStatuses,
      setSchema,
      setShowAdditionalFields,
      setTitle,
      setMetaDescription,
      setMetaRobots,
      setMetaKeyWords,
      setMetaGeoRegion,
      setMetaGeoPlacename,
      setBanner,
      setArticleContent,
      setRedirectStatuses,
      setArticleTitle,
      setHeadingTitle,
      setDescriptionIntro,
      setBrandSelected,
      setCategory,
      fetchImageDetails,
      extractMetaData,
      extractJsonLdSchema,
      checkUrlStatus,
      redirectUrls,
      setLoading,
    });

    setShowAdditionalFields(true);
  } catch (error) {
    console.error("Error in scraping:", error.message);
    if (setModalText && setShowModal) {
      setModalText(error.message || "Unknown error while scraping.");
      setShowModal(true);
    }
  }

  setLoading(false);
};

export default HandleSubmitLogic;
