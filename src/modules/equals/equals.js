import { marked } from "marked";
import DOMPurify from "dompurify";
import DiffMatchPatch from "diff-match-patch";
import { parseDocument, DomHandler, DomUtils } from "htmlparser2";

const markdownToHTML = (markdown) => {
  const filteredMarkdown = markdown.replace(
    /^.+\.jpg\nTitle: .+\nAlt Text: .+\n/gm,
    ""
  );
  return marked(filteredMarkdown);
};

const cleanHTML = (html) => {
  let clean = DOMPurify.sanitize(html.trim().replace(/>\s+</g, "><"), {
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
      "strong",
    ],
  });
  clean = clean.replace(
    /<strong>Title: <\/strong>.+?<strong>Alt Text: <\/strong>.+?/g,
    ""
  );
  clean = clean.replace(/\d+\.\d+ KB\d+ x \d+.+?\.webp\?itok=\w+/g, "");
  clean = clean.replace(/^[^<]*(?=<p>)/gm, "");
  clean = clean.replace(/(?<=<\/h\d>)[^<]*/gm, "");
  clean = clean.replace(/^(?!<h\d|<a|<p|<li|<ul|<strong|<img).+$/gm, "");
  clean = clean.replace(/^\s*[\r\n]/gm, "");
  clean = clean.replace(/ id="[^"]*"/g, "");
  clean = clean.replace(/<\/ul>\s*<ul>/g, "");
  return clean;
};

const cleanHTMLCompare = (html) => {
  let clean = DOMPurify.sanitize(html.trim().replace(/>\s+</g, "><"), {
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
      "strong",
    ],
  });
  clean = clean.replace(
    /<strong>Title: <\/strong>.+?<strong>Alt Text: <\/strong>.+?/g,
    ""
  );
  clean = clean.replace(/\d+\.\d+ KB\d+ x \d+.+?\.webp\?itok=\w+/g, "");
  clean = clean.replace(/ id="[^"]*"/g, "");
  clean = clean.replace(/ rel="noreferrer"/g, "");
  clean = clean.replace(/(?:\r\n|\r|\n){2,}/g, "</p><p>");
  clean = clean.replace(/<\/p>(<h[1-5]>)/g, "$1");
  clean = clean.replace(/(<\/h[1-5]>)(?!<p>|<\/div>)/g, "$1");
  clean = clean.replace(/<p>\s*(<h[1-5]>)/g, "$1");
  clean = clean.replace(/(<\/h[1-5]>)\s*<\/p>/g, "$1");
  clean = clean.replace(
    /^(?!<h\d|<a|<p|<li|<ul|<strong|<img).+$/gm,
    "<p>$&</p>"
  );
  clean = clean.replace(/<p>\s*<\/p>/g, "");
  return clean;
};

const normalizeHTML = (html) => {
  const handler = new DomHandler();
  const dom = parseDocument(html, handler);
  return DomUtils.getOuterHTML(dom, {
    xmlMode: false, // Ensure it is not in XML mode
    decodeEntities: true, // Decode HTML entities
  });
};

const processArray = (arraySaved) => {
  let groupedContent = [];
  let currentParagraph = "";

  arraySaved.forEach((item) => {
    if (item.type === "html") {
      if (currentParagraph !== "") {
        currentParagraph += item.data || item.content;
      } else {
        currentParagraph = item.data || item.content;
      }
    } else if (item.type === "paragraph") {
      if (currentParagraph !== "") {
        groupedContent.push({
          type: currentParagraph.includes("<") ? "html" : "paragraph",
          data: currentParagraph,
        });
        currentParagraph = markdownToHTML(item.data);
      } else {
        currentParagraph = markdownToHTML(item.data);
      }
    } else if (item.type === "image") {
      if (currentParagraph !== "") {
        groupedContent.push({
          type: currentParagraph.includes("<") ? "html" : "paragraph",
          data: currentParagraph,
        });
        currentParagraph = "";
      }
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

const compareContent = async (editorContent, comparatorContent) => {
  const processedEditorContent = processArray(editorContent);
  const processedComparatorContent = processArray(comparatorContent);

  if (
    processedComparatorContent.length > 0 &&
    processedComparatorContent[0].type === "html" &&
    processedComparatorContent[0].data.includes("<h1>")
  ) {
    processedComparatorContent.shift();
  }

  const editorHTML = processedEditorContent.map((item) => {
    if (item.type === "paragraph") {
      return markdownToHTML(item.data);
    } else {
      return item.data;
    }
  });

  if (editorHTML.length > 0 && editorHTML[0].includes("<h1>")) {
    editorHTML.shift();
  }

  const cleanedEditorHTML = editorHTML.map((html) => cleanHTML(html));
  const cleanedComparatorHTML = processedComparatorContent.map((item) => {
    if (item.type === "html") {
      return cleanHTMLCompare(item.data);
    } else {
      return item.data;
    }
  });

  const normalizedEditorHTML = cleanedEditorHTML.map((html) =>
    normalizeHTML(html)
  );
  const normalizedComparatorHTML = cleanedComparatorHTML.map((html) =>
    normalizeHTML(html)
  );

  // Comparar elemento por elemento
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(
    normalizedEditorHTML.join(""),
    normalizedComparatorHTML.join("")
  );
  dmp.diff_cleanupSemantic(diffs);

  // Generar el resultado de las diferencias
  const highlightDifferences = diffs
    .map(([operation, text]) => {
      if (operation === 1) {
        // Inserción
        return `<span class="highlight-added">${text}</span>`;
      } else if (operation === -1) {
        // Eliminación
        return `<span class="highlight-removed">${text}</span>`;
      }
      return text; // Sin cambios
    })
    .join("");

  // Aplicar las diferencias en el DOM del comparador
  document.getElementById("editor").innerHTML = highlightDifferences;
  document.getElementById("comparator").innerHTML = highlightDifferences;

  return (
    JSON.stringify(normalizedEditorHTML) ===
    JSON.stringify(normalizedComparatorHTML)
  );
};

export default compareContent;
