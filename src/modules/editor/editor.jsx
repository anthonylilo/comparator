import React, { useState, useEffect } from "react";
import { Container, Row, Form, Col } from "react-bootstrap";
import { handleFileChange } from "../../services/fileUtils";
import CardsImages from "../../components/cards/cardsImages";
import SchemaViewer from "../../components/schema/SchemaViewer";
import CopyButton from "../../components/copyToClipboard/copyButton";

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
      setParsedContent(result.content);
      setSchema(result.schema);
      setMetaData(result.metaDataImport);
      setRedirections(result.redirections || []);
      setShowEditor(true);
    } else if (selectedFormat === "markdown") {
      setParsedContent(result.content);
      setSchema(result.schema);
      setMetaData(result.metaDataImport);
      setRedirections(result.redirections || []);
      setShowMarkdownInput(true);
    }
  };

  const groupedContent = parsedContent.reduce((acc, item) => {
    if (item.type === "image") {
      acc.push({ type: "image", data: item.data });
    } else {
      if (acc.length === 0 || acc[acc.length - 1].type === "image") {
        acc.push({ type: "paragraphs", data: [item.data] });
      } else {
        acc[acc.length - 1].data.push(item.data);
      }
    }
    return acc;
  }, []);

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
          <div className="justify-content-md-center">
            <div className="mt-3">
              <div id="editor">
                {groupedContent.map((item, index) => (
                  <div key={index} className="d-flex align-items-center">
                    {item.type === "image" ? (
                      <CardsImages image={item.data} className="flex-grow-1" />
                    ) : (
                      <Row>
                        <Col md={10}>
                          {item.data.map((paragraph, paraIndex) => (
                            <div
                              key={paraIndex}
                              className="flex-grow-1"
                              dangerouslySetInnerHTML={{ __html: paragraph }}
                            />
                          ))}
                        </Col>
                        <Col md={2}>
                          <CopyButton text={item.data.join("\n\n")} />
                        </Col>
                      </Row>
                    )}
                  </div>
                ))}
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
        {showMarkdownInput && selectedFormat === "markdown" && (
          <div className="justify-content-md-center">
            <div className="mt-3">
              <div id="editor">
                {groupedContent.map((item, index) => (
                  <div key={index} className="d-flex align-items-center">
                    {item.type === "image" ? (
                      <CardsImages image={item.data} className="flex-grow-1" />
                    ) : (
                      <Row>
                        <Col md={10}>
                          {item.data.map((paragraph, paraIndex) => (
                            <p key={paraIndex} className="flex-grow-1">
                              {paragraph}
                            </p>
                          ))}
                        </Col>
                        <Col md={2}>
                          <CopyButton text={item.data.join("\n\n")} />
                        </Col>
                      </Row>
                    )}
                  </div>
                ))}
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
