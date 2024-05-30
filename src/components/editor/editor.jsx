import React, { useState } from "react";
import { Container, Row, Form } from "react-bootstrap";
import { handleFileChange } from "./fileUtils/fileUtils";
import CardsImages from "../comparator/cards/cardsImages";
import SchemaViewer from "../comparator/schema/SchemaViewer";

function Editor() {
  const [content, setContent] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("html");
  const [parsedContent, setParsedContent] = useState([]);
  const [schema, setSchema] = useState(null);
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
            <Form.Group controlId="formFile" className="mb-3 mt-3">
              <Form.Control
                onChange={handleFileInputChange}
                type="file"
                accept=".docx"
              />
            </Form.Group>
          </div>
        )}
        {showEditor && selectedFormat === "html" && (
          <div className="mt-3 justify-content-md-center text-center">
            {parsedContent.map((item, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
            {metaData && (
              <div className="mt-3">
                <h5>Meta Information</h5>
                <p>Market: {metaData.market}</p>
                <p>Article Number: {metaData.articleNumber}</p>
                <p>Category: {metaData.category}</p>
                <p>
                  Suggested URL:{" "}
                  <a href={metaData.suggestedUrl}>{metaData.suggestedUrl}</a>
                </p>
                <p>Meta Title: {metaData.metaTitle}</p>
                <p>Meta Description: {metaData.metaDescription}</p>
              </div>
            )}
          </div>
        )}
        {showMarkdownInput && selectedFormat === "markdown" && (
          <div className="justify-content-md-center text-center">
            <div className="mt-3">
              {parsedContent.map((item, index) =>
                item.type === "image" ? (
                  <CardsImages key={index} image={item.data} />
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
                {schema && <SchemaViewer schema={schema} />}
              </div>
            </div>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default Editor;
