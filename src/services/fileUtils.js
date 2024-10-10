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
  content = content.replace(/<a id="_Hlk\d+"><\/a>/g, "");
  content = content.replace(/\s*<p><strong>CONTENT:<\/strong><\/p>\s*/, "");
  const cleanText = (text) => {
    return text
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .replace(/(\r\n|\n|\r)/gm, " ")
      .trim();
  };
  const tagRegex =
    /<p><strong>ETIQUETAS DE IMAGEN:[^<]*<\/strong>\s*<\/p>\s*<p><strong>Alt Text:<\/strong>\s*([^<]+(?:\n|\r|\s)*[^<]*)<br\s*\/?>\s*<strong>Title:<\/strong>\s*([^<]+(?:\n|\r|\s)*[^<]*)\s*<br\s*\/?>\s*<strong>Nombre de la imagen:<\/strong>\s*([^<]+(?:\n|\r|\s)*[^<]*)<\/p>\s*<p><strong>FIN DE ETIQUETAS<\/strong><\/p>/g;
  const schemaRegex =
    /<p><strong>DATOS ESTRUCTURADOS:<\/strong><\/p>\s*<p>&lt;script[^>]*&gt;<\/p>([\s\S]*?)<p>&lt;\/script&gt;<\/p>/i;
  const metaDataRegex =
    /<p>\s*MERCADO:\s*(.*?)\s*<\/p>\s*<p>\s*ARTÍCULO No:\s*(.*?)\s*<\/p>\s*<p><strong>SEO:<\/strong><\/p>\s*<p><strong>CATEGORÍA:<\/strong>\s*(.*?)\s*<\/p>\s*<p><strong>URL SUGERIDA:<\/strong>\s*<a href="(.*?)">(.*?)<\/a><\/p>\s*<p><strong>Meta Title:<\/strong>\s*(.*?)\s*(?:<br \/>|<\/p>)\s*<strong>Meta Description:<\/strong>\s*(.*?)\s*<\/p>\s*<p><strong>FIN DE SEO<\/strong><\/p>\s*/;

  const metaDataMatch = metaDataRegex.exec(cleanText(content));
  let metaDataImport = {};
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
  }

  let schema = "";
  const schemaMatch = schemaRegex.exec(content);
  if (schemaMatch) {
    schema = schemaMatch[1]
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\\(["\\/bfnrt])/g, "$1")
      .replace(/\n/g, "")
      .trim();
    try {
      schema = JSON.parse(schema);
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
    content = content.replace(schemaRegex, "");
  }

  // Extraer etiquetas de imagen
  let tagMatch;
  let tagMatches = [];
  while ((tagMatch = tagRegex.exec(cleanText(content))) !== null) {
    tagMatches.push(tagMatch);
  }

  content = content.replace(tagRegex, "");

  // Parsear el HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const childNodes = Array.from(doc.body.childNodes);

  let images = [];
  let contentParts = [];
  let imageIndex = 0;

  childNodes.forEach((node) => {
    if (node.nodeName === "P" && node.querySelector("img")) {
      const imgTag = node.querySelector("img");
      const imgSrc = imgTag.getAttribute("src");

      const tags = tagMatches[imageIndex] || [];
      const [_, tagAltText = "", tagTitle = "", tagImageName = ""] = tags;

      images.push({
        src: imgSrc.trim(),
        alt: tagAltText.trim(),
        title: tagTitle.trim(),
        imageName: tagImageName.trim(),
      });

      contentParts.push({
        type: "image",
        data: images[images.length - 1],
      });
      imageIndex++;
    } else if (
      node.nodeName === "P" ||
      node.nodeName === "H1" ||
      node.nodeName === "H2" ||
      node.nodeName === "H3" ||
      node.nodeName === "H4" ||
      node.nodeName === "H5"
    ) {
      const outerHTML = node.outerHTML.trim().split(/\n/);
      if (outerHTML) {
        contentParts.push({ type: "html", data: outerHTML });
      }
    }
  });

  const redirections = [];
  return { content: contentParts, metaDataImport, schema, redirections };
};

const parseMarkdownContent = (content) => {
  content = content.replace(/<a id="_Hlk\d+"><\/a>/g, "");
  content = content.replace(/\s*__CONTENT:\s*__\s*/, "");
  const cleanText = (text) => {
    return text
      .replace(/\\-/g, "-")
      .replace(/\\\./g, ".")
      .replace(/\\/g, "")
      .trim();
  };
  const imageRegex = /!\[(.*?)\]\((data:image\/[^)]+)\)/gs;
  const tagRegex =
    /__ETIQUETAS DE IMAGEN:\s*__\s*__Alt Text:\s*__\s*(.*?)\s*__Title:\s*__\s*(.*?)\s*__Nombre de la imagen:\s*__\s*(.*?)\s*__FIN DE ETIQUETAS__/gs;
  const schemaRegex = /__DATOS ESTRUCTURADOS:\s*__\s*([\s\S]*?)<\/script>/i;
  //Without suggest url
  const metaDataRegex =
    /\s*MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__FIN DE SEO\s*__/;
  const metaDataRegex1 =
    /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO__#/;
  //Suggest url
  const metaDataModifedArticle =
    /\s*MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:.*?__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*\[.*?\]\((.*?)\)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO\s*__/;
  const metaDataModifedArticle1 =
    /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:.*?__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*\[.*?\]\((.*?)\)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO__#/;
  const metaDataModifedArticle2 =
    /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*(https:\/\/[^\s]+)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO__/;
  const metaDataModifedArticle3 =
    /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:.*?__\s*__CATEGORÍA:\s*(.*?)\s*__Meta Title:\s*(.*?)\s*__Meta Description:\s*(.*?)\s*__URL ACTUAL:\s*([^ ]+)\s*__URL SUGERIDA:\s*([^ ]+)\s*__FIN DE SEO__/;

  //Redirections
  const redirectionsRegex =
    /__REDIRECCIONES:\s*__\s*((?:\[.*?\]\(.*?\)\s*)*)__FIN DE REDIRECCIONES\s*__/;

  const images = [];

  let metaDataImport = {};
  const metaDataMatch = metaDataRegex.exec(content);
  const metaDataMatch1 = metaDataRegex1.exec(content);
  const metaDataModifedArticleMatch = metaDataModifedArticle.exec(content);
  const metaDataModifedArticleMatch1 = metaDataModifedArticle1.exec(content);
  const metaDataModifedArticleMatch2 = metaDataModifedArticle2.exec(content);
  const metaDataModifedArticleMatch3 = metaDataModifedArticle3.exec(content);
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
  } else if (metaDataMatch1) {
    metaDataImport = {
      market: metaDataMatch1[1].trim(),
      articleNumber: metaDataMatch1[2].trim(),
      category: metaDataMatch1[3].trim(),
      metaTitle: metaDataMatch1[4].trim(),
      metaDescription: cleanText(metaDataMatch1[5]),
      suggestedUrl: metaDataMatch1[6].trim(),
    };
    content = content.replace(metaDataRegex1, "");
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
  } else if (metaDataModifedArticleMatch1) {
    metaDataImport = {
      market: metaDataModifedArticleMatch1[1].trim(),
      articleNumber: metaDataModifedArticleMatch1[2].trim(),
      category: metaDataModifedArticleMatch1[3].trim(),
      metaTitle: metaDataModifedArticleMatch1[4].trim(),
      metaDescription: cleanText(metaDataModifedArticleMatch1[5]),
      oldUrl: metaDataModifedArticleMatch1[6].trim(),
      suggestedUrl: metaDataModifedArticleMatch1[7].trim(),
    };
    content = content.replace(metaDataModifedArticle1, "");
  } else if (metaDataModifedArticleMatch2) {
    metaDataImport = {
      market: metaDataModifedArticleMatch2[1].trim(),
      articleNumber: metaDataModifedArticleMatch2[2].trim(),
      category: metaDataModifedArticleMatch2[3].trim(),
      metaTitle: metaDataModifedArticleMatch2[4].trim(),
      metaDescription: cleanText(metaDataModifedArticleMatch2[5]),
      oldUrl: metaDataModifedArticleMatch2[6].trim(),
      suggestedUrl: metaDataModifedArticleMatch2[7].trim(),
    };
    content = content.replace(metaDataModifedArticle2, "");
  } else if (metaDataModifedArticleMatch3) {
    metaDataImport = {
      market: metaDataModifedArticleMatch3[1].trim(),
      articleNumber: metaDataModifedArticleMatch3[2].trim(),
      category: metaDataModifedArticleMatch3[3].trim(),
      metaTitle: metaDataModifedArticleMatch3[4].trim(),
      metaDescription: cleanText(metaDataModifedArticleMatch3[5]),
      oldUrl: metaDataModifedArticleMatch3[6].trim(),
      suggestedUrl: metaDataModifedArticleMatch3[7].trim(),
    };
    content = content.replace(metaDataModifedArticle3, "");
  } else {
    console.log("No hay meta datos");
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

  const saveContentToLocalStorage = (contentParts) => {
    localStorage.setItem("editorContent", JSON.stringify(contentParts));
  };

  saveContentToLocalStorage(contentParts);

  return {
    content: contentParts,
    metaDataImport,
    schema,
    redirections,
  };
};

export default { parseMarkdownContent };
