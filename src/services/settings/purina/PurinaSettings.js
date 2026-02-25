import {
  metaDataPatterns,
  tagRegex,
  redirectionsRegex,
  schemaRegex,
  imageRegex,
  extractMetaData,
  processImages,
  cleanText,
  stripEtiquetaP,
  sanitizeHeadingBold,
  normalizePurinaHeading,
  sanitizeBase64Alt,
  isIgnorableMergeGap,
} from "./PurinaRegex";

const parseMarkdownContent = (content, selectedFormat) => {
  content = String(content || "");
  content = content.replace(/<a\s+id="_(?:Hlk\d+|Int_[^"]+)"><\/a>/gi, "");
  content = content.replace(/\s*__CONTENT:\s*__\s*/, "");

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

  const redirectionsMatch = redirectionsRegex.exec(content);
  const redirections = [];
  if (redirectionsMatch) {
    const rawRedirections = redirectionsMatch[1].trim().split("\n");
    rawRedirections.forEach((line) => {
      const linkMatch = /\[(.*?)\]\((.*?)\)/.exec(line);
      if (linkMatch) {
        redirections.push({ text: linkMatch[1], url: cleanText(linkMatch[2]) });
      }
    });
    content = content.replace(redirectionsRegex, "");
  }

  let schema = "";
  const schemaMatch = schemaRegex.exec(content);
  if (schemaMatch) {
    schema = schemaMatch[1].trim();
    content = content.replace(schemaRegex, "");
    schema = schema
      .replace("*Recomendación:*", "")
      .replace(/<script[^>]*>/i, "")
      .replace(/<\/script>/i, "")
      .replace(/\\/g, "")
      .replace(/\\(["\\/bfnrt])/g, "$1")
      .replace(/\n/g, "")
      .trim();

    schema = schema.replace(/\s+/g, " ").trim();

    try {
      schema = JSON.parse(schema);
      if (
        schema.image &&
        Array.isArray(schema.image) &&
        schema.image.length > 0
      ) {
        schema.image = [schema.image[0]];
      }
    } catch (error) {
      console.error("Error parsing schema JSON:", error);
    }
  }

  const imgMatches = [];
  imageRegex.lastIndex = 0;
  let imageMatch;
  while ((imageMatch = imageRegex.exec(content)) !== null) {
    imgMatches.push({
      type: "img",
      start: imageMatch.index,
      end: imageRegex.lastIndex,
      base64Alt: sanitizeBase64Alt(cleanText(imageMatch[1] || "")),
      base64Src: (imageMatch[2] || "").trim(),
    });
  }

  const tagBlocks = [];
  tagRegex.forEach(({ regex, keys }) => {
    regex.lastIndex = 0;
    let tagMatch;
    while ((tagMatch = regex.exec(content)) !== null) {
      const groups = {};
      keys.forEach((key, idx) => {
        groups[key] = cleanText((tagMatch[idx + 1] || "").trim());
      });

      const urlSuggested =
        groups.urlSuggested ||
        (keys[0] === "urlActual" ? groups.urlActual : "");
      const urlActual =
        groups.urlActual ||
        (keys[0] === "urlActual" ? groups.urlSuggested : "");

      tagBlocks.push({
        type: "tag",
        start: tagMatch.index,
        end: tagMatch.index + tagMatch[0].length,
        urlSuggested: urlSuggested || groups.urlSuggested || "",
        urlActual: urlActual || groups.urlActual || "",
        altText: groups.altText || "",
        title: groups.title || "",
        imageName: groups.imageName || "",
      });
    }
  });

  const events = [...imgMatches, ...tagBlocks].sort(
    (a, b) => a.start - b.start,
  );

  let cursor = 0;
  let contentParts = [];
  const consumedTagIdx = new Set();

  const pushTextBetween = (from, to) => {
    const chunk = content.slice(from, to);
    const paragraphs = chunk.trim().split(/\n+/);

    paragraphs.forEach((paragraphText) => {
      let cleanedText = cleanText(paragraphText);

      const maybeHeading = normalizePurinaHeading(cleanedText);
      if (maybeHeading) {
        contentParts.push({ type: "paragraph", data: maybeHeading });
        return;
      }

      cleanedText = sanitizeHeadingBold(cleanedText);

      const isEmptyHeading = (value) =>
        /^#{1,6}\s*$/.test(String(value || "").trim());
      if (cleanedText && cleanedText !== "__" && !isEmptyHeading(cleanedText)) {
        contentParts.push({ type: "paragraph", data: cleanedText });
      }
    });
  };

  for (let i = 0; i < events.length; i++) {
    const eventItem = events[i];
    if (eventItem.type === "tag" && consumedTagIdx.has(i)) continue;
    if (cursor < eventItem.start) pushTextBetween(cursor, eventItem.start);

    if (eventItem.type === "img") {
      const nextEvent = events[i + 1];
      let mergedTag = null;

      if (nextEvent && nextEvent.type === "tag") {
        const rawGap = content.slice(eventItem.end, nextEvent.start);
        if (isIgnorableMergeGap(rawGap)) {
          mergedTag = nextEvent;
          consumedTagIdx.add(i + 1);
          cursor = nextEvent.end;
        }
      }

      if (!mergedTag) cursor = eventItem.end;

      const altRaw = mergedTag?.altText
        ? mergedTag.altText
        : eventItem.base64Alt;
      const alt = sanitizeBase64Alt(altRaw);

      contentParts.push({
        type: "image",
        data: {
          src: eventItem.base64Src,
          alt,
          title: mergedTag?.title || "",
          imageName: mergedTag?.imageName || "",
          urlActual: mergedTag?.urlActual || "",
          urlSuggested: mergedTag?.urlSuggested || "",
        },
      });
    } else {
      const previousPart = contentParts[contentParts.length - 1];
      const previousIsRealImg =
        previousPart?.type === "image" &&
        typeof previousPart.data?.src === "string" &&
        previousPart.data.src.startsWith("data:image/");

      if (previousIsRealImg) {
        previousPart.data.alt =
          previousPart.data.alt || eventItem.altText || "";
        previousPart.data.title =
          previousPart.data.title || eventItem.title || "";
        previousPart.data.imageName =
          previousPart.data.imageName || eventItem.imageName || "";
        previousPart.data.urlActual =
          previousPart.data.urlActual || eventItem.urlActual || "";
        previousPart.data.urlSuggested =
          previousPart.data.urlSuggested || eventItem.urlSuggested || "";
      } else {
        contentParts.push({
          type: "image",
          data: {
            src: "/images/no-image.png",
            alt: eventItem.altText || "",
            title: eventItem.title || "",
            imageName: eventItem.imageName || "",
            urlActual: eventItem.urlActual || "",
            urlSuggested: eventItem.urlSuggested || "",
          },
        });
      }

      cursor = eventItem.end;
    }
  }

  if (cursor < content.length) pushTextBetween(cursor, content.length);

  if (Object.keys(metaDataImport).length === 0) {
    const metaDataResult = extractMetaData(contentParts);
    metaDataImport = metaDataResult.extractedMetaData;
    contentParts = metaDataResult.updatedContentParts;
  }

  contentParts = processImages(contentParts);
  contentParts = contentParts.map((part) => {
    if (part.type === "paragraph") {
      return { ...part, data: sanitizeHeadingBold(part.data) };
    }
    return part;
  });

  const ensureH1First = (parts) => {
    const headingIndex = parts.findIndex(
      (part) =>
        part?.type === "paragraph" &&
        typeof part.data === "string" &&
        /^#\s+/.test(part.data),
    );

    if (headingIndex <= 0) return parts;

    const firstHeading = parts[headingIndex];
    return [
      firstHeading,
      ...parts.slice(0, headingIndex),
      ...parts.slice(headingIndex + 1),
    ];
  };

  const renumberOrderedListsAcrossImages = (parts) => {
    let currentNumber = null;
    let inList = false;

    const isHeading = (part) =>
      part?.type === "paragraph" &&
      typeof part.data === "string" &&
      /^#{1,6}\s+/.test(part.data);

    const isOrderedListItem = (part) =>
      part?.type === "paragraph" &&
      typeof part.data === "string" &&
      /^\s*\d{1,3}\s*[\.\)]\s+/.test(part.data);

    const extractNumber = (value) => {
      const numberMatch = String(value).match(/^\s*(\d{1,3})\s*[\.\)]\s+/);
      return numberMatch ? Number(numberMatch[1]) : null;
    };

    const replaceNumber = (value, nextNumber) =>
      String(value).replace(/^\s*\d{1,3}\s*[\.\)]\s+/, `${nextNumber}. `);

    const reset = () => {
      currentNumber = null;
      inList = false;
    };

    return parts.map((part) => {
      if (isHeading(part)) {
        reset();
        return part;
      }
      if (part?.type === "image") return part;
      if (!isOrderedListItem(part)) {
        reset();
        return part;
      }

      const originalNumber = extractNumber(part.data) ?? 1;

      if (!inList) {
        currentNumber = originalNumber;
        inList = true;
        return { ...part, data: replaceNumber(part.data, currentNumber) };
      }

      currentNumber = (currentNumber ?? originalNumber) + 1;
      return { ...part, data: replaceNumber(part.data, currentNumber) };
    });
  };

  const stripEtiquetaPInAllParagraphs = (parts) =>
    parts.map((part) => {
      if (part?.type !== "paragraph" || typeof part.data !== "string")
        return part;
      return { ...part, data: stripEtiquetaP(part.data) };
    });

  contentParts = ensureH1First(contentParts);
  contentParts = renumberOrderedListsAcrossImages(contentParts);
  contentParts = stripEtiquetaPInAllParagraphs(contentParts);

  const finalPostClean = (parts) => {
    const isEmptyHeading = (value) =>
      /^#{1,6}\s*$/.test(String(value || "").trim());

    const stripEtiquetaPOnly = (value) => {
      let stringValue = String(value || "").trim();

      stringValue = stringValue.replace(/^__\s*Etiqueta\s*P\s*:\s*/i, "__");
      stringValue = stringValue.replace(/^Etiqueta\s*P\s*:\s*/i, "");

      if (/^__/.test(stringValue)) {
        stringValue = stringValue.replace(/^__\s*__/, "__");
      }

      return stringValue.trim();
    };

    return parts
      .map((part) => {
        if (part?.type !== "paragraph" || typeof part.data !== "string")
          return part;

        const paragraphValue = stripEtiquetaPOnly(part.data);

        if (isEmptyHeading(paragraphValue)) return null;

        return { ...part, data: paragraphValue };
      })
      .filter(Boolean);
  };

  contentParts = finalPostClean(contentParts);

  if (selectedFormat === "html") {
    const convertToHTML = (parts) => {
      const listItems = [];

      return parts
        .map((part, index) => {
          if (part.type === "paragraph") {
            const paragraphValue = String(part.data ?? "");

            // Convert list items (- ...) into <ul><li>...</li></ul>
            if (paragraphValue.startsWith("- ")) {
              const listItemText = paragraphValue.replace(/^- (.+)$/, "$1");

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

              const isLastItem = index === parts.length - 1;
              const nextItem = parts[index + 1];

              const nextIsList =
                nextItem?.type === "paragraph" &&
                typeof nextItem.data === "string" &&
                nextItem.data.startsWith("- ");

              if (!nextIsList || isLastItem) {
                const ul = `<ul>${listItems.join("")}</ul>`;
                listItems.length = 0;
                return { type: "paragraph", data: ul };
              }

              return null;
            }

            // Convert headings (# .. ###### ..) into <h1>..</h1> etc.
            const headerMatch = paragraphValue.match(/^(#{1,6})\s*(.+)$/);
            if (headerMatch) {
              const headerLevel = headerMatch[1].length;
              const headerText = headerMatch[2];
              return {
                type: "paragraph",
                data: `<h${headerLevel}>${headerText}</h${headerLevel}>`,
              };
            }

            // Convert inline markdown links/bold/italic into HTML inside <p>
            const hyperlinkFormatted = paragraphValue.replace(
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

            return { type: "paragraph", data: `<p>${italicFormatted}</p>` };
          }

          if (part.type === "image") {
            return { type: "image", data: part.data };
          }

          return part;
        })
        .filter(Boolean);
    };

    const convertedContent = convertToHTML(contentParts);
    localStorage.setItem("editorContent", JSON.stringify(convertedContent));
    return { content: convertedContent, metaDataImport, schema, redirections };
  }

  const mergeListParagraphs = (parts) => {
    const merged = [];
    let buffer = [];
    let mode = null;

    const rtrim = (value) => String(value || "").replace(/[ \t]+$/g, "");
    const isUL = (value) => /^\s*(?:-|\*|•|–|—)\s+/.test(value);
    const isOL = (value) => /^\s*\d{1,3}(?:\.(?:-)?|\))\s+/.test(value);

    const flush = () => {
      if (buffer.length) {
        merged.push({ type: "paragraph", data: buffer.map(rtrim).join("\n") });
        buffer = [];
        mode = null;
      }
    };

    for (const part of parts) {
      if (part.type === "paragraph") {
        const value = part.data;

        if (isUL(value)) {
          if (mode && mode !== "ul") flush();
          mode = "ul";
          buffer.push(rtrim(value));
          continue;
        }

        if (isOL(value)) {
          if (mode && mode !== "ol") flush();
          mode = "ol";
          buffer.push(rtrim(value));
          continue;
        }
      }

      flush();
      merged.push(part);
    }

    flush();
    return merged;
  };

  contentParts = mergeListParagraphs(contentParts);
  localStorage.setItem("editorContent", JSON.stringify(contentParts));
  return { content: contentParts, metaDataImport, schema, redirections };
};

const PurinaSettings = {
  brand: "Purina",
  imagePlaceholder: "/images/no-image.png",
  parseMarkdownContent,
};

export default PurinaSettings;
