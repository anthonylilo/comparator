import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Form, Col, ProgressBar } from "react-bootstrap";
import { FileUtils } from "../services/FileUtils";
import { ProjectSettings } from "../services/settings/ProjectSettings";
import CardsImages from "../components/cards/CardsImages";
import CardsText from "../components/cards/CardsText";
import MetaData from "../components/metaData/SeoChecker";
import SchemaViewer from "../components/schema/SchemaViewer";
import CopyButton from "../components/copyToClipboard/CopyButton";
import ModalLoading from "../components/modal/ModalLoading";
import { useSafeCountry } from "../services/CountryContext";

function Editor({ selectedFormat, projectName }) {
  const [parsedContent, setParsedContent] = useState([]);
  const [schema, setSchema] = useState(null);
  const [metaData, setMetaData] = useState({});
  const [redirections, setRedirections] = useState([]);
  const [showMarkdownInput, setShowMarkdownInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const settings = ProjectSettings();
  const { country } = useSafeCountry();
  const fileInputRef = useRef(null);

  useEffect(() => {
    setShowMarkdownInput(false);
  }, [selectedFormat]);

  useEffect(() => {
    if (settings?.config?.status === "inProgress") {
      setModalText(
        "We’re still working on this project, please keep in touch with us for more news."
      );
      setShowModal(true);
    }
  }, [settings]);

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];

    if (projectName === "Professional" && !country) {
      setModalText("Please select a country before uploading your document.");
      setShowModal(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (file) {
      setLoading(true);
      setProgress(0);

      try {
        const result = await FileUtils(
          file,
          selectedFormat,
          projectName,
          country,
        );
        setParsedContent(result.content);
        setSchema(result.schema);
        setMetaData(result.metaDataImport);
        setRedirections(result.redirections || []);
        setShowMarkdownInput(true);
      } catch (error) {
        console.error("Error loading file:", error);
        setModalText(
          error.message ||
            "An unexpected error occurred while processing the file."
        );
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const groupedContent = parsedContent.reduce((acc, item) => {
    if (item.type === "image") {
      acc.push({ type: "image", data: item.data });
      return acc;
    }

    if (item.type === "textCard") {
      if (acc.length === 0 || acc[acc.length - 1].type !== "textCards") {
        acc.push({ type: "textCards", data: [item.data] });
      } else {
        acc[acc.length - 1].data.push(item.data);
      }
      return acc;
    }

    // default: paragraphs
    if (acc.length === 0 || acc[acc.length - 1].type !== "paragraphs") {
      acc.push({ type: "paragraphs", data: [item.data] });
    } else {
      acc[acc.length - 1].data.push(item.data);
    }
    return acc;
  }, []);

  const getImageCompareIndex = (grouped, groupIndex) => {
    let count = 0;
    for (let i = 0; i <= groupIndex; i++) {
      if (grouped[i]?.type === "image") count++;
    }
    return count;
  };

  return (
    <Container fluid="md">
      <Row>
        {!showMarkdownInput && (
          <div>
            <Form.Group controlId="formFile" className="mb-3 mt-3">
              <Form.Control
                ref={fileInputRef}
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
                      <CardsImages
                        image={item.data}
                        compareIndex={getImageCompareIndex(
                          groupedContent,
                          index,
                        )}
                        compareSide="editor"
                        className="flex-grow-1"
                      />
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
                            ),
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
              {schema && Object.keys(schema).length > 0 && (
                <div className="mt-3">
                  <SchemaViewer schema={schema} />
                </div>
              )}
            </div>
          </div>
        )}
      </Row>
      <ModalLoading
        text={modalText}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </Container>
  );
}

export default Editor;
