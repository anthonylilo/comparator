import mammoth from "mammoth";

export const handleFileChange = async (file, selectedFormat) => {
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToMarkdown({ arrayBuffer });
    return parseMarkdownContent(result.value, selectedFormat);
  }
};

const parseMarkdownContent = (content, selectedFormat) => {
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
  const metaDataPatterns = [
    {
      regex:
        /\s*MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__FIN DE SEO\s*__/,
      keys: [
        "market",
        "articleNumber",
        "category",
        "suggestedUrl",
        "metaTitle",
        "metaDescription",
      ],
    },
    {
      regex:
        /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO__#/,
      keys: [
        "market",
        "articleNumber",
        "category",
        "metaTitle",
        "metaDescription",
        "suggestedUrl",
      ],
    },
    {
      regex:
        /\s*MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:.*?__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*\[.*?\]\((.*?)\)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO\s*__/,
      keys: [
        "market",
        "articleNumber",
        "category",
        "metaTitle",
        "metaDescription",
        "oldUrl",
        "suggestedUrl",
      ],
    },
    {
      regex:
        /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:.*?__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*\[.*?\]\((.*?)\)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO__#/,
      keys: [
        "market",
        "articleNumber",
        "category",
        "metaTitle",
        "metaDescription",
        "oldUrl",
        "suggestedUrl",
      ],
    },
    {
      regex:
        /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:\s*__\s*__CATEGORÍA:\s*__\s*(.*?)\s*__Meta Title:\s*__\s*(.*?)\s*__Meta Description:\s*__\s*([\s\S]*?)\s*__URL ACTUAL:\s*__\s*(https:\/\/[^\s]+)\s*__URL SUGERIDA:\s*__\s*\[.*?\]\((.*?)\)\s*__FIN DE SEO__/,
      keys: [
        "market",
        "articleNumber",
        "category",
        "metaTitle",
        "metaDescription",
        "oldUrl",
        "suggestedUrl",
      ],
    },
    {
      regex:
        /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(.*?)\s*__SEO:.*?__\s*__CATEGORÍA:\s*(.*?)\s*__Meta Title:\s*(.*?)\s*__Meta Description:\s*(.*?)\s*__URL ACTUAL:\s*([^ ]+)\s*__URL SUGERIDA:\s*([^ ]+)\s*__FIN DE SEO__/,
      keys: [
        "market",
        "articleNumber",
        "category",
        "metaTitle",
        "metaDescription",
        "oldUrl",
        "suggestedUrl",
      ],
    },
  ];
  const redirectionsRegex =
    /__REDIRECCIONES:\s*__\s*((?:\[.*?\]\(.*?\)\s*)*)__FIN DE REDIRECCIONES\s*__/;

  const images = [];

  let metaDataImport = {};
  for (const { regex, keys } of metaDataPatterns) {
    const match = regex.exec(content);

    if (match) {
      metaDataImport = keys.reduce((acc, key, index) => {
        acc[key] = (match[index + 1] || "").trim();
        return acc;
      }, {});
      content = content.replace(regex, "");
      break;
    }
  }

  const redireccionesMatch = redirectionsRegex.exec(content);
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

  if (selectedFormat === "html") {
    function convertToHTML(contentParts) {
      const listItems = [];
      return contentParts
        .map((part) => {
          if (part.type === "paragraph") {
            if (part.data.startsWith("- ")) {
              const listItemText = part.data.replace(/^- (.+)$/, "$1");
              const formattedText = listItemText.replace(
                /__(.*?)__/g,
                "<strong>$1</strong>"
              );
              listItems.push(`<li>${formattedText}</li>`);
              const isLastItem =
                contentParts.indexOf(part) === contentParts.length - 1;
              if (
                isLastItem ||
                contentParts[contentParts.indexOf(part) + 1].data.startsWith(
                  "- "
                )
              ) {
                return null;
              }

              const ul = `<ul>${listItems.join("")}</ul>`;
              listItems.length = 0;
              return {
                type: "paragraph",
                data: ul,
              };
            }

            const headerMatch = part.data.match(/^(#{1,6})\s*(.+)$/);
            if (headerMatch) {
              const headerLevel = headerMatch[1].length;
              const headerText = headerMatch[2];
              return {
                type: "paragraph",
                data: `<h${headerLevel}>${headerText}</h${headerLevel}>`,
              };
            }

            const hyperlinkFormattedText = part.data.replace(
              /\[(.*?)\]\((.*?)\)/g,
              '<a href="$2" target="_blank">$1</a>'
            );

            const formattedText = hyperlinkFormattedText.replace(
              /__(.*?)__/g,
              "<strong>$1</strong>"
            );

            return {
              type: "paragraph",
              data: `<p>${formattedText}</p>`,
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
    }

    const convertedContent = convertToHTML(contentParts);
    localStorage.setItem("editorContent", JSON.stringify(convertedContent));

    return {
      content: convertedContent,
      metaDataImport,
      schema,
      redirections,
    };
  } else {
    localStorage.setItem("editorContent", JSON.stringify(contentParts));

    return {
      content: contentParts,
      metaDataImport,
      schema,
      redirections,
    };
  }
};

export default { parseMarkdownContent };
