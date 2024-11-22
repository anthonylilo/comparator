import { marked } from "marked";
import DOMPurify from "dompurify";
import DiffMatchPatch from "diff-match-patch";
import { parseDocument, DomHandler, DomUtils } from "htmlparser2";

const markdownToHTML = (markdown) => {
  const filteredMarkdown = markdown.replace(
    /^.+\.jpg\nTitle: .+\nAlt Text: .+\n/gm,
    ""
  );
  const html = filteredMarkdown.replace(/__(.*?)__/g, "<strong>$1</strong>");
  return marked(html);
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
  clean = clean.replace(/^\s*[\r\n]/gm, "");
  clean = clean.replace(/ id="[^"]*"/g, "");
  clean = clean.replace(/<\/ul>\s*<ul>/g, "");
  clean = clean.replace(/<li>\s*<\/li>/g, "");
  clean = clean.replace(/<li>\s*(.*?)\s*<\/li>/g, "<li>$1</li>");
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
  let isList = false;
  let listItems = [];
  let precedingParagraph = null;

  arraySaved.forEach((item, index) => {
    const itemData = item.data || "";

    // Procesar listas que empiezan con "-"
    if (item.type === "paragraph" && itemData.trim().startsWith("-")) {
      isList = true;
      const listItem = itemData.trim().replace(/^-\s*/, "");
      listItems.push(
        `<li>${markdownToHTML(listItem).replace(/<p>|<\/p>/g, "")}</li>`
      );
    } else if (isList) {
      // Si llegamos a un elemento que no es lista pero hemos procesado una lista
      if (precedingParagraph) {
        // Si había un párrafo antes de la lista, lo agregamos primero
        groupedContent.push({
          type: "html",
          data: `<p>${markdownToHTML(precedingParagraph)}</p>`,
        });
        precedingParagraph = null;
      }

      groupedContent.push({
        type: "html",
        data: `<ul>${listItems.join("")}</ul>`,
      });

      isList = false;
      listItems = [];
    }

    // Si no estamos en una lista, procesar los párrafos
    if (!isList) {
      if (item.type === "html") {
        currentParagraph = itemData || item.content;
      } else if (item.type === "paragraph") {
        if (itemData.trim().startsWith("-")) {
          // Detectar si este es el comienzo de una lista
          isList = true;
          listItems.push(
            `<li>${markdownToHTML(itemData.replace(/^-\s*/, ""))}</li>`
          );
        } else if (currentParagraph !== "") {
          groupedContent.push({
            type: currentParagraph.includes("<") ? "html" : "paragraph",
            data: currentParagraph,
          });
          currentParagraph = markdownToHTML(item.data);
        } else {
          // Aquí guardamos el párrafo que debe preceder a la lista
          groupedContent.push({
            type: "html",
            data: `${markdownToHTML(itemData)}`,
          });
          currentParagraph = "";
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
    }

    // Al final del array, si hay una lista, agruparla
    if (index === arraySaved.length - 1 && isList) {
      if (precedingParagraph) {
        groupedContent.push({
          type: "html",
          data: `<p>${markdownToHTML(precedingParagraph)}</p>`,
        });
      }

      groupedContent.push({
        type: "html",
        data: `<ul>${listItems.join("")}</ul>`,
      });
    }
  });

  // Asegurarse de agregar cualquier párrafo final no procesado
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

  // Comparar elemento por elemento usando DiffMatchPatch
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(
    normalizedEditorHTML.join(""),
    normalizedComparatorHTML.join("")
  );
  dmp.diff_cleanupSemantic(diffs);

  // Generar diferencias para el editor
  const editorDifferences = diffs
    .map(([operation, text]) => {
      if (operation === -1) {
        // Texto eliminado resaltado en editor
        return `<div class="highlight-removed">${text}</div>`;
      } else if (operation === 0) {
        // Texto sin cambios
        return text;
      }
      return ""; // Ignorar inserciones en el editor
    })
    .join("");

  console.log(editorDifferences);

  // Generar diferencias para el comparador
  const comparatorDifferences = diffs
    .map(([operation, text]) => {
      if (operation === 1) {
        // Texto añadido resaltado en comparador
        return `<div class="highlight-added">${text}</div>`;
      } else if (operation === 0) {
        // Texto sin cambios
        return text;
      }
      return ""; // Ignorar eliminaciones en el comparador
    })
    .join("");

  // Actualizar el contenido HTML del editor y del comparador
  document.getElementById("editor").innerHTML = editorDifferences;
  document.getElementById("comparator").innerHTML = comparatorDifferences;

  const hasDifferences = diffs.some(([operation]) => operation !== 0);

  if (hasDifferences) {
    return { hasDifferences: true, editorDifferences, comparatorDifferences };
  } else {
    return {
      hasDifferences: false,
      areEqual:
        JSON.stringify(normalizedEditorHTML) ===
        JSON.stringify(normalizedComparatorHTML),
    };
  }
};

export default compareContent;
