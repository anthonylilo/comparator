import React, { useState, useEffect } from "react";
import { Container, Row, Form, Col, ProgressBar } from "react-bootstrap";
import { handleFileChange } from "../../services/fileUtils";
import CardsImages from "../../components/cards/cardsImages";
import MetaData from "../../components/metaData/metaData";
import SchemaViewer from "../../components/schema/SchemaViewer";
import CopyButton from "../../components/copyToClipboard/copyButton";

function Editor({ selectedFormat, projectName }) {
  const [parsedContent, setParsedContent] = useState([]);
  const [schema, setSchema] = useState(null);
  const [metaData, setMetaData] = useState({});
  const [redirections, setRedirections] = useState([]);
  const [showMarkdownInput, setShowMarkdownInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setShowMarkdownInput(false);
  }, [selectedFormat]);

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setProgress(0);

      try {
        const result = await handleFileChange(
          file,
          selectedFormat,
          projectName
        );
        setParsedContent(result.content);
        setSchema(result.schema);
        setMetaData(result.metaDataImport);
        setRedirections(result.redirections || []);
        setShowMarkdownInput(true);
      } catch (error) {
        console.error("Error loading file:", error);
      } finally {
        setLoading(false);
      }
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
        {!showMarkdownInput && (
          <div>
            <Form.Group controlId="formFile" className="mb-3 mt-3">
              <Form.Control
                onChange={handleFileInputChange}
                type="file"
                accept=".docx"
              />
            </Form.Group>
            {loading && (
              <ProgressBar
                variant="success"
                animated
                now={100}
                className="mt-2"
              />
            )}
          </div>
        )}
        {showMarkdownInput && (
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
                          {item.data.map((paragraph, paraIndex) =>
                            typeof paragraph === "string" &&
                            paragraph.startsWith("<") ? (
                              <div
                                key={paraIndex}
                                className="flex-grow-1"
                                dangerouslySetInnerHTML={{ __html: paragraph }}
                              />
                            ) : (
                              <p key={paraIndex} className="flex-grow-1">
                                {paragraph}
                              </p>
                            )
                          )}
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
                {metaData && <MetaData metaData={metaData} />}
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
