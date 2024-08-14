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
  clean = clean.replace(/(<ul>)(<li>.*?<\/li>)+(<\/ul>)/g, (match, p1, p2, p3) => {
    const listItems = p2.match(/<li>.*?<\/li>/g);
    if (listItems) {
      return `${p1}${listItems.join('')}${p3}`;
    }
    return match;
  });
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
  clean = clean.replace(/^(?!<h\d|<a|<p|<li|<ul|<strong|<img).+$/gm, "<p>$&</p>");
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
        currentParagraph += markdownToHTML(item.data);
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
  console.log(cleanedEditorHTML);
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
  const diffs = normalizedEditorHTML.map((editorItem, index) => {
    const comparatorItem = normalizedComparatorHTML[index] || "";
    const diff = dmp.diff_main(editorItem, comparatorItem);
    dmp.diff_cleanupSemantic(diff);
    return diff;
  });

  console.log(diffs);

  // Generar el resultado de las diferencias
  const editorDiffs = diffs.map((diff) =>
    diff
      .map((part) =>
        part[0] === 0
          ? part[1]
          : part[0] === -1
          ? `<span style="background-color: red">${part[1]}</span>`
          : ""
      )
      .join("")
  );

  const comparatorDiffs = diffs.map((diff) =>
    diff
      .map((part) =>
        part[0] === 0
          ? part[1]
          : part[0] === 1
          ? `<span style="background-color: red">${part[1]}</span>`
          : ""
      )
      .join("")
  );

  // Aplicar las diferencias en el DOM del editor
  const editorElement = document.getElementById("editor");
  const editorChildren = editorElement.children;

  for (let i = 0; i < editorChildren.length; i++) {
    const child = editorChildren[i];
    if (child.tagName.toLowerCase() === "p") {
      const index = normalizedEditorHTML.findIndex((html) =>
        html.includes(child.innerHTML)
      );
      if (index !== -1) {
        child.innerHTML = editorDiffs[index];
      }
    }
  }

  return (
    JSON.stringify(normalizedEditorHTML) ===
    JSON.stringify(normalizedComparatorHTML)
  );
};

export default compareContent;
