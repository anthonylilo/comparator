import React from "react";
import { Table, Container, Row } from "react-bootstrap";

// Converts a value into an array (keeps arrays, wraps non-null values, returns empty array for null/undefined).
const toArray = (value) =>
  Array.isArray(value) ? value : value != null ? [value] : [];

const SchemaViewer = ({ schema }) => {
  const schemaData = schema?.["@graph"] ? schema["@graph"][0] : schema;

  if (!schemaData) {
    return <div>No schema data available</div>;
  }

  // Formats date strings safely (falls back to original value or "N/A").
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? dateString : date.toLocaleString();
  };

  // Safely retrieves a nested property from an object using a path array.
  const getNestedValue = (sourceObject, pathSegments) =>
    pathSegments.reduce(
      (currentValue, segment) =>
        currentValue && currentValue[segment] != null
          ? currentValue[segment]
          : null,
      sourceObject,
    );

  // Normalize speakable and image fields into arrays for consistent rendering.
  const speakables = toArray(schemaData?.speakable);
  const images = toArray(schemaData?.image);

  const mainEntityOfPageHref =
    getNestedValue(schemaData.mainEntityOfPage, ["@id"]) ||
    schemaData.mainEntityOfPage;

  return (
    <Container className="mt-3">
      <Row>
        <h3>Schema</h3>
        <Container className="tableContainer">
          <Table hover responsive className="schemaTable schema">
            <thead>
              <tr>
                <th></th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th>Type</th>
                <td>{schemaData["@type"]}</td>
              </tr>

              <tr>
                <th>@id</th>
                <td>
                  <a
                    href={mainEntityOfPageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mainEntityOfPageHref}
                  </a>
                </td>
              </tr>

              <tr>
                <th>
                  Headline
                  <br />
                  [node:title]
                </th>
                <td>{schemaData.headline}</td>
              </tr>

              <tr>
                <th>
                  Description
                  <br />
                  [current-page:metatag:description]
                </th>
                <td>{schemaData.description}</td>
              </tr>

              {images.length > 0 && (
                <tr>
                  <th>Image URL</th>
                  <td>
                    {images.map((imageItem, index) => {
                      const href =
                        typeof imageItem === "string"
                          ? imageItem
                          : imageItem?.url;

                      return href ? (
                        <div key={`image-${index}`}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {href}
                          </a>
                        </div>
                      ) : null;
                    })}
                  </td>
                </tr>
              )}

              <tr>
                <th>
                  Published Date
                  <br />
                  [node:created:html_datetime]
                </th>
                <td>{formatDate(schemaData.datePublished)}</td>
              </tr>

              <tr>
                <th>
                  Modified Date
                  <br />
                  [node:changed:html_datetime]
                </th>
                <td>{formatDate(schemaData.dateModified)}</td>
              </tr>

              <tr>
                <th>Author</th>
                <td></td>
              </tr>

              <tr>
                <td>Type</td>
                <td>{getNestedValue(schemaData, ["author", "@type"])}</td>
              </tr>

              <tr>
                <td>Name</td>
                <td>{getNestedValue(schemaData, ["author", "name"])}</td>
              </tr>

              <tr>
                <td>URL</td>
                <td>{getNestedValue(schemaData, ["author", "url"])}</td>
              </tr>

              <tr>
                <th>Speakable</th>
                <td></td>
              </tr>

              {speakables.length > 0 ? (
                speakables.map((speakableItem, speakableIndex) => {
                  const types = toArray(speakableItem?.["@type"]);
                  const xpaths = toArray(speakableItem?.xpath);
                  const selectors = toArray(speakableItem?.cssSelector);

                  return (
                    <React.Fragment key={`speakable-${speakableIndex}`}>
                      <tr>
                        <td>@type</td>
                        <td>{types.join(", ") || "—"}</td>
                      </tr>

                      {xpaths.length > 0 ? (
                        xpaths.map((xpathItem, xpathIndex) => (
                          <tr key={`xpath-${speakableIndex}-${xpathIndex}`}>
                            <td>XPath {xpathIndex + 1}</td>
                            <td>{xpathItem}</td>
                          </tr>
                        ))
                      ) : selectors.length > 0 ? (
                        selectors.map((selectorItem, selectorIndex) => (
                          <tr key={`css-${speakableIndex}-${selectorIndex}`}>
                            <td>cssSelector {selectorIndex + 1}</td>
                            <td>{selectorItem}</td>
                          </tr>
                        ))
                      ) : (
                        <tr key={`selectors-empty-${speakableIndex}`}>
                          <td>Selectors</td>
                          <td>—</td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td>Copy</td>
                  <td>
                    /html/head/title,
                    /html/head/meta[@name='description']/@content
                  </td>
                </tr>
              )}

              <tr>
                <th>Publisher</th>
                <td></td>
              </tr>

              <tr>
                <td>Type</td>
                <td>{getNestedValue(schemaData, ["publisher", "@type"])}</td>
              </tr>

              <tr>
                <td>Name</td>
                <td>{getNestedValue(schemaData, ["publisher", "name"])}</td>
              </tr>

              {getNestedValue(schemaData, ["publisher", "logo", "url"]) && (
                <tr>
                  <td>Logo</td>
                  <td>
                    <a
                      href={schemaData.publisher.logo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {schemaData.publisher.logo.url}
                    </a>
                  </td>
                </tr>
              )}

              <tr>
                <th>
                  Main Entity of Page
                  <br />
                  [node:url]
                </th>
                <td>
                  <a
                    href={mainEntityOfPageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {mainEntityOfPageHref}
                  </a>
                </td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </Row>
    </Container>
  );
};

export default SchemaViewer;
