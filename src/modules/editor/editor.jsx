import React, { useState, useEffect } from "react";
import { Container, Row, Form } from "react-bootstrap";
import { handleFileChange } from "./fileUtils/fileUtils";
import CardsImages from "../../components/cards/cardsImages";
import SchemaViewer from "../../components/schema/SchemaViewer";

function Editor({ selectedFormat }) {
  const [content, setContent] = useState("");
  const [parsedContent, setParsedContent] = useState([]);
  const [schema, setSchema] = useState(null);
  const [metaData, setMetaData] = useState({});
  const [redirections, setRedirections] = useState([]);
  const [showMarkdownInput, setShowMarkdownInput] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    setShowMarkdownInput(false);
    setShowEditor(false);
  }, [selectedFormat]);

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
      setRedirections(result.redirections || []);
      setShowMarkdownInput(true);
    }
  };

  return (
    <Container fluid="md">
      <Row>
        {!showEditor && !showMarkdownInput && (
          <div>
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
              <div id="editor">
                {parsedContent.map((item, index) =>
                  item.type === "image" ? (
                    <CardsImages key={index} image={item.data} />
                  ) : (
                    <p key={index}>{item.data}</p>
                  )
                )}
              </div>
              <div className="mt-3">
                <h5>Meta Information</h5>
                {metaData && (
                  <>
                    <p>
                      <strong>Market:</strong> {metaData.market}
                    </p>
                    <p>
                      <strong>Article Number:</strong> {metaData.articleNumber}
                    </p>
                    <p>
                      <strong>Category:</strong> {metaData.category}
                    </p>
                    {metaData.oldUrl && (
                      <p>
                        <strong>Actual url:</strong> {metaData.oldUrl}
                      </p>
                    )}
                    <p>
                      <strong>Suggested URL:</strong> {metaData.suggestedUrl}
                    </p>
                    <p>
                      <strong>Meta Title:</strong> {metaData.metaTitle}
                    </p>
                    <p>
                      <strong>Meta Description:</strong>{" "}
                      {metaData.metaDescription}
                    </p>
                  </>
                )}
              </div>
              <div className="mt-3">
                {redirections.length > 0 && (
                  <div>
                    <h5>Redirections</h5>
                    <ul>
                      {redirections.map((redirect, index) => (
                        <li key={index}>
                          <a href={redirect.url}>{redirect.text}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
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
