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
          result = { content: result.value };
        }
        resolve(result);
      };
      reader.readAsArrayBuffer(file);
    });
  }
};
