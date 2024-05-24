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
    /__ETIQUETAS DE IMAGEN:\s*__\s*__Alt Text:__\s*(.*?)\s*__Title:__\s*(.*?)\s*__Nombre de la imagen:__\s*(.*?)\s*__FIN DE ETIQUETAS__/gs;
  const schemaRegex = /__\*DATOS ESTRUCTURADOS:\s*\*__\n([\s\S]*?)<\/script>/;
  const metaDataRegex =
    /\s*MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:__\s*__CATEGORÍA:__\s*(.*?)\s*__URL SUGERIDA:__\s*\[.*?\]\((.*?)\)\s*__Meta Title:__\s*(.*?)\s*__Meta Description:__\s*([\s\S]*?)\s*__FIN DE SEO__/;

  const images = [];

  // Extract metadata
  let metaDataImport = {};
  const metaDataMatch = metaDataRegex.exec(content);
  if (metaDataMatch) {
    metaDataImport = {
      market: metaDataMatch[1].trim(),
      articleNumber: metaDataMatch[2].trim(),
      category: metaDataMatch[3].trim(),
      suggestedUrl: metaDataMatch[4].trim(),
      metaTitle: metaDataMatch[5].trim(),
      metaDescription: metaDataMatch[6].trim(),
    };
    content = content.replace(metaDataRegex, "");
  }

  // Extract schema data
  let schema = "";
  const schemaMatch = schemaRegex.exec(content);
  if (schemaMatch) {
    schema = schemaMatch[1].trim();
    content = content.replace(schemaRegex, "");
  }

  // Extract tags and assign them to the corresponding images
  let tagMatch;
  let imageIndex = 0;
  const tagMatches = [];
  while ((tagMatch = tagRegex.exec(content)) !== null) {
    tagMatches.push(tagMatch);
  }

  // Remove all tag texts from the content
  content = content.replace(tagRegex, "");

  // Extract images and their corresponding paragraphs
  const contentParts = [];
  let contentCursor = 0;
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const [fullMatch, altText, imageSrc] = match;
    const endOfPreviousPart = match.index;
    const startOfNextPart = imageRegex.lastIndex;

    // Extract paragraph before the image
    const paragraph = content.slice(contentCursor, endOfPreviousPart).trim();
    if (paragraph) {
      contentParts.push({ type: "paragraph", data: paragraph });
    }

    // Assign the corresponding tag data if available
    const tags = tagMatches[imageIndex] || [];
    const [, tagAltText = "", tagTitle = "", tagImageName = ""] = tags;

    // Add the image with tag data
    images.push({
      imageSrc: imageSrc.trim(),
      altText: tagAltText ? tagAltText.trim() : altText.trim(),
      title: tagTitle.trim(),
      imageName: tagImageName.trim(),
    });
    contentParts.push({ type: "image", data: images[images.length - 1] });

    contentCursor = startOfNextPart;
    imageIndex++;
  }

  // Add remaining text after the last image
  const remainingText = content.slice(contentCursor).trim();
  if (remainingText) {
    contentParts.push({ type: "paragraph", data: remainingText });
  }

  return {
    content: contentParts,
    metaDataImport,
    schema,
  };
};

export default { parseMarkdownContent };
