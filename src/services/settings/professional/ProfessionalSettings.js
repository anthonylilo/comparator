import {
  metaDataPatterns,
  tagRegex,
  redirectionsRegex,
  imageRegex,
  articleRelatedRegex,
  countries,
} from "./ProfessionalRegex";

// Extract metadata when there is no structured SEO block.
function extractMetaData(contentParts) {
  const extractedMetaData = {};
  const tempContentParts = [];
  let isProcessingMetaData = true;

  const updatedContentParts = contentParts.filter((item) => {
    if (item.type === "paragraph") {
      const data = item.data.trim();

      if (isProcessingMetaData) {
        // Keep these Spanish tokens unchanged because they come from the Word document export.
        if (data.startsWith("MERCADO:")) {
          extractedMetaData.market = data.replace("MERCADO:", "").trim();
          return false;
        } else if (data.startsWith("ARTÍCULO No:")) {
          extractedMetaData.articleNumber = data
            .replace("ARTÍCULO No:", "")
            .trim();
          return false;
        } else if (data.startsWith("CATEGORÍA:")) {
          extractedMetaData.category = data.replace("CATEGORÍA:", "").trim();
          return false;
        } else if (data.startsWith("KEYWORD SUGERIDA:")) {
          extractedMetaData.metaKeyWords = data
            .replace("KEYWORD SUGERIDA:", "")
            .trim();
          return false;
        } else if (data.startsWith("__Title:__") && !extractedMetaData.title) {
          extractedMetaData.title = data.replace("__Title:__", "").trim();
          return false;
        } else if (data.startsWith("__Meta descripción:__")) {
          extractedMetaData.metaDescription = data
            .replace("__Meta descripción:__", "")
            .trim();
          return false;
        } else if (data.startsWith("__URL ACTUAL:__")) {
          extractedMetaData.oldUrl = data.replace("__URL ACTUAL:__", "").trim();
          return false;
        } else if (data.startsWith("__URL SUGERIDA:__")) {
          extractedMetaData.suggestedUrl = data
            .replace("__URL SUGERIDA:__", "")
            .trim();
          return false;
        } else if (data.startsWith("__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO:__")) {
          extractedMetaData.introDescription = data
            .replace("__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO:__", "")
            .trim();
          return false;
        } else if (data.startsWith("__SEO:__")) {
          return false;
        } else if (data.startsWith("__FIN DE SEO__")) {
          const transformedData = data.replace("__FIN DE SEO__", "").trim();
          tempContentParts.push({
            type: "paragraph",
            data: transformedData.startsWith("#")
              ? transformedData
              : `# ${transformedData}`,
          });
          isProcessingMetaData = false;
          return false;
        }
      }
    }
    return true;
  });

  return {
    updatedContentParts: [...tempContentParts, ...updatedContentParts],
    extractedMetaData,
  };
}

// Base text cleanup utility.
const cleanText = (text) => {
  return (
    text
      .replace(/\\-/g, "-")
      .replace(/\\\./g, ".")
      .replace(/\\/g, "")
      // Removes "(60 CARACTERES)" / "(155 characters)" style counters.
      .replace(/\s*\(\s*\d+\s*(?:caracteres|characters)\s*\)\s*/gi, "")
      .trim()
  );
};

// Reorders prelude blocks and extracts H1 when the source mixes metadata and content.
const preorderContent = (contentParts) => {
  const stripOuterUnderscores = (value = "") =>
    value.replace(/^__+\s*|\s*__+$/g, "").trim();
  const normalizeText = (value = "") =>
    stripOuterUnderscores(value).replace(/\s+/g, " ").trim();

  const isMetaLine = (textValue) =>
    /^(MERCADO:|OPTIMIZACIÓN\s*No:|CATEGORÍA:|KW:)/i.test(
      normalizeText(textValue),
    );
  const isUnifyLine = (textValue) => /Unificar las URLs/i.test(textValue);
  const isLinkOnlyLine = (textValue) =>
    /^\s*\[[^\]]+\]\([^)]+\)\s*$/.test(textValue);
  const isInformativeLine = (textValue) =>
    /informative\s*text\s*\(do\s*not\s*copy\)\.?/i.test(
      normalizeText(textValue),
    );

  const pickMetaKey = (textValue) => {
    const normalizedUpper = normalizeText(textValue).toUpperCase();
    if (normalizedUpper.startsWith("MERCADO:")) return "MERCADO";
    if (/^OPTIMIZACIÓN\s*NO:/.test(normalizedUpper)) return "OPTIMIZACIÓN NO";
    if (normalizedUpper.startsWith("CATEGORÍA:")) return "CATEGORÍA";
    if (normalizedUpper.startsWith("KW:")) return "KW";
    return "";
  };

  const preludeMetaParts = [];
  let preludeUnifyPart = null;
  const preludeLinkParts = [];
  let preludeHeadingText = null;
  const preludeLeftoverParts = [];

  let cutIndex = 0;
  for (; cutIndex < contentParts.length; cutIndex++) {
    const partItem = contentParts[cutIndex];
    if (partItem.type !== "paragraph") break;

    const rawText = partItem.data || "";

    // Detect inline H1 marker (#) and move prelude content accordingly.
    if (rawText.includes("#")) {
      const hashIndex = rawText.indexOf("#");
      const leftText = rawText.slice(0, hashIndex).trim();
      const rightText = stripOuterUnderscores(
        rawText.slice(hashIndex + 1).trim(),
      );

      if (rightText) {
        preludeHeadingText = rightText;
        if (leftText) {
          preludeLeftoverParts.push({ type: "paragraph", data: leftText });
        }
        cutIndex++;
        break;
      }
      break;
    }

    if (isMetaLine(rawText)) {
      preludeMetaParts.push(partItem);
      continue;
    }
    if (!preludeUnifyPart && isUnifyLine(rawText)) {
      preludeUnifyPart = partItem;
      continue;
    }
    if (isLinkOnlyLine(rawText)) {
      preludeLinkParts.push(partItem);
      continue;
    }
    break;
  }

  const remainingParts = contentParts.slice(cutIndex);

  // Keep only the first image at the top (if any) and preserve the rest.
  let firstImagePart = null;
  const partsWithoutFirstImage = [];
  for (const partItem of remainingParts) {
    if (!firstImagePart && partItem.type === "image") {
      firstImagePart = partItem;
    } else {
      partsWithoutFirstImage.push(partItem);
    }
  }

  // Separate informative text blocks (do not copy) from main content.
  const informativeParts = [];
  const mainContentParts = [];
  for (const partItem of partsWithoutFirstImage) {
    if (
      partItem.type === "paragraph" &&
      isInformativeLine(partItem.data || "")
    ) {
      informativeParts.push(partItem);
    } else {
      mainContentParts.push(partItem);
    }
  }

  // Sort metadata lines in a consistent display order.
  const metaOrder = ["MERCADO", "OPTIMIZACIÓN NO", "CATEGORÍA", "KW"];
  preludeMetaParts.sort(
    (leftPart, rightPart) =>
      metaOrder.indexOf(pickMetaKey(leftPart.data)) -
      metaOrder.indexOf(pickMetaKey(rightPart.data)),
  );

  const outputParts = [];
  if (preludeHeadingText) {
    outputParts.push({ type: "paragraph", data: `# ${preludeHeadingText}` });
  }
  if (firstImagePart) outputParts.push(firstImagePart);
  outputParts.push(...mainContentParts);
  if (informativeParts.length) outputParts.push(...informativeParts);
  if (preludeMetaParts.length) outputParts.push(...preludeMetaParts);
  if (preludeUnifyPart) outputParts.push(preludeUnifyPart);
  if (preludeLeftoverParts.length) outputParts.push(...preludeLeftoverParts);
  if (preludeLinkParts.length) outputParts.push(...preludeLinkParts);

  return outputParts;
};

// Converts related-article blocks and section headings into textCard items.
const sectionsToTextCards = (contentParts) => {
  const outputParts = [];
  let index = 0;

  const stripOuterUnderscores = (value = "") =>
    value.replace(/^__+|__+$/g, "").trim();

  const isArticleStart = (textValue = "") => {
    const stripped = stripOuterUnderscores(textValue);
    return /^ARTICULO\s+RELACIONADO\s+([A-ZÁÉÍÓÚÑÜ ]+):$/i.test(stripped);
  };

  const getArticleCountry = (textValue = "") => {
    const matchResult = stripOuterUnderscores(textValue).match(
      /^ARTICULO\s+RELACIONADO\s+([A-ZÁÉÍÓÚÑÜ ]+):$/i,
    );
    return matchResult ? matchResult[1].trim() : "";
  };

  const isArticleEnd = (textValue = "") => {
    const stripped = stripOuterUnderscores(textValue);
    return /^FIN\s+ARTICULO$/i.test(stripped);
  };

  const findFirstLink = (textValue = "") => {
    const markdownMatch = textValue.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
    if (markdownMatch)
      return { title: markdownMatch[1].trim(), url: markdownMatch[2].trim() };

    const rawUrlMatch = textValue.match(/https?:\/\/\S+/);
    if (rawUrlMatch) return { title: rawUrlMatch[0], url: rawUrlMatch[0] };

    return null;
  };

  const getHeadingText = (textValue = "") => {
    const headingMatch = textValue.match(/^(#{1,6})\s*(.+)$/);
    return headingMatch ? headingMatch[2].trim() : null;
  };

  const cleanUnderscores = (value = "") =>
    value.replace(/^__+|__+$/g, "").trim();

  const linkOnlyPattern = /^\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:[-–—:]\s*(.+))?$/;
  const bulletLinkPattern =
    /^\s*-\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:[-–—:]\s*(.+))?$/;

  const isProductsHeading = (textValue = "") =>
    /productos?\s+recomendados?/i.test(textValue);
  const isRelatedHeading = (textValue = "") =>
    /art[ií]culos?\s+relacionados?/i.test(textValue);

  // Tracks whether we are inside a "products" or "related articles" section.
  let currentSection = null; // 'product' | 'article' | null

  while (index < contentParts.length) {
    const partItem = contentParts[index];

    // Handle "ARTICULO RELACIONADO ... FIN ARTICULO" blocks.
    if (partItem.type === "paragraph" && isArticleStart(partItem.data || "")) {
      const countryName = getArticleCountry(partItem.data || "");
      index++;

      const blockNodes = [];
      while (index < contentParts.length) {
        const nodeItem = contentParts[index];
        if (
          nodeItem.type === "paragraph" &&
          isArticleEnd(nodeItem.data || "")
        ) {
          index++;
          break;
        }
        blockNodes.push(nodeItem);
        index++;
      }

      let chosenLink = null;
      for (const nodeItem of blockNodes) {
        if (nodeItem.type !== "paragraph") continue;
        chosenLink = findFirstLink(nodeItem.data || "");
        if (chosenLink) break;
      }

      outputParts.push({
        type: "textCard",
        data: {
          variant: "article",
          header: "Artículo relacionado",
          badges: ["Artículo"],
          title:
            (chosenLink && chosenLink.title) ||
            (countryName
              ? `Artículo relacionado — ${countryName}`
              : "Artículo relacionado"),
          description: countryName ? `País: ${countryName}` : "",
          url: chosenLink ? chosenLink.url : undefined,
          meta: countryName ? { país: countryName } : {},
        },
      });

      continue;
    }

    // Detect section headings and activate the correct parsing mode.
    if (partItem.type === "paragraph") {
      const headingText = getHeadingText(partItem.data || "");
      if (headingText) {
        const normalizedHeading = cleanUnderscores(headingText);
        if (isProductsHeading(normalizedHeading)) currentSection = "product";
        else if (isRelatedHeading(normalizedHeading))
          currentSection = "article";
        else currentSection = null;

        outputParts.push(partItem);
        index++;
        continue;
      }

      // Convert link lines within a section into textCards.
      if (currentSection) {
        const rawText = partItem.data || "";
        const matchResult =
          rawText.match(bulletLinkPattern) || rawText.match(linkOnlyPattern);

        if (matchResult) {
          const [, titleText, urlText, descriptionText] = matchResult;

          outputParts.push({
            type: "textCard",
            data: {
              variant: currentSection,
              header:
                currentSection === "product"
                  ? "Producto recomendado"
                  : "Artículo relacionado",
              badges: [currentSection === "product" ? "Producto" : "Artículo"],
              title: cleanUnderscores(titleText).trim(),
              description: descriptionText
                ? cleanUnderscores(descriptionText).trim()
                : "",
              url: urlText.trim(),
              meta: {},
            },
          });

          index++;
          continue;
        }
      }
    }

    outputParts.push(partItem);
    index++;
  }

  return outputParts;
};

// Converts country product blocks into product textCards with richHtml.
const countryProductsCards = (contentParts, country = null) => {
  const outputParts = [];

  // Build the set of valid country labels (uppercase), including versions without leading "EL/LA".
  const validRawLabels = countries.map((countryItem) =>
    (countryItem.label || "").toUpperCase().trim(),
  );
  const validSimpleLabels = validRawLabels.map((label) =>
    label.replace(/^(EL |LA )/, ""),
  );
  const validCountrySet = new Set([...validRawLabels, ...validSimpleLabels]);

  // Normalize the selected country label (if filtering is active).
  let selectedRawLabel = null;
  let selectedSimpleLabel = null;
  if (country) {
    const selectedCountry = countries.find(
      (countryItem) => countryItem.value === country,
    );
    if (selectedCountry?.label) {
      selectedRawLabel = selectedCountry.label.toUpperCase().trim();
      selectedSimpleLabel = selectedRawLabel.replace(/^(EL |LA )/, "");
    }
  }

  const matchCountryHeader = (textValue = "") => {
    const trimmedText = (textValue || "").trim();
    const matchResult =
      trimmedText.match(/^__\s*([A-ZÁÉÍÓÚÜÑ ]+)\s*:\s*__$/i) ||
      trimmedText.match(/^([A-ZÁÉÍÓÚÜÑ ]+)\s*:\s*$/i);

    if (!matchResult) return null;

    const candidate = (matchResult[1] || "").toUpperCase().trim();
    return validCountrySet.has(candidate) ? candidate : null;
  };

  const isCountryEnd = (textValue = "") => {
    const trimmedText = (textValue || "").trim();
    return (
      /^__\s*FIN\s+PAIS\s*__$/i.test(trimmedText) ||
      /^FIN\s+PAIS$/i.test(trimmedText)
    );
  };

  const isBulletLine = (textValue = "") => /^\s*-\s+/.test(textValue);

  const isMarkdownLinkOnly = (textValue = "") =>
    /^\s*\[[^\]]+\]\((https?:\/\/[^\s)]+)\)\s*$/.test(textValue);

  const getMarkdownUrl = (textValue = "") => {
    const matchResult = textValue.match(
      /^\s*\[[^\]]+\]\((https?:\/\/[^\s)]+)\)\s*$/,
    );
    return matchResult ? matchResult[1] : null;
  };

  const isRawUrlOnly = (textValue = "") =>
    /^\s*(https?:\/\/\S+)\s*$/.test(textValue);

  const getRawUrl = (textValue = "") => {
    const matchResult = textValue.match(/^\s*(https?:\/\/\S+)\s*$/);
    return matchResult ? matchResult[1] : null;
  };

  for (let index = 0; index < contentParts.length; index++) {
    const partItem = contentParts[index];

    if (partItem.type !== "paragraph") {
      outputParts.push(partItem);
      continue;
    }

    const textValue = (partItem.data || "").trim();

    // Only treat this line as a country header if it matches a valid country name.
    const headerCountry = matchCountryHeader(textValue);
    if (!headerCountry) {
      outputParts.push(partItem);
      continue;
    }

    // If a country filter is active and this block does not match, skip only this country block.
    if (
      selectedRawLabel &&
      !(
        headerCountry === selectedRawLabel ||
        headerCountry === selectedSimpleLabel
      )
    ) {
      let scanIndex = index + 1;
      for (; scanIndex < contentParts.length; scanIndex++) {
        const endCandidate = (contentParts[scanIndex]?.data || "").trim();
        if (isCountryEnd(endCandidate)) break;
      }
      index = scanIndex;
      continue;
    }

    // Build richHtml from the country block content.
    const htmlParts = [];
    htmlParts.push(`<p><strong>${headerCountry}:</strong></p>`);

    let scanIndex = index + 1;
    for (; scanIndex < contentParts.length; scanIndex++) {
      const partNode = contentParts[scanIndex];
      if (partNode.type !== "paragraph") break;

      const nodeText = (partNode.data || "").trim();
      if (isCountryEnd(nodeText)) break;

      // Preserve existing HTML list blocks if already converted.
      if (/^\s*<ul[\s>]/i.test(nodeText) || /<\/ul>\s*$/i.test(nodeText)) {
        htmlParts.push(nodeText);
        continue;
      }

      // Convert markdown bullets into <ul><li>...</li></ul>.
      if (isBulletLine(nodeText)) {
        const items = [];
        nodeText.split(/\n+/).forEach((lineText) => {
          const matchResult = lineText.match(/^\s*-\s*(.+)$/);
          if (matchResult && matchResult[1]) items.push(matchResult[1].trim());
        });
        if (items.length) {
          htmlParts.push(
            `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`,
          );
        }
        continue;
      }

      // Convert standalone links (markdown or raw URL) into safe anchor tags.
      if (isMarkdownLinkOnly(nodeText)) {
        const urlValue = getMarkdownUrl(nodeText);
        if (urlValue) {
          htmlParts.push(
            `<p><a href="${urlValue}" target="_blank" rel="noopener noreferrer">${urlValue}</a></p>`,
          );
        }
        continue;
      }

      if (isRawUrlOnly(nodeText)) {
        const urlValue = getRawUrl(nodeText);
        if (urlValue) {
          htmlParts.push(
            `<p><a href="${urlValue}" target="_blank" rel="noopener noreferrer">${urlValue}</a></p>`,
          );
        }
        continue;
      }

      if (nodeText) htmlParts.push(`<p>${nodeText}</p>`);
    }

    outputParts.push({
      type: "textCard",
      data: {
        variant: "product",
        header: "Productos relacionados",
        badges: ["Producto"],
        richHtml: htmlParts.join(""),
        meta: { país: headerCountry },
      },
    });

    index = scanIndex;
  }

  return outputParts;
};

// Main parser for Professional markdown export.
const parseMarkdownContent = (content, selectedFormat, country = null) => {
  // Remove Word anchor artifacts and normalize content prefix.
  content = content.replace(/<a id="_Hlk\d+"><\/a>/g, "");
  content = content.replace(/\s*__CONTENT:\s*__\s*/, "");

  let metaDisplayParts = [];

  // If a country is selected, filter out unrelated blocks before parsing.
  if (country) {
    const selectedCountryLabel = countries
      .find((countryItem) => countryItem.value === country)
      .label.toUpperCase();

    const selectedCountrySimpleLabel = selectedCountryLabel.replace(
      /^(EL |LA )/,
      "",
    );

    const validRawLabels = countries.map((countryItem) =>
      countryItem.label.toUpperCase(),
    );
    const validSimpleLabels = validRawLabels.map((label) =>
      label.replace(/^(EL |LA )/, ""),
    );
    const validAllLabels = [
      ...new Set([...validRawLabels, ...validSimpleLabels]),
    ];

    content = content.replace(articleRelatedRegex, (fullMatch, countryName) => {
      const trimmedCountry = countryName.trim();
      if (!validAllLabels.includes(trimmedCountry)) return fullMatch;
      return trimmedCountry === selectedCountryLabel ||
        trimmedCountry === selectedCountrySimpleLabel
        ? fullMatch
        : "";
    });

    const escapedLabels = validAllLabels.map((label) =>
      label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    const pattern = escapedLabels.join("|");
    const countryBlockRegex = new RegExp(
      `__(${pattern}):__([\\s\\S]*?)__FIN PAIS__`,
      "g",
    );

    content = content.replace(countryBlockRegex, (fullMatch, countryName) =>
      countryName === selectedCountryLabel ||
      countryName === selectedCountrySimpleLabel
        ? fullMatch
        : "",
    );
  }

  const cleanedContent = cleanText(content);

  // Try extracting metadata using a structured block pattern first.
  let metaDataImport = {};
  for (const { regex, keys } of metaDataPatterns) {
    const matchResult = regex.exec(cleanedContent);
    if (matchResult) {
      metaDataImport = keys.reduce((accumulator, key, keyIndex) => {
        accumulator[key] = (matchResult[keyIndex + 1] || "").trim();
        return accumulator;
      }, {});

      const fullBlock = matchResult[0] || "";
      const lines = fullBlock
        .split(/\n+/)
        .map((lineText) => cleanText(lineText))
        .filter(Boolean);

      metaDisplayParts = lines.map((textValue) => ({
        type: "paragraph",
        data: textValue,
      }));

      // Remove the captured block from the main content to prevent duplication.
      content = cleanedContent.replace(fullBlock, "");
      break;
    }
  }

  // Extract redirections block.
  const redirections = [];
  const redirectionsMatch = redirectionsRegex.exec(content);
  if (redirectionsMatch) {
    const rawLines = redirectionsMatch[1].trim().split("\n");
    rawLines.forEach((lineText) => {
      const matchResult = /\[(.*?)\]\((.*?)\)/.exec(lineText);
      if (matchResult) {
        redirections.push({
          text: matchResult[1],
          url: cleanText(matchResult[2]),
        });
      }
    });
    content = content.replace(redirectionsRegex, "");
  }

  // Extract image tag blocks and remove them from the main content.
  let tagMatches = [];
  tagRegex.forEach(({ regex }) => {
    let matchResult;
    while ((matchResult = regex.exec(content)) !== null) {
      tagMatches.push(matchResult);
    }
  });
  tagRegex.forEach(({ regex }) => {
    content = content.replace(regex, "");
  });

  // Build contentParts (paragraphs + images).
  let imageMatch;
  let imageIndex = 0;
  let contentCursor = 0;
  let contentParts = [];

  while (
    (imageMatch = imageRegex.exec(content)) !== null ||
    tagMatches[imageIndex]
  ) {
    let src = "/images/no-image.png";
    let altText = "";
    let title = "";
    let imageName = "";

    if (imageMatch) {
      const [, markdownAlt, markdownSrc] = imageMatch;
      src = markdownSrc;
      altText = markdownAlt;
    }

    if (tagMatches[imageIndex]) {
      const tagMatch = tagMatches[imageIndex];
      const [, tagAlt = "", tagTitle = "", tagName = ""] = tagMatch;
      altText = tagAlt || altText;
      title = tagTitle;
      imageName = tagName;
    }

    const endOfText = imageMatch ? imageMatch.index : content.length;
    const nextStart = imageMatch ? imageRegex.lastIndex : content.length;
    const paragraphs = content.slice(contentCursor, endOfText).split(/\n+/);

    paragraphs.forEach((paragraphText) => {
      const cleaned = cleanText(paragraphText);
      if (cleaned) contentParts.push({ type: "paragraph", data: cleaned });
    });

    contentParts.push({
      type: "image",
      data: {
        src,
        alt: cleanText(altText),
        title: cleanText(title),
        imageName: cleanText(imageName),
      },
    });

    contentCursor = nextStart;
    imageIndex++;
  }

  const remainingParagraphs = content.slice(contentCursor).split(/\n+/);
  remainingParagraphs.forEach((paragraphText) => {
    const cleaned = cleanText(paragraphText);
    if (cleaned) contentParts.push({ type: "paragraph", data: cleaned });
  });

  // If the structured SEO block was not found, fallback to paragraph-based extraction.
  if (Object.keys(metaDataImport).length === 0) {
    const metaDataResult = extractMetaData(contentParts);
    metaDataImport = metaDataResult.extractedMetaData;
    contentParts = metaDataResult.updatedContentParts;
  }

  // Reorder content to ensure consistent output layout.
  contentParts = preorderContent(contentParts);

  // Convert related-article sections and headings into textCard structures.
  contentParts = sectionsToTextCards(contentParts);

  // Convert country product blocks into product textCards with richHtml.
  contentParts = countryProductsCards(contentParts, country);

  // Append captured SEO metadata display block at the end (if present).
  if (metaDisplayParts.length) {
    contentParts = [...contentParts, ...metaDisplayParts];
  }

  // HTML output branch.
  if (selectedFormat === "html") {
    const convertToHTML = (contentParts) => {
      const listItems = [];
      const stripOuterBoldInline = (value) =>
        value.replace(/^__\s*([\s\S]*?)\s*__$/g, "$1");

      const formatInline = (textValue) => {
        // Converts markdown links [text](url) into anchor tags.
        const withLinks = textValue.replace(
          /\[(.*?)\]\((.*?)\)/g,
          '<a href="$2" target="_blank">$1</a>',
        );
        // Converts __bold__ into <strong>.
        const withBold = withLinks.replace(/__(.*?)__/g, "<strong>$1</strong>");
        // Converts *italic* into <em> (single-asterisk only).
        const withItalic = withBold.replace(
          /(^|[^\\])\*(?!\*)(.*?)\*(?!\*)/g,
          "$1<em>$2</em>",
        );
        // Auto-links raw URLs, avoiding existing href attributes.
        const withAutoLinks = withItalic.replace(
          /https?:\/\/[^\s<)]+/g,
          (matchedUrl, offset, fullText) => {
            const prev = fullText.slice(Math.max(0, offset - 6), offset);
            if (/href\s*=\s*["']?$/i.test(prev)) return matchedUrl;
            return `<a href="${matchedUrl}" target="_blank">${matchedUrl}</a>`;
          },
        );
        return withAutoLinks;
      };

      return contentParts
        .map((partItem, partIndex) => {
          if (partItem.type === "textCard") return partItem;

          if (partItem.type === "paragraph") {
            // Group "- " list items into a single <ul>.
            if (
              typeof partItem.data === "string" &&
              partItem.data.startsWith("- ")
            ) {
              const listItemText = partItem.data.replace(/^- (.+)$/, "$1");
              const formatted = formatInline(listItemText);
              listItems.push(`<li>${formatted}</li>`);

              const isLastItem = partIndex === contentParts.length - 1;
              const nextItem = contentParts[partIndex + 1];
              const nextIsList =
                nextItem &&
                nextItem.type === "paragraph" &&
                typeof nextItem.data === "string" &&
                nextItem.data.startsWith("- ");

              if (!nextIsList || isLastItem) {
                const ul = `<ul>${listItems.join("")}</ul>`;
                listItems.length = 0;
                return { type: "paragraph", data: ul };
              }
              return null;
            }

            // Convert markdown headings (#..######) into <h1>..</h1> etc., with optional classes.
            const headerMatch =
              typeof partItem.data === "string" &&
              partItem.data.match(/^(#{1,6})\s*(.+)$/);

            if (headerMatch) {
              const headerLevel = headerMatch[1].length;
              let headerText = stripOuterBoldInline(
                headerMatch[2].trim(),
              ).replace(/__+/g, "");
              const formattedHeader = formatInline(headerText);

              const cls =
                headerLevel === 1
                  ? "page-title"
                  : headerLevel >= 2 && headerLevel <= 6
                    ? "highlight"
                    : "";
              const classAttr = cls ? ` class="${cls}"` : "";

              return {
                type: "paragraph",
                data: `<h${headerLevel}${classAttr}>${formattedHeader}</h${headerLevel}>`,
              };
            }

            // Convert normal text lines into <p> paragraphs.
            const formattedParagraph =
              typeof partItem.data === "string"
                ? formatInline(partItem.data)
                : partItem.data;

            return {
              type: "paragraph",
              data:
                typeof formattedParagraph === "string"
                  ? `<p>${formattedParagraph}</p>`
                  : formattedParagraph,
            };
          }

          if (partItem.type === "image") {
            return { type: "image", data: partItem.data };
          }

          return partItem;
        })
        .filter(Boolean);
    };

    const convertedContent = convertToHTML(contentParts);
    localStorage.setItem("editorContent", JSON.stringify(convertedContent));

    return {
      content: convertedContent,
      metaDataImport,
      schema: {},
      redirections,
    };
  }

  // Merge consecutive list paragraphs in markdown mode.
  const mergeListParagraphs = (contentParts) => {
    const mergedParts = [];
    let listBuffer = [];

    contentParts.forEach((partItem) => {
      if (
        partItem.type === "paragraph" &&
        typeof partItem.data === "string" &&
        partItem.data.startsWith("- ")
      ) {
        listBuffer.push(partItem.data);
      } else {
        if (listBuffer.length) {
          mergedParts.push({ type: "paragraph", data: listBuffer.join("\n") });
          listBuffer = [];
        }
        mergedParts.push(partItem);
      }
    });

    if (listBuffer.length) {
      mergedParts.push({ type: "paragraph", data: listBuffer.join("\n") });
    }

    return mergedParts;
  };

  contentParts = mergeListParagraphs(contentParts);
  localStorage.setItem("editorContent", JSON.stringify(contentParts));

  return {
    content: contentParts,
    metaDataImport,
    schema: {},
    redirections,
  };
};

const ProfessionalSettings = {
  brand: "Professional",
  imagePlaceholder: "/images/no-image.png",
  parseMarkdownContent,
};

export default ProfessionalSettings;
