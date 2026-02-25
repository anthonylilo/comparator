import { marked } from "marked";
import DOMPurify from "dompurify";
import DiffMatchPatch from "diff-match-patch";
import { parseDocument, DomHandler, DomUtils } from "htmlparser2";

const markdownToHTML = (markdown) => {
  const filteredMarkdown = String(markdown || "").replace(
    /^.+\.jpg\nTitle: .+\nAlt Text: .+\n/gm,
    "",
  );
  const html = filteredMarkdown.replace(/__(.*?)__/g, "<strong>$1</strong>");
  return marked(html);
};

const cleanHTML = (html) => {
  let sanitizedHTML = DOMPurify.sanitize(
    String(html || "")
      .trim()
      .replace(/>\s+</g, "><"),
    {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "a",
        "p",
        "li",
        "ul",
        "ol",
        "strong",
        "em",
        "br",
        "span",
      ],
    },
  );

  sanitizedHTML = sanitizedHTML.replace(
    /<strong>Title: <\/strong>.+?<strong>Alt Text: <\/strong>.+?/g,
    "",
  );
  sanitizedHTML = sanitizedHTML.replace(
    /\d+\.\d+ KB\d+ x \d+.+?\.webp\?itok=\w+/g,
    "",
  );
  sanitizedHTML = sanitizedHTML.replace(/^[^<]*(?=<p>)/gm, "");
  sanitizedHTML = sanitizedHTML.replace(/(?<=<\/h\d>)[^<]*/gm, "");
  sanitizedHTML = sanitizedHTML.replace(/^\s*[\r\n]/gm, "");
  sanitizedHTML = sanitizedHTML.replace(/ id="[^"]*"/g, "");
  sanitizedHTML = sanitizedHTML.replace(/<\/ul>\s*<ul>/g, "");
  sanitizedHTML = sanitizedHTML.replace(/<li>\s*<\/li>/g, "");
  sanitizedHTML = sanitizedHTML.replace(
    /<li>\s*(.*?)\s*<\/li>/g,
    "<li>$1</li>",
  );
  return sanitizedHTML;
};

const cleanHTMLCompare = (html) => {
  let sanitizedHTML = DOMPurify.sanitize(
    String(html || "")
      .trim()
      .replace(/>\s+</g, "><"),
    {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "a",
        "p",
        "li",
        "ul",
        "ol",
        "strong",
        "em",
        "br",
        "span",
      ],
    },
  );

  sanitizedHTML = sanitizedHTML.replace(
    /<strong>Title: <\/strong>.+?<strong>Alt Text: <\/strong>.+?/g,
    "",
  );
  sanitizedHTML = sanitizedHTML.replace(
    /\d+\.\d+ KB\d+ x \d+.+?\.webp\?itok=\w+/g,
    "",
  );
  sanitizedHTML = sanitizedHTML.replace(/ id="[^"]*"/g, "");
  sanitizedHTML = sanitizedHTML.replace(/ rel="noreferrer"/g, "");
  sanitizedHTML = sanitizedHTML.replace(/(?:\r\n|\r|\n){2,}/g, "</p><p>");
  sanitizedHTML = sanitizedHTML.replace(/<\/p>(<h[1-5]>)/g, "$1");
  sanitizedHTML = sanitizedHTML.replace(/(<\/h[1-5]>)(?!<p>|<\/div>)/g, "$1");
  sanitizedHTML = sanitizedHTML.replace(/<p>\s*(<h[1-5]>)/g, "$1");
  sanitizedHTML = sanitizedHTML.replace(/(<\/h[1-5]>)\s*<\/p>/g, "$1");
  sanitizedHTML = sanitizedHTML.replace(
    /^(?!<h\d|<a|<p|<li|<ul|<strong|<img).+$/gm,
    "<p>$&</p>",
  );
  sanitizedHTML = sanitizedHTML.replace(/<p>\s*<\/p>/g, "");
  return sanitizedHTML;
};

const normalizeHTML = (html) => {
  const domHandler = new DomHandler();
  const domDocument = parseDocument(String(html || ""), domHandler);
  return DomUtils.getOuterHTML(domDocument, {
    xmlMode: false,
    decodeEntities: true,
  });
};

const processArray = (arraySaved) => {
  const groupedContent = [];
  let currentParagraph = "";
  let isCollectingList = false;
  let listItemsHTML = [];
  let precedingParagraph = null;

  (arraySaved || []).forEach((item, itemIndex) => {
    const itemData = item?.data ?? item?.content ?? "";

    if (item?.type === "paragraph" && String(itemData).trim().startsWith("-")) {
      isCollectingList = true;
      const rawListItem = String(itemData).trim().replace(/^-\s*/, "");
      const listItemHTML = markdownToHTML(rawListItem).replace(
        /<p>|<\/p>/g,
        "",
      );
      listItemsHTML.push(`<li>${listItemHTML}</li>`);
    } else if (isCollectingList) {
      if (precedingParagraph) {
        groupedContent.push({
          type: "html",
          data: `<p>${markdownToHTML(precedingParagraph)}</p>`,
        });
        precedingParagraph = null;
      }

      groupedContent.push({
        type: "html",
        data: `<ul>${listItemsHTML.join("")}</ul>`,
      });

      isCollectingList = false;
      listItemsHTML = [];
    }

    if (!isCollectingList) {
      if (item?.type === "html") {
        currentParagraph = itemData;
      } else if (item?.type === "paragraph") {
        const paragraphText = String(itemData).trim();

        if (paragraphText.startsWith("-")) {
          isCollectingList = true;
          const rawListItem = paragraphText.replace(/^-\s*/, "");
          listItemsHTML.push(`<li>${markdownToHTML(rawListItem)}</li>`);
        } else if (currentParagraph !== "") {
          groupedContent.push({
            type: currentParagraph.includes("<") ? "html" : "paragraph",
            data: currentParagraph,
          });
          currentParagraph = markdownToHTML(itemData);
        } else {
          groupedContent.push({
            type: "html",
            data: `${markdownToHTML(itemData)}`,
          });
          currentParagraph = "";
        }
      } else if (item?.type === "image") {
        if (currentParagraph !== "") {
          groupedContent.push({
            type: currentParagraph.includes("<") ? "html" : "paragraph",
            data: currentParagraph,
          });
          currentParagraph = "";
        }
      }
    }

    const isLastItem = itemIndex === (arraySaved || []).length - 1;
    if (isLastItem && isCollectingList) {
      if (precedingParagraph) {
        groupedContent.push({
          type: "html",
          data: `<p>${markdownToHTML(precedingParagraph)}</p>`,
        });
      }

      groupedContent.push({
        type: "html",
        data: `<ul>${listItemsHTML.join("")}</ul>`,
      });
    }
  });

  if (currentParagraph !== "") {
    groupedContent.push({
      type: currentParagraph.includes("<") ? "html" : "paragraph",
      data: currentParagraph,
    });
  }

  return groupedContent;
};

const normalizeString = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeImageItem = (raw) => {
  const imageObject =
    raw?.data && typeof raw.data === "object" ? raw.data : raw;

  return {
    src: normalizeString(imageObject?.src),
    alt: normalizeString(imageObject?.alt),
    title: normalizeString(imageObject?.title),
    imageName: normalizeString(imageObject?.imageName),
    urlActual: normalizeString(imageObject?.urlActual),
    urlSuggested: normalizeString(imageObject?.urlSuggested),
  };
};

const extractImagesInOrder = (contentArray) => {
  return (contentArray || [])
    .filter((contentItem) => contentItem?.type === "image")
    .map((contentItem) => normalizeImageItem(contentItem));
};

const areEqualField = (leftValue, rightValue) =>
  normalizeString(leftValue) === normalizeString(rightValue);

const compareImagesByPosition = (editorImages, siteImages) => {
  const maxLength = Math.max(editorImages.length, siteImages.length);
  const rows = [];

  for (let imageIndex = 0; imageIndex < maxLength; imageIndex++) {
    const editorImage = editorImages[imageIndex] || null;
    const siteImage = siteImages[imageIndex] || null;

    const status = !editorImage
      ? "MISSING_IN_EDITOR"
      : !siteImage
        ? "MISSING_IN_SITE"
        : areEqualField(editorImage.imageName, siteImage.imageName) &&
            areEqualField(editorImage.alt, siteImage.alt) &&
            areEqualField(editorImage.title, siteImage.title)
          ? "MATCH"
          : "DIFF";

    rows.push({
      index: imageIndex + 1,
      status,
      editor: editorImage,
      site: siteImage,
      checks: {
        imageName:
          editorImage && siteImage
            ? areEqualField(editorImage.imageName, siteImage.imageName)
            : null,
        alt:
          editorImage && siteImage
            ? areEqualField(editorImage.alt, siteImage.alt)
            : null,
        title:
          editorImage && siteImage
            ? areEqualField(editorImage.title, siteImage.title)
            : null,
      },
    });
  }

  const hasDiff = rows.some((row) => row.status !== "MATCH");
  return { hasDiff, rows };
};

const createBadgeHTML = (text, kind) => {
  const styleMap = {
    ok: "background:#d4fcbc;border-left:3px solid #2e7d32;color:#1b5e20;",
    warn: "background:#fff3cd;border-left:3px solid #b26a00;color:#6a4b00;",
    bad: "background:#ffbcbc;border-left:3px solid #e44040;color:#7a1c1c;",
    neutral: "background:#e9ecef;border-left:3px solid #6c757d;color:#343a40;",
  };

  const badgeStyle = styleMap[kind] || styleMap.neutral;
  return `<span style="display:inline-block;padding:2px 8px;${badgeStyle}border-radius:6px;font-weight:600;font-size:12px;">${text}</span>`;
};

const renderImageComparisonTable = ({ hasDiff, rows }) => {
  const headerHTML = hasDiff
    ? `${createBadgeHTML("IMAGES: DIFFERENCES FOUND", "bad")}`
    : `${createBadgeHTML("IMAGES: OK", "ok")}`;

  const sanitizeCellText = (value) => DOMPurify.sanitize(String(value ?? ""));

  const createCheckCellHTML = (label, isOk) => {
    if (isOk === null) return createBadgeHTML(label, "neutral");
    return isOk ? createBadgeHTML(label, "ok") : createBadgeHTML(label, "bad");
  };

  const rowsHTML = rows
    .map((row) => {
      const statusBadgeHTML =
        row.status === "MATCH"
          ? createBadgeHTML("MATCH", "ok")
          : row.status === "DIFF"
            ? createBadgeHTML("DIFF", "bad")
            : row.status === "MISSING_IN_EDITOR"
              ? createBadgeHTML("MISSING IN EDITOR", "warn")
              : createBadgeHTML("MISSING IN SITE", "warn");

      return `
        <tr>
          <td style="white-space:nowrap;">${row.index}</td>
          <td>${statusBadgeHTML}</td>

          <td>
            <div><strong>Name:</strong> ${sanitizeCellText(row.editor?.imageName || "-")}</div>
            <div><strong>Alt:</strong> ${sanitizeCellText(row.editor?.alt || "-")}</div>
            <div><strong>Title:</strong> ${sanitizeCellText(row.editor?.title || "-")}</div>
          </td>

          <td>
            <div><strong>Name:</strong> ${sanitizeCellText(row.site?.imageName || "-")}</div>
            <div><strong>Alt:</strong> ${sanitizeCellText(row.site?.alt || "-")}</div>
            <div><strong>Title:</strong> ${sanitizeCellText(row.site?.title || "-")}</div>
          </td>

          <td style="white-space:nowrap;">
            <div>${createCheckCellHTML("Name", row.checks.imageName)}</div>
            <div>${createCheckCellHTML("Alt", row.checks.alt)}</div>
            <div>${createCheckCellHTML("Title", row.checks.title)}</div>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="margin-top:16px;">
      <h4 style="margin:0 0 8px 0;">Image Comparison</h4>
      <div style="margin-bottom:8px;">${headerHTML}</div>
      <div style="overflow:auto;border:1px solid rgba(0,0,0,.12);border-radius:10px;">
        <table class="table table-hover" style="margin:0;min-width:900px;">
          <thead>
            <tr>
              <th>#</th>
              <th>Status</th>
              <th>Editor (transformed)</th>
              <th>Site (crawler)</th>
              <th>Checks</th>
            </tr>
          </thead>
          <tbody>${rowsHTML}</tbody>
        </table>
      </div>
    </div>
  `;
};

const applyDiffParentClasses = (rootId) => {
  const rootElement = document.getElementById(rootId);
  if (!rootElement) return;

  rootElement.querySelectorAll("p, li").forEach((nodeElement) => {
    if (nodeElement.querySelector(".highlight-added"))
      nodeElement.classList.add("diff-block-added");
    if (nodeElement.querySelector(".highlight-removed"))
      nodeElement.classList.add("diff-block-removed");
  });
};

const Equals = async (editorContent, comparatorContent) => {
  const processedEditorContent = processArray(editorContent);
  const processedComparatorContent = processArray(comparatorContent);

  const editorHTMLBlocks = processedEditorContent.map((contentItem) => {
    if (contentItem.type === "paragraph")
      return markdownToHTML(contentItem.data);
    return contentItem.data;
  });

  const cleanedEditorHTML = editorHTMLBlocks.map((htmlBlock) =>
    cleanHTML(htmlBlock),
  );
  const cleanedComparatorHTML = processedComparatorContent.map(
    (contentItem) => {
      if (contentItem.type === "html")
        return cleanHTMLCompare(contentItem.data);
      return contentItem.data;
    },
  );

  const normalizedEditorHTML = cleanedEditorHTML.map((htmlBlock) =>
    normalizeHTML(htmlBlock),
  );
  const normalizedComparatorHTML = cleanedComparatorHTML.map((htmlBlock) =>
    normalizeHTML(htmlBlock),
  );

  const editorString = normalizedEditorHTML.join("");

  let comparatorH1HTML = "";
  const comparatorRootElement = document.getElementById("comparator");
  if (comparatorRootElement) {
    const titleElement = comparatorRootElement.querySelector("h1");
    if (titleElement)
      comparatorH1HTML = `<h1>${titleElement.textContent || ""}</h1>`;
  }

  const comparatorString =
    normalizeHTML(comparatorH1HTML) + normalizedComparatorHTML.join("");

  const tagRegex = /(<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>)/g;
  const privateUseAreaStart = 0xe000;

  const buildTagMaps = (htmlA, htmlB) => {
    const allTags = new Set();

    const collectTags = (html) => {
      const matches = String(html || "").match(tagRegex);
      if (matches) matches.forEach((tag) => allTags.add(tag));
    };

    collectTags(htmlA);
    collectTags(htmlB);

    const encodeMap = {};
    const decodeMap = {};
    let currentCodePoint = privateUseAreaStart;

    for (const tag of allTags) {
      const tokenChar = String.fromCharCode(currentCodePoint);
      currentCodePoint += 1;
      encodeMap[tag] = tokenChar;
      decodeMap[tokenChar] = tag;
    }

    return { encodeMap, decodeMap };
  };

  const encodeHTML = (html, encodeMap) =>
    String(html || "").replace(tagRegex, (tag) => encodeMap[tag] || tag);

  const decodeRun = (run, decodeMap) =>
    String(run || "").replace(/[\uE000-\uF8FF]/g, (ch) => decodeMap[ch] || ch);

  const splitRunsByPUA = (encodedText) => {
    const runs = [];
    let buffer = "";
    let isTagMode = null;

    const isPUA = (character) => character >= "\uE000" && character <= "\uF8FF";

    for (
      let charIndex = 0;
      charIndex < String(encodedText || "").length;
      charIndex++
    ) {
      const currentChar = encodedText[charIndex];
      const currentCharIsPUA = isPUA(currentChar);

      if (isTagMode === null) {
        isTagMode = currentCharIsPUA;
        buffer = currentChar;
      } else if (isTagMode === currentCharIsPUA) {
        buffer += currentChar;
      } else {
        runs.push({ isTag: isTagMode, text: buffer });
        buffer = currentChar;
        isTagMode = currentCharIsPUA;
      }
    }

    if (buffer) runs.push({ isTag: isTagMode, text: buffer });
    return runs;
  };

  const { encodeMap, decodeMap } = buildTagMaps(editorString, comparatorString);
  const encodedEditorString = encodeHTML(editorString, encodeMap);
  const encodedComparatorString = encodeHTML(comparatorString, encodeMap);

  const diffTool = new DiffMatchPatch();
  const diffs = diffTool.diff_main(
    encodedEditorString,
    encodedComparatorString,
  );
  diffTool.diff_cleanupSemantic(diffs);

  const renderChunk = (op, chunk, target) => {
    const runs = splitRunsByPUA(chunk);

    return runs
      .map(({ isTag, text }) => {
        if (isTag) {
          if (op === -1 && target === "comparator") return "";
          if (op === 1 && target === "editor") return "";
          return decodeRun(text, decodeMap);
        }

        const decodedText = decodeRun(text, decodeMap);

        if (op === -1 && target === "comparator") return "";
        if (op === 1 && target === "editor") return "";

        if (op === -1 && target === "editor")
          return `<span class="highlight-removed">${decodedText}</span>`;
        if (op === 1 && target === "comparator")
          return `<span class="highlight-added">${decodedText}</span>`;
        return decodedText;
      })
      .join("");
  };

  const editorDifferences = diffs
    .map(([op, txt]) => renderChunk(op, txt, "editor"))
    .join("");
  const comparatorDifferences = diffs
    .map(([op, txt]) => renderChunk(op, txt, "comparator"))
    .join("");

  const editorElement = document.getElementById("editor");
  const comparatorElement = document.getElementById("comparator");
  if (editorElement) editorElement.innerHTML = editorDifferences;
  if (comparatorElement) comparatorElement.innerHTML = comparatorDifferences;

  applyDiffParentClasses("editor");
  applyDiffParentClasses("comparator");

  const editorImages = extractImagesInOrder(editorContent);
  const siteImages = extractImagesInOrder(comparatorContent);
  const imageReport = compareImagesByPosition(editorImages, siteImages);
  const imageTableHTML = renderImageComparisonTable(imageReport);

  if (comparatorElement) {
    let imageComparisonContainer = document.getElementById("image-comparison");
    if (!imageComparisonContainer) {
      imageComparisonContainer = document.createElement("div");
      imageComparisonContainer.id = "image-comparison";
      comparatorElement.appendChild(imageComparisonContainer);
    }
    imageComparisonContainer.innerHTML = imageTableHTML;
  }

  const hasDifferences = diffs.some(([op]) => op !== 0);

  if (hasDifferences) {
    return {
      hasDifferences: true,
      editorDifferences,
      comparatorDifferences,
      imageReport,
    };
  }

  return {
    hasDifferences: false,
    areEqual: encodedEditorString === encodedComparatorString,
    imageReport,
  };
};

export default Equals;
