import React, { useState } from "react";
import { Container, Row, Form, InputGroup, FormControl } from "react-bootstrap";
import RichEditor from "../general/ckeditor";
import { handleFileChange } from "./fileUtils/fileUtils";

function Editor() {
  const [content, setContent] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("html");
  const [markdownContent, setMarkdownContent] = useState("");
  const [images, setImages] = useState([]);
  const [schema, setSchema] = useState("");
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
      setImages(result.images);
      setSchema(result.schema);
      setShowEditor(true);
    } else if (selectedFormat === "markdown") {
      setMarkdownContent(result.text);
      setImages(result.images);
      setSchema(result.schema);
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
              <h5>Images</h5>
              {images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.imageSrc}
                    alt={image.altText}
                    style={{ maxWidth: "100%" }}
                  />
                  <p>Alt Text: {image.altText}</p>
                  <p>Title: {image.title}</p>
                  <p>Nombre de la imagen: {image.imageName}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <h5>Datos Estructurados</h5>
              <input type="text" readOnly value={schema} />
            </div>
          </div>
        )}
        {showMarkdownInput && selectedFormat === "markdown" && (
          <div className="justify-content-md-center text-center">
            <InputGroup className="mt-3">
              <InputGroup.Text>Markdown Content</InputGroup.Text>
              <FormControl as="textarea" value={markdownContent} readOnly />
            </InputGroup>
            <div className="mt-3">
              <h5>Images</h5>
              {images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.imageSrc}
                    alt={image.altText}
                    style={{ maxWidth: "100%" }}
                  />
                  <p>Alt Text: {image.altText}</p>
                  <p>Title: {image.title}</p>
                  <p>Nombre de la imagen: {image.imageName}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <h5>Datos Estructurados</h5>
              <input type="text" readOnly value={schema} />
            </div>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default Editor;
