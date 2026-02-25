export const PurinaCrawler = async ({
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
  setDescriptionIntro,
  setBrandSelected,
  setCategory,
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

  // Extract the "abstract" meta tag as the article description intro.
  const abstractContent = String(
    $('meta[name="abstract"]').attr("content") || "",
  )
    .replace(/\s+/g, " ")
    .trim();

  if (typeof setDescriptionIntro === "function") {
    setDescriptionIntro(abstractContent);
  }

  // Map sponsor slugs to their human-readable brand label.
  const sponsorSlugToLabelMap = {
    one: "Purina One",
    alpo: "Alpo",
    proplan: "Purina ProPlan",
    beneful: "Beneful",
    bonelo: "Bonelo",
    campeon: "Campeon",
    catchow: "Catchow",
    dentalife: "DentaLife",
    dogchow: "DogChow",
    dogui: "Dogui",
    doko: "Doko",
    excellent: "Excellent",
    fancy_feast: "Fancy Feast",
    felix: "Felix",
    friskies: "Friskies",
    gatina: "Gatina",
    gati: "Gati",
    tidycats: "TidyCats",
  };

  // Resolve sponsor brand from the sponsor-by anchor href (e.g. "/catchow").
  const sponsorHrefRaw = String(
    $(".article-sponsor_by a.article-sponsor_by-link").first().attr("href") ||
      "",
  ).trim();

  const sponsorSlug = sponsorHrefRaw
    ? sponsorHrefRaw
        .replace(/^https?:\/\/[^/]+/i, "")
        .split(/[?#]/)[0]
        .split("/")
        .filter(Boolean)[0] || ""
    : "";

  const brandSelectedValue = sponsorSlugToLabelMap[sponsorSlug] || "";

  if (typeof setBrandSelected === "function") {
    setBrandSelected(brandSelectedValue);
  }

  // Build an absolute URL using the current page URL as the base.
  const toAbsoluteUrl = (rawValue) => {
    try {
      return new URL(rawValue, url.trim()).href;
    } catch {
      return null;
    }
  };

  // Normalize image URLs for deduplication (absolute URL without query/hash).
  const normalizeImageUrlKey = (rawValue) => {
    const absoluteUrl = toAbsoluteUrl(rawValue);
    if (!absoluteUrl) return null;

    try {
      const parsedUrl = new URL(absoluteUrl);
      parsedUrl.hash = "";
      parsedUrl.search = "";
      return parsedUrl.href;
    } catch {
      return absoluteUrl;
    }
  };

  // Extract first category chip (first span inside article-header_category)
  const categoryValue = String(
    $(".article-header_category span.chip").first().text() || "",
  )
    .replace(/\s+/g, " ")
    .trim();

  if (typeof setCategory === "function") {
    setCategory(categoryValue);
  }

  const $bannerImg = $(".article-header_image img").first();
  const bannerSrcRaw =
    $bannerImg.attr("src") || $bannerImg.attr("data-src") || "";
  const bannerAlt = $bannerImg.attr("alt") || "";
  const bannerTitle = $bannerImg.attr("title") || "Empty";

  // Track already processed image URLs to avoid duplicates.
  const seenImages = new Set();

  let bannerSrcUrl = null;
  let bannerFilename = "";
  let bannerDetails = null;

  if (bannerSrcRaw) {
    bannerSrcUrl = toAbsoluteUrl(bannerSrcRaw);

    const bannerKey = normalizeImageUrlKey(bannerSrcRaw);
    if (bannerKey) seenImages.add(bannerKey);

    bannerFilename = bannerSrcUrl
      ? bannerSrcUrl.substring(bannerSrcUrl.lastIndexOf("/") + 1)
      : "";

    if (bannerSrcUrl) {
      bannerDetails = await fetchImageDetails(bannerSrcUrl);

      const bannerObj = {
        src: bannerSrcUrl,
        alt: bannerAlt || "Empty",
        title: bannerTitle || "Empty",
        width: bannerDetails.width,
        height: bannerDetails.height,
        size: bannerDetails.size,
        imageName: bannerFilename || "Empty",
        urlActual: bannerSrcUrl,
        urlSuggested: "",
        __isBanner: true,
      };

      setBanner(bannerObj);

      try {
        localStorage.setItem("articleBanner", JSON.stringify(bannerObj));
      } catch {}
    } else {
      setBanner(null);
    }
  } else {
    setBanner(null);
  }
  const contentArray = [];
  const elements = $(
    ".article-body_components .wysiwyg, .article-body_components img",
  );

  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    const $element = $(element);

    if ($element.is("img")) {
      const imgSrcRaw =
        $element.attr("src") ||
        $element.attr("data-src") ||
        $element.attr("data-original") ||
        $element.attr("data-lazy") ||
        "";

      if (!imgSrcRaw) continue;

      const normalizedKey = normalizeImageUrlKey(imgSrcRaw);
      if (normalizedKey && seenImages.has(normalizedKey)) continue;
      if (normalizedKey) seenImages.add(normalizedKey);

      const imgSrcUrl = toAbsoluteUrl(imgSrcRaw);
      if (!imgSrcUrl) continue;

      const imgAlt = $element.attr("alt") || "Empty";
      const imgTitle = $element.attr("title") || "Empty";
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
      continue;
    }

    if ($element.is("div")) {
      const htmlContent = $element.html() || "";
      if (htmlContent.trim()) {
        contentArray.push({
          type: "html",
          content: htmlContent,
        });
      }
    }
  }

  setArticleContent(contentArray);

  // Persist the extracted content for debugging or reuse if localStorage is available.
  try {
    localStorage.setItem("articleContent", JSON.stringify(contentArray));
  } catch {
    // Ignore localStorage failures (SSR, privacy mode, or blocked storage).
  }

  const baseUrl = new URL(url.trim());
  const baseOrigin = baseUrl.origin;
  const baseETldPlusOne = baseUrl.hostname.split(".").slice(-2).join(".");

  const invalidLinks = [];

  // This map stores metadata per resolved absolute URL.
  const linkDetailsByUrl = new Map();

  // This set ensures we request HTTP status only once per URL.
  const visitedUrlSet = new Set();

  // This helper extracts a reliable "anchor label" for QA.
  const getAnchorLabel = ($anchor) => {
    const textValue = String($anchor.text() || "")
      .replace(/\s+/g, " ")
      .trim();
    if (textValue) return textValue;

    const ariaLabelValue = String($anchor.attr("aria-label") || "").trim();
    if (ariaLabelValue) return ariaLabelValue;

    const titleValue = String($anchor.attr("title") || "").trim();
    if (titleValue) return titleValue;

    const imgAltValue = String(
      $anchor.find("img").first().attr("alt") || "",
    ).trim();
    if (imgAltValue) return imgAltValue;

    const hrefValue = String($anchor.attr("href") || "").trim();
    if (hrefValue) return hrefValue;

    return "Empty";
  };

  const anchorElements = $(".article-body_components a").toArray();

  await Promise.all(
    anchorElements.map(async (anchorEl) => {
      const $anchor = $(anchorEl);
      const hrefRawValue = String($anchor.attr("href") || "").trim();

      if (!hrefRawValue) return;
      if (/^(#|mailto:|tel:|javascript:)/i.test(hrefRawValue)) return;

      let linkUrl;
      try {
        linkUrl = new URL(hrefRawValue, baseOrigin).href;
      } catch {
        return;
      }

      const anchorLabel = getAnchorLabel($anchor);

      if (!linkDetailsByUrl.has(linkUrl)) {
        linkDetailsByUrl.set(linkUrl, {
          status: null,
          anchors: [],
          occurrences: 0,
        });
      }

      const current = linkDetailsByUrl.get(linkUrl);
      current.anchors.push(anchorLabel);
      current.occurrences += 1;

      // Fetch status only once per unique URL.
      if (!visitedUrlSet.has(linkUrl)) {
        visitedUrlSet.add(linkUrl);

        const statusValue = await checkUrlStatus(linkUrl);
        current.status = statusValue ?? "No se pudo obtener el estado";

        const linkETldPlusOne = new URL(linkUrl).hostname
          .split(".")
          .slice(-2)
          .join(".");

        if (linkETldPlusOne !== baseETldPlusOne) invalidLinks.push(linkUrl);
      }
    }),
  );

  // Build the final object consumed by the UI.
  const linkStatusesObj = {};
  for (const [linkUrl, details] of linkDetailsByUrl.entries()) {
    const uniqueAnchors = Array.from(new Set(details.anchors)).filter(Boolean);

    linkStatusesObj[linkUrl] = {
      status: details.status ?? "No se pudo obtener el estado",
      anchors: uniqueAnchors.length ? uniqueAnchors : ["Empty"],
      occurrences: details.occurrences,
    };
  }

  setInvalidLinks(invalidLinks);
  setLinkStatuses(linkStatusesObj);

  const redirectStatuses = {};
  const redirectUrlsArray = (redirectUrls || "")
    .split(",")
    .map((rawValue) => rawValue.trim())
    .filter(Boolean);

  for (const redirectUrl of redirectUrlsArray) {
    const status = await checkUrlStatus(redirectUrl);
    redirectStatuses[redirectUrl] = status;
  }

  setRedirectStatuses(redirectStatuses);

  setShowAdditionalFields(true);

  const schema = extractJsonLdSchema($);
  setSchema(schema);

  setShowAdditionalFields(true);
  setLoading(false);
};
