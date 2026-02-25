import {
  metaDataPatterns,
  tagRegex,
  redirectionsRegex,
  imageRegex,
  schemaRegex,
} from "./NutritionRegex";

function extractMetaData(contentParts) {
  const extractedMetaData = {};
  const tempContentParts = [];
  let isProcessingMetaData = true;

  const updatedContentParts = contentParts.filter((item) => {
    if (item.type === "paragraph") {
      const data = item.data.trim();

      if (isProcessingMetaData) {
        // Keep these Spanish tokens unchanged because they come from the Word document source
        if (data.startsWith("CATEGORÍA:")) {
          extractedMetaData.category = data.replace("CATEGORÍA:", "").trim();
          return false;
        } else if (
          data.startsWith("__PAGE TITLE__") &&
          !extractedMetaData.title
        ) {
          extractedMetaData.title = data.replace("__PAGE TITLE__", "").trim();
          return false;
        } else if (data.startsWith("__META DESCRIPCIÓN__")) {
          extractedMetaData.metaDescription = data
            .replace("__META DESCRIPCIÓN__", "")
            .trim();
          return false;
        } else if (data.startsWith("__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO__")) {
          extractedMetaData.introDescription = data
            .replace("__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO__", "")
            .trim();
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
        } else if (
          /^(MERCADO:|KEYWORD SUGERIDA:|__URL ACTUAL:__|__URL SUGERIDA:__|__SEO:__)/.test(
            data,
          )
        ) {
          // Discard unwanted metadata lines (still part of the Word document export)
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

function processImages(contentParts) {
  const processedContentParts = [];
  let tempImageData = {};
  let isProcessingImage = false;

  contentParts.forEach((item) => {
    if (item.type === "paragraph") {
      const data = item.data.trim();

      // Keep these Spanish tokens unchanged because they come from the Word document source
      if (data.startsWith("__ETIQUETAS DE IMAGEN__")) {
        isProcessingImage = true;
        tempImageData = { src: "/images/no-image.png" };
      } else if (isProcessingImage) {
        if (data.startsWith("__TÍTULO__")) {
          tempImageData.title = data.replace("__TÍTULO__", "").trim();
        } else if (data.startsWith("__ALT TEXT DESCRIPTION__")) {
          tempImageData.alt = data
            .replace("__ALT TEXT DESCRIPTION__", "")
            .trim();
        } else if (data.startsWith("__URL__")) {
          tempImageData.src =
            data.replace("__URL__", "").trim() || "/images/no-image.png";
        } else if (data.startsWith("__FIN DE ETIQUETAS__")) {
          processedContentParts.push({
            type: "image",
            data: { ...tempImageData },
          });
          tempImageData = {};
          isProcessingImage = false;
        }
      } else {
        processedContentParts.push(item);
      }
    } else {
      processedContentParts.push(item);
    }
  });

  return processedContentParts;
}

const cleanText = (text) => {
  return text
    .replace(/\\-/g, "-")
    .replace(/\\\./g, ".")
    .replace(/\\/g, "")
    .replace(/\s*\(\d+\s+caracteres\)/g, "")
    .trim();
};

const parseMarkdownContent = (content, selectedFormat) => {
  // Remove MS Word anchor artifacts and normalize content prefix
  content = content.replace(/<a id="_Hlk\d+"><\/a>/g, "");
  content = content.replace(/\s*__CONTENT:\s*__\s*/, "");

  // 1) Try extracting metadata using configured regex patterns (fast path)
  let metaDataImport = {};
  for (const { regex, keys } of metaDataPatterns) {
    const cleanContent = cleanText(content);
    const match = regex.exec(cleanContent);
    if (match) {
      metaDataImport = keys.reduce((acc, key, index) => {
        acc[key] = (match[index + 1] || "").trim();
        return acc;
      }, {});

      content = cleanContent.replace(match[0], "");
      break;
    }
  }

  // 2) Extract redirections section
  const redirectionsMatch = redirectionsRegex.exec(content);
  const redirections = [];

  if (redirectionsMatch) {
    const rawRedirections = redirectionsMatch[1].trim().split("\n");
    rawRedirections.forEach((line) => {
      const match = /\[(.*?)\]\((.*?)\)/.exec(line);
      if (match) {
        redirections.push({
          text: match[1],
          url: cleanText(match[2]),
        });
      }
    });
    content = content.replace(redirectionsRegex, "");
  }

  // 3) Extract and sanitize JSON-LD schema (if present)
  let schema = "";
  const schemaMatch = schemaRegex.exec(content);
  if (schemaMatch) {
    schema = schemaMatch[1].trim();
    content = content.replace(schemaRegex, "");

    // Strip script wrapper and normalize escaped content
    schema = schema
      .replace(/<script\s+type=["']application\/ld\+json["'][^>]*>/i, "")
      .replace(/<\/script>/i, "")
      .replace(/\\/g, "")
      .replace(/\\(["\\/bfnrt])/g, "$1")
      .replace(/\n/g, "")
      .trim();

    schema = schema.replace(/\s+/g, " ").trim();

    try {
      schema = JSON.parse(schema);

      // Keep only the first schema image (if it's an array)
      if (
        schema.image &&
        Array.isArray(schema.image) &&
        schema.image.length > 0
      ) {
        schema.image = [schema.image[0]];
      }
    } catch (e) {
      console.error("Error parsing schema JSON:", e);
    }
  }

  // 4) Collect tag matches (images metadata or other configured tags)
  let tagMatches = [];
  tagRegex.forEach(({ regex }) => {
    let tagMatch;
    while ((tagMatch = regex.exec(content)) !== null) {
      tagMatch = tagMatch.map((match, index) =>
        index === 0 ? match : match.replace(/\\-/g, "-").replace(/\\\./g, "."),
      );
      tagMatches.push(tagMatch);
    }
  });

  // Remove tag sections from the content once captured
  tagRegex.forEach(({ regex }) => {
    content = content.replace(regex, "");
  });

  // 5) Walk content and build contentParts (paragraphs + image objects)
  let imageIndex = 0;
  let contentCursor = 0;
  let contentParts = [];
  const images = [];
  let match;

  while (
    (match = imageRegex.exec(content)) !== null ||
    tagMatches[imageIndex]
  ) {
    let src = "";
    let altText = "";

    if (match) {
      const [, base64AltText, base64Src] = match;
      src = base64Src;
      altText = base64AltText;
    } else if (tagMatches[imageIndex]) {
      const [, , tagAltText, urlActual] = tagMatches[imageIndex];
      src = urlActual;
      altText = tagAltText;
    }

    const endOfPreviousPart = match ? match.index : content.length;
    const startOfNextPart = match ? imageRegex.lastIndex : content.length;

    // Convert the text chunk before the image/tag into paragraph parts
    const paragraphs = content
      .slice(contentCursor, endOfPreviousPart)
      .trim()
      .split(/\n+/);

    paragraphs.forEach((para) => {
      const cleanedText = cleanText(para);
      if (cleanedText && cleanedText !== "__" && cleanedText !== "##") {
        contentParts.push({ type: "paragraph", data: cleanedText });
      }
    });

    const tags = tagMatches[imageIndex] || [];
    const [, tagTitle = "", tagAltText = "", tagUrl = ""] = tags;

    images.push({
      src: (src || "").trim(),
      alt: cleanText(tagAltText ? tagAltText.trim() : (altText || "").trim()),
      title: cleanText(tagTitle.trim()),
      imageName: cleanText(tagUrl.trim()),
    });

    contentParts.push({ type: "image", data: images[images.length - 1] });
    contentCursor = startOfNextPart;
    imageIndex++;
  }

  // 6) Push any remaining text after the last match
  const remainingText = content.slice(contentCursor).trim().split(/\n+/);
  remainingText.forEach((text) => {
    const cleanedText = cleanText(text);
    if (cleanedText && cleanedText !== "__" && cleanedText !== "##") {
      contentParts.push({ type: "paragraph", data: cleanedText });
    }
  });

  // 7) If metadata wasn't extracted via regex patterns, use the fallback metadata extractor
  if (Object.keys(metaDataImport).length === 0) {
    const metaDataResult = extractMetaData(contentParts);
    metaDataImport = metaDataResult.extractedMetaData;
    contentParts = metaDataResult.updatedContentParts;
  }

  // 8) Convert image "labels" blocks into image parts (if present)
  contentParts = processImages(contentParts);

  // 9) Output format: HTML or non-HTML (raw parts)
  if (selectedFormat === "html") {
    const convertToHTML = (contentParts) => {
      const listItems = [];

      return contentParts
        .map((part, index) => {
          if (part.type === "paragraph") {
            // Handle bullet lists ("- item")
            if (part.data.startsWith("- ")) {
              const listItemText = part.data.replace(/^- (.+)$/, "$1");

              // Inline formatting replacements (links, bold, italic)
              const hyperlinkFormatted = listItemText.replace(
                /\[(.*?)\]\((.*?)\)/g,
                '<a href="$2" target="_blank">$1</a>',
              );

              const boldFormatted = hyperlinkFormatted.replace(
                /__(.*?)__/g,
                "<strong>$1</strong>",
              );

              const italicFormatted = boldFormatted.replace(
                /(^|[^\\])\*(?!\*)(.*?)\*(?!\*)/g,
                "$1<em>$2</em>",
              );

              listItems.push(`<li>${italicFormatted}</li>`);

              const nextItem = contentParts[index + 1];
              const nextIsList = nextItem && nextItem.data?.startsWith("- ");

              if (!nextIsList) {
                const ul = `<ul>${listItems.join("")}</ul>`;
                listItems.length = 0;
                return {
                  type: "paragraph",
                  data: ul,
                };
              }
              return null;
            }

            // Handle headers in the form: __H1: Title__ / __H2: Title__ / __H3: Title__
            const headerMatch = part.data.match(/^__H([1-3]):\s*(.+)__$/);
            if (headerMatch) {
              const level = headerMatch[1];
              const headerText = headerMatch[2];
              return {
                type: "paragraph",
                data: `<h${level}>${headerText}</h${level}>`,
              };
            }

            // Standard inline formatting replacements
            const hyperlinkFormatted = part.data.replace(
              /\[(.*?)\]\((.*?)\)/g,
              '<a href="$2" target="_blank">$1</a>',
            );

            const boldFormatted = hyperlinkFormatted.replace(
              /__(.*?)__/g,
              "<strong>$1</strong>",
            );

            const italicFormatted = boldFormatted.replace(
              /(^|[^\\])\*(?!\*)(.*?)\*(?!\*)/g,
              "$1<em>$2</em>",
            );

            return {
              type: "paragraph",
              data: `<p>${italicFormatted}</p>`,
            };
          } else if (part.type === "image") {
            return {
              type: "image",
              data: part.data,
            };
          }
          return part;
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
  } else {
    const mergeListParagraphs = (parts) => {
      const merged = [];
      let listBuffer = [];

      parts.forEach((part) => {
        if (part.type === "paragraph" && part.data.startsWith("- ")) {
          listBuffer.push(part.data);
        } else {
          if (listBuffer.length) {
            merged.push({
              type: "paragraph",
              data: listBuffer.join("\n"),
            });
            listBuffer = [];
          }
          merged.push(part);
        }
      });

      if (listBuffer.length) {
        merged.push({
          type: "paragraph",
          data: listBuffer.join("\n"),
        });
      }

      return merged;
    };

    contentParts = mergeListParagraphs(contentParts);

    localStorage.setItem("editorContent", JSON.stringify(contentParts));

    return {
      content: contentParts,
      metaDataImport,
      schema: {},
      redirections,
    };
  }
};

const NutritionSettings = {
  brand: "Nutrition",
  cleanText: true,
  imagePlaceholder: "/images/no-image.png",
  parseMarkdownContent,
};

export default NutritionSettings;