import React, { useState } from "react";
import { Container, Row, Form, InputGroup, FormControl } from "react-bootstrap";
import RichEditor from "../general/ckeditor";
import { handleFileChange } from "./fileUtils/fileUtils";

function Editor() {
  const [content, setContent] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("html");
  const [markdownContent, setMarkdownContent] = useState("");
  const [showMarkdownInput, setShowMarkdownInput] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleFormatChange = (e) => {
    const format = e.target.value;
    setSelectedFormat(format);
    if (format === "markdown") {
      setShowMarkdownInput(true);
    } else {
      setShowMarkdownInput(false);
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    await handleFileChange(file, selectedFormat, setContent); // Pasar setContent como argumento
    setShowEditor(true);
    if (selectedFormat === "markdown") {
      const result = await handleFileChange(file, selectedFormat);
      setMarkdownContent(result.value);
    }
  };

  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
        {!showEditor && (
          <div>
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
        {showEditor && <RichEditor articleContent={content} />}
        {showMarkdownInput && (
          <InputGroup className="mt-3">
            <InputGroup.Text>Markdown Content</InputGroup.Text>
            <FormControl as="textarea" value={markdownContent} readOnly />
          </InputGroup>
        )}
      </Row>
    </Container>
  );
}

export default Editor;
