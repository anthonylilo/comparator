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
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  // Parse images
  const images = [...doc.querySelectorAll("img")].map((img) => ({
    imageSrc: img.src,
    altText: img.alt || "",
    title: img.title || "",
    imageName: img.getAttribute("data-filename") || "",
  }));

  // Parse structured data
  let schema = "";
  const paragraphs = doc.querySelectorAll("p");
  let isScriptSection = false;
  let scriptContent = "";

  paragraphs.forEach((p) => {
    const textContent = p.textContent.trim();
    if (textContent.startsWith('<script type="application/ld+json">')) {
      isScriptSection = true;
      scriptContent = textContent.replace(
        '<script type="application/ld+json">',
        ""
      );
    } else if (isScriptSection) {
      if (textContent.endsWith("</script>")) {
        scriptContent += textContent.replace("</script>", "");
        isScriptSection = false;
        schema = scriptContent.trim();
      } else {
        scriptContent += textContent;
      }
    }
  });

  // Remove images and schema from content
  images.forEach((img) => {
    if (img.parentNode) {
      img.parentNode.removeChild(img);
    }
  });

  const text = doc.body.innerHTML.trim();

  return { images, schema, text };
};

const parseMarkdownContent = (content) => {
  const imageRegex = /!\[(.*?)\]\((data:image\/[^)]+)\)/g;
  const tagRegex =
    /__ETIQUETAS DE IMAGEN:__\s+Text Alt:\s*(.*?)\s+Title de la Imagen:\s*(.*?)\s+Nombre de la imagen:\s*(.*?)\s/gm;
  const schemaRegex = /__\*DATOS ESTRUCTURADOS:\s*\*__\n([\s\S]*?)<\/script>/;

  const imageMarkDown = [];
  let imageMatch;
  let tagMatch;
  let imageIndex = 0;

  // Collect all images first
  while ((imageMatch = imageRegex.exec(content)) !== null) {
    const [_, altText, imageSrc] = imageMatch;
    imageMarkDown.push({ imageSrc, altText, title: "", imageName: "" });
  }

  // Collect all tags
  while ((tagMatch = tagRegex.exec(content)) !== null) {
    const [_, altText, title, imageName] = tagMatch;
    if (imageMarkDown[imageIndex]) {
      imageMarkDown[imageIndex].altText = altText;
      imageMarkDown[imageIndex].title = title;
      imageMarkDown[imageIndex].imageName = imageName;
    }
    imageIndex++;
  }

  const schemaMatch = schemaRegex.exec(content);
  const schemaMarkDown = schemaMatch ? schemaMatch[1].trim() : "";

  const text = content
    .replace(imageRegex, "")
    .replace(tagRegex, "")
    .replace(schemaRegex, "")
    .trim();

  return { images: imageMarkDown, schema: schemaMarkDown, text };
};

export default { handleFileChange, parseHtmlContent, parseMarkdownContent };
