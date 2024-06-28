import mammoth from "mammoth";

export const handleFileChange = async (file, selectedFormat) => {
  if (file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const content = event.target.result;
        let result;
        if (selectedFormat === "html") {
          result = await mammoth.convertToHtml({ arrayBuffer: content });
          result = parseHtmlContent(result.value);
        } else if (selectedFormat === "markdown") {
          result = await mammoth.convertToMarkdown({ arrayBuffer: content });
          result = parseMarkdownContent(result.value);
        }
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }
};

const parseHtmlContent = (content) => {
  const metaDataRegex =
    /<p>MERCADO:\s*(.*?)<\/p>\s*<p>ARTÍCULO No:\s*(.*?)<\/p>\s*<p><strong>SEO:<\/strong><\/p>\s*<p><strong>CATEGORÍA:<\/strong>\s*(.*?)<\/p>\s*<p><strong>URL SUGERIDA:<\/strong>\s*<a href="(.*?)">(.*?)<\/a><\/p>\s*<p><strong>Meta Title:<\/strong>\s*(.*?)<\/p>\s*<p><strong>Meta Description:<\/strong>\s*(.*?)<\/p>/;

  const metaDataMatch = metaDataRegex.exec(content);
  let metaData = {};
  if (metaDataMatch) {
    metaData = {
      market: metaDataMatch[1],
      articleNumber: metaDataMatch[2],
      category: metaDataMatch[3],
      suggestedUrl: metaDataMatch[4],
      metaTitle: metaDataMatch[5],
      metaDescription: metaDataMatch[6],
    };
    // Remove metadata from content
    content = content.replace(metaDataRegex, "");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const contentParts = [];
  const contentNodes = doc.body.childNodes;
  for (const node of contentNodes) {
    contentParts.push(node.outerHTML);
  }

  return { metaData, content: contentParts };
};

const parseMarkdownContent = (content) => {
  const imageRegex = /!\[(.*?)\]\((data:image\/[^)]+)\)/gs;
  const tagRegex =
    /__ETIQUETAS DE IMAGEN:\s*__\s*__Alt Text:\s*__\s*(.*?)\s*__Title:\s*__\s*(.*?)\s*__Nombre de la imagen:\s*__\s*(.*?)\s*__FIN DE ETIQUETAS__/gs;
  const schemaRegex = /__DATOS ESTRUCTURADOS:\s*__\s*([\s\S]*?)<\/script>/i;
  const metaDataRegex =
    /\s*MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__FIN DE SEO\s*__/;
  const metaDataModifedArticle =
    /\s*MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:.*?__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*\[.*?\]\((.*?)\)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO\s*__/;
  const redirectionsRegex =
    /__REDIRECCIONES:\s*__\s*((?:\[.*?\]\(.*?\)\s*)*)__FIN DE REDIRECCIONES\s*__/;
  const contentText = /\s*__CONTENT:\s*__\s*/;

  content = content.replace(contentText, "");

  const images = [];

  const cleanText = (text) => {
    return text
      .replace(/\\-/g, "-")
      .replace(/\\\./g, ".")
      .replace(/\\/g, "")
      .trim();
  };

  let metaDataImport = {};
  const metaDataMatch = metaDataRegex.exec(content);
  const metaDataModifedArticleMatch = metaDataModifedArticle.exec(content);
  const redireccionesMatch = redirectionsRegex.exec(content);

  if (metaDataMatch) {
    metaDataImport = {
      market: metaDataMatch[1].trim(),
      articleNumber: metaDataMatch[2].trim(),
      category: metaDataMatch[3].trim(),
      suggestedUrl: metaDataMatch[4].trim(),
      metaTitle: metaDataMatch[5].trim(),
      metaDescription: cleanText(metaDataMatch[6]),
    };
    content = content.replace(metaDataRegex, "");
  } else if (metaDataModifedArticleMatch) {
    metaDataImport = {
      market: metaDataModifedArticleMatch[1].trim(),
      articleNumber: metaDataModifedArticleMatch[2].trim(),
      category: metaDataModifedArticleMatch[3].trim(),
      metaTitle: metaDataModifedArticleMatch[4].trim(),
      metaDescription: cleanText(metaDataModifedArticleMatch[5]),
      oldUrl: metaDataModifedArticleMatch[6].trim(),
      suggestedUrl: metaDataModifedArticleMatch[7].trim(),
    };
    content = content.replace(metaDataModifedArticle, "");
  }

  const redirections = [];
  if (redireccionesMatch) {
    const rawRedirections = redireccionesMatch[1].trim().split("\n");
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

  let schema = "";
  const schemaMatch = schemaRegex.exec(content);
  if (schemaMatch) {
    schema = schemaMatch[1].trim();
    content = content.replace(schemaRegex, "");
    schema = schema
      .replace(/<script[^>]*>/i, "")
      .replace(/<\/script>/i, "")
      .replace(/\\/g, "")
      .replace(/\\(["\\/bfnrt])/g, "$1")
      .replace(/\n/g, "")
      .trim();
    schema = schema.replace(/\s+/g, " ").trim();
    try {
      schema = JSON.parse(schema);
    } catch (e) {
      console.error("Error parsing schema JSON:", e);
    }
  }

  let tagMatch;
  let imageIndex = 0;
  const tagMatches = [];
  while ((tagMatch = tagRegex.exec(content)) !== null) {
    tagMatches.push(tagMatch);
  }

  content = content.replace(tagRegex, "");

  const contentParts = [];
  let contentCursor = 0;
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const [fullMatch, altText, src] = match;
    const endOfPreviousPart = match.index;
    const startOfNextPart = imageRegex.lastIndex;

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
    const [, tagAltText = "", tagTitle = "", tagImageName = ""] = tags;

    images.push({
      src: src.trim(),
      alt: cleanText(tagAltText ? tagAltText.trim() : altText.trim()),
      title: cleanText(tagTitle.trim()),
      imageName: cleanText(tagImageName.trim()),
    });
    contentParts.push({ type: "image", data: images[images.length - 1] });
    contentCursor = startOfNextPart;
    imageIndex++;
  }

  const remainingText = content.slice(contentCursor).trim().split(/\n+/);
  remainingText.forEach((text) => {
    const cleanedText = cleanText(text);
    if (cleanedText && cleanedText !== "__" && cleanedText !== "##") {
      contentParts.push({ type: "paragraph", data: cleanedText });
    }
  });

  return {
    content: contentParts,
    metaDataImport,
    schema,
    redirections,
  };
};

export default { parseMarkdownContent };
