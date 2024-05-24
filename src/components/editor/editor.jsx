import React, { useState } from "react";
import { Container, Row, Form } from "react-bootstrap";
import RichEditor from "../general/ckeditor";
import { handleFileChange } from "./fileUtils/fileUtils";

function Editor() {
  const [content, setContent] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("html");
  const [parsedContent, setParsedContent] = useState([]);
  const [schema, setSchema] = useState("");
  const [metaData, setMetaData] = useState({});
  const [showMarkdownInput, setShowMarkdownInput] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleFormatChange = (e) => {
    const format = e.target.value;
    setSelectedFormat(format);
    setShowMarkdownInput(false);
    setShowEditor(false);
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    const result = await handleFileChange(file, selectedFormat);
    if (selectedFormat === "html") {
      setContent(result.text);
      setParsedContent(result.content);
      setSchema(result.schema);
      setMetaData(result.meta);
      setShowEditor(true);
    } else if (selectedFormat === "markdown") {
      setParsedContent(result.content);
      setSchema(result.schema);
      setMetaData(result.metaDataImport);
      setShowMarkdownInput(true);
    }
  };

  return (
    <Container fluid="md">
      <Row>
        {!showEditor && !showMarkdownInput && (
          <div>
            <p>Type of content</p>
            <Form.Select onChange={handleFormatChange} value={selectedFormat}>
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
            </Form.Select>
            <input
              type="file"
              onChange={handleFileInputChange}
              accept=".docx"
            />
          </div>
        )}
        {showEditor && selectedFormat === "html" && (
          <div>
            <RichEditor articleContent={content} />
            <div className="mt-3 justify-content-md-center text-center">
              {parsedContent.map((item, index) =>
                item.type === "image" ? (
                  <div key={index} className="mt-3">
                    <img
                      src={item.data.imageSrc}
                      alt={item.data.altText}
                      style={{ maxWidth: "100%" }}
                    />
                    <p>Alt Text: {item.data.altText}</p>
                    <p>Title: {item.data.title}</p>
                    <p>Nombre de la imagen: {item.data.imageName}</p>
                  </div>
                ) : (
                  <p key={index}>{item.data}</p>
                )
              )}
              <div className="mt-3">
                <h5>Datos Estructurados</h5>
                <input type="text" readOnly value={schema} />
              </div>
            </div>
          </div>
        )}
        {showMarkdownInput && selectedFormat === "markdown" && (
          <div className="justify-content-md-center text-center">
            <div className="mt-3">
              {parsedContent.map((item, index) =>
                item.type === "image" ? (
                  <div key={index} className="mt-3">
                    <img
                      src={item.data.imageSrc}
                      alt={item.data.altText}
                      style={{ maxWidth: "100%" }}
                    />
                    <p>Alt Text: {item.data.altText}</p>
                    <p>Title: {item.data.title}</p>
                    <p>Nombre de la imagen: {item.data.imageName}</p>
                  </div>
                ) : (
                  <p key={index}>{item.data}</p>
                )
              )}
              <div className="mt-3">
                <h5>Meta Information</h5>
                {metaData && (
                  <>
                    <p>Market: {metaData.market}</p>
                    <p>Article Number: {metaData.articleNumber}</p>
                    <p>Category: {metaData.category}</p>
                    <p>Suggested URL: {metaData.suggestedUrl}</p>
                    <p>Meta Title: {metaData.metaTitle}</p>
                    <p>Meta Description: {metaData.metaDescription}</p>
                  </>
                )}
              </div>

              <div className="mt-3">
                <h5>Datos Estructurados</h5>
                <pre>{schema}</pre>
              </div>
            </div>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default Editor;
