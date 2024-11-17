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
      .replace(/\s*\(\d+\s+caracteres\)/g, "")
      .trim();
  };
  const imageRegex = /!\[(.*?)\]\((data:image\/[^)]+)\)/gs;
  const tagRegex = [
    {
      regex:
        /__ETIQUETAS DE IMAGEN:__\s*__URL ACTUAL:__\s*(https:\/\/[^\s]+)\s*__Alt Text:__\s*(.*?)\s*__Title:__\s*(.*?)\s*__Nombre de la imagen:__\s*(.*?)\s*__FIN DE ETIQUETAS__/gs,
      keys: ["urlActual", "altText", "title", "imageName"],
    },
    {
      regex:
        /__ETIQUETAS DE IMAGEN:\s*__\s*__Alt Text:\s*__\s*(.*?)\s*__Title:\s*__\s*(.*?)\s*__Nombre de la imagen:\s*__\s*(.*?)\s*__FIN DE ETIQUETAS__/gs,
      Keys: ["altText", "title", "imageName"],
    },
  ];
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
        "title",
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
        "title",
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
        "title",
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
        "title",
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
        "title",
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
        "title",
        "metaDescription",
        "oldUrl",
        "suggestedUrl",
      ],
    },
    {
      regex:
        /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(\d+)\s*CATEGORÍA:\s*(.*?)\s*__SEO:__\s*__Title:__\s*(.*?)\s*\(\d+\s*caracteres\)\s*__Meta descripción:__\s*(.*?)\s*\(\d+\s*caracteres\)\s*__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO:__\s*(.*?)\s*__URL SUGERIDA:__\s*(https:\/\/[^\s]+)\s*__FIN DE SEO__/,
      keys: [
        "market",
        "articleNumber",
        "category",
        "title",
        "metaDescription",
        "descriptionIntro",
        "suggestedUrl",
      ],
    },
    {
      regex:
        /MERCADO:\s*(.*?)\s*ARTÍCULO No:\s*(\d+)\s*CATEGORÍA:\s*(.*?)\s*__SEO:__\s*__Title:__\s*(.*?)\s*\(\d+\s*caracteres\)\s*__Meta descripción:__\s*(.*?)\s*\(\d+\s*caracteres\)\s*__DESCRIPCIÓN INTRODUCTORIA ARTÍCULO:__\s*(.*?)\s*__URL ACTUAL:__\s*(https:\/\/[^\s]+)\s*\s*__URL SUGERIDA:__\s*(https:\/\/[^\s]+)\s*__FIN DE SEO__/,
      keys: [
        "market",
        "articleNumber",
        "category",
        "title",
        "metaDescription",
        "descriptionIntro",
        "oldUrl",
        "suggestedUrl",
      ],
    },
  ];
  const redirectionsRegex =
    /__REDIRECCIONES:\s*__\s*((?:\[.*?\]\(.*?\)\s*)*)__FIN DE REDIRECCIONES\s*__/;

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
    } catch (e) {
      console.error("Error parsing schema JSON:", e);
    }
  }

  let tagMatches = [];
  tagRegex.forEach(({ regex }) => {
    let tagMatch;
    while ((tagMatch = regex.exec(content)) !== null) {
      tagMatch = tagMatch.map((match, index) =>
        index === 0 ? match : match.replace(/\\-/g, "-").replace(/\\\./g, ".")
      );
      tagMatches.push(tagMatch);
    }
  });
  console.log(tagMatches);

  tagRegex.forEach(({ regex }) => {
    content = content.replace(regex, "");
  });

  let imageIndex = 0;
  let contentCursor = 0;
  const contentParts = [];
  const images = [];
  let match;

  // Procesar imágenes en base64 o URL ACTUAL
  while (
    (match = imageRegex.exec(content)) !== null ||
    tagMatches[imageIndex]
  ) {
    let src = "",
      altText = "";

    if (match) {
      // Caso base64
      const [fullMatch, base64AltText, base64Src] = match;
      src = base64Src;
      altText = base64AltText;
    } else if (tagMatches[imageIndex]) {
      // Caso URL ACTUAL
      const [fullTag, urlActual, tagAltText, tagTitle, tagImageName] =
        tagMatches[imageIndex];
      src = urlActual;
      altText = tagAltText;
    }

    const endOfPreviousPart = match ? match.index : content.length;
    const startOfNextPart = match ? imageRegex.lastIndex : content.length;

    // Separar párrafos anteriores a la imagen
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

    // Procesar tags de la imagen
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
