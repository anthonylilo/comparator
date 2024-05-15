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
          result = { content: result.value };
        } else if (selectedFormat === "markdown") {
          result = await mammoth.convertToMarkdown({ arrayBuffer: content });
          result = parseMarkdownContent(result.value);
        }
        resolve(result);
      };
      reader.readAsArrayBuffer(file);
    });
  }
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

export default { handleFileChange, parseMarkdownContent };
