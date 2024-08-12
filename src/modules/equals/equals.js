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

const compareContent = async (editorContent, comparatorContent) => {
  const markdownToHtml = markdownToHTML(editorContent);
  const cleanMarkdown = cleanHTML(markdownToHtml);
  const cleanedComparatorContent = cleanHTML(comparatorContent);

  const normalizedMarkdown = normalizeHTML(cleanMarkdown);
  const normalizedComparator = normalizeHTML(cleanedComparatorContent);

  const dmp = new DiffMatchPatch();
  const diff = dmp.diff_main(normalizedMarkdown, normalizedComparator);
  dmp.diff_cleanupSemantic(diff);

  const editorDiff = diff
    .map((part) => {
      if (part[0] === 0) {
        return part[1];
      } else if (part[0] === -1) {
        return `<span style="background-color: red">${part[1]}</span>`;
      }
    })
    .join("");

  const comparatorDiff = diff
    .map((part) => {
      if (part[0] === 0) {
        return part[1];
      } else if (part[0] === 1) {
        return `<span style="background-color: red">${part[1]}</span>`;
      }
    })
    .join("");

  const editorElement = document.getElementById("editor");
  const editorChildren = editorElement.children;

  for (let i = 0; i < editorChildren.length; i++) {
    const child = editorChildren[i];
    if (child.tagName.toLowerCase() === "p") {
      const index = normalizedMarkdown.indexOf(child.innerHTML);
      if (index !== -1) {
        child.innerHTML = editorDiff.substring(
          index,
          index + child.innerHTML.length
        );
      }
    }
  }

  return normalizedMarkdown === normalizedComparator;
};

export default compareContent;
