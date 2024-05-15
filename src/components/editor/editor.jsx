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
    setShowMarkdownInput(false);
    setShowEditor(false);
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    const result = await handleFileChange(file, selectedFormat);
    if (selectedFormat === "html") {
      setContent(result.content);
      setShowEditor(true);
    } else if (selectedFormat === "markdown") {
      setMarkdownContent(result.content);
      setShowMarkdownInput(true);
    }
  };

  return (
    <Container fluid="md">
      <Row className="justify-content-md-center text-center">
        {!showEditor && !showMarkdownInput && (
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
        {showEditor && selectedFormat === "html" && (
          <RichEditor articleContent={content} />
        )}
        {showMarkdownInput && selectedFormat === "markdown" && (
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
