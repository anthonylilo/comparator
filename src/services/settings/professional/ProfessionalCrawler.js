export const ProfessionalCrawler = async ({
  url,
  $,
  setTitle,
  setMetaDescription,
  setMetaRobots,
  setMetaKeyWords,
  setMetaGeoRegion,
  setMetaGeoPlacename,
  setBanner,
  setArticleContent,
  setHeadingTitle,
  setInvalidLinks,
  setLinkStatuses,
  setSchema,
  fetchImageDetails,
  extractMetaData,
  extractJsonLdSchema,
  checkUrlStatus,
  redirectUrls,
  setRedirectStatuses,
  setShowAdditionalFields,
  setLoading,
}) => {
  const {
    title,
    metaDescription,
    metaRobots,
    metaKeyWords,
    metaGeoRegion,
    metaGeoPlacename,
    h1Title,
  } = extractMetaData($);

  setTitle(title);
  setMetaDescription(metaDescription);
  setMetaRobots(metaRobots);
  setMetaKeyWords(metaKeyWords);
  setMetaGeoRegion(metaGeoRegion);
  setMetaGeoPlacename(metaGeoPlacename);
  setHeadingTitle(h1Title);

  // Banner extraction (hero image).
  const $bannerImg = $(".article-hero-wrapper img").first();
  const bannerSrcRaw =
    $bannerImg.attr("src") || $bannerImg.attr("data-src") || "";
  const bannerAlt = $bannerImg.attr("alt") || "";
  const bannerTitle = $bannerImg.attr("title") || "Empty";

  if (bannerSrcRaw) {
    const bannerSrcUrl = new URL(bannerSrcRaw, url.trim()).href;
    const bannerFilename =
      bannerSrcUrl.substring(bannerSrcUrl.lastIndexOf("/") + 1) || "";

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
  } else {
    setBanner(null);
  }

  // Build article content by capturing text blocks, wrapped images, and CTA links.
  const contentArray = [];

  const blocks = $(
    ".field__item .paragraph--type--c-text .text-formatted, \
     .field__item .paragraph--type--c-image--wrapper img, \
     .generic-teaser-cta a",
  ).toArray();

  for (const el of blocks) {
    const $el = $(el);

    if ($el.is("img")) {
      const srcRaw = $el.attr("src") || $el.attr("data-src") || "";
      if (!srcRaw) continue;

      const imgSrcUrl = new URL(srcRaw, url.trim()).href;
      const imgAlt = $el.attr("alt") || "Empty";
      const imgTitle = $el.attr("title") || "Empty";
      const imgFilename =
        imgSrcUrl.substring(imgSrcUrl.lastIndexOf("/") + 1) || "";

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
    } else if ($el.is("a")) {
      const hrefRaw = $el.attr("href");
      if (!hrefRaw) continue;
      const href = new URL(hrefRaw, url.trim()).href;
      contentArray.push({ type: "link", href });
    } else {
      // Text/HTML block.
      const htmlContent = $el.html() || "";
      if (htmlContent.trim()) {
        contentArray.push({ type: "html", content: htmlContent });
      }
    }
  }

  setArticleContent(contentArray);

  // Check invalid links (wait for all link status promises).
  const baseUrl = new URL(url.trim()).origin;
  const baseDomain = new URL(url.trim()).hostname
    .split(".")
    .slice(-2)
    .join(".");
  const invalidLinks = [];
  const linkStatusesObj = {};

  const anchors = $(".field__item a").toArray();

  await Promise.all(
    anchors.map(async (anchorEl) => {
      const href = $(anchorEl).attr("href");
      if (!href) return;

      const linkUrl = new URL(href, baseUrl).href;
      const linkStatus = await checkUrlStatus(linkUrl);
      const linkDomain = new URL(linkUrl).hostname
        .split(".")
        .slice(-2)
        .join(".");

      linkStatusesObj[linkUrl] =
        linkStatus === undefined || linkStatus === null
          ? "No se pudo obtener el estado"
          : linkStatus;

      if (linkDomain !== baseDomain) invalidLinks.push(linkUrl);
    }),
  );

  setInvalidLinks(invalidLinks);
  setLinkStatuses(linkStatusesObj);

  // Check redirect URLs if provided by the user.
  const redirectStatuses = {};
  const redirectUrlsArray = (redirectUrls || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  for (const redirectUrl of redirectUrlsArray) {
    const status = await checkUrlStatus(redirectUrl);
    redirectStatuses[redirectUrl] = status;
  }

  setRedirectStatuses(redirectStatuses);
  setShowAdditionalFields(true);

  // Extract JSON-LD schema from the page.
  const schema = extractJsonLdSchema($);
  setSchema(schema);

  setShowAdditionalFields(true);
  setLoading(false);
};
