import mammoth from "mammoth";

export const handleFileChange = async (file, selectedFormat, setContent) => {
  if (file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const content = event.target.result;
        let result;
        if (selectedFormat === "html") {
          result = await mammoth.convertToHtml({ arrayBuffer: content });
        } else if (selectedFormat === "markdown") {
          result = await mammoth.convertToMarkdown({
            arrayBuffer: content,
            convertImage: mammoth.images.inline((element) => {
              return "IMAGEN"; // Cambio aquí: devolver "IMAGEN" en lugar de cadena vacía
            }),
          });
        }
        if (setContent) {
          setContent(result.value); // Establecer el contenido utilizando la función setContent
        }
        resolve(result);
      };
      reader.readAsArrayBuffer(file);
    });
  }
};
