import React from "react";
import { Table, Container, Row } from "react-bootstrap";
import CopyButton from "../../components/copyToClipboard/copyButton";
const SchemaViewer = ({ schema }) => {
  const schemaData = schema["@graph"] ? schema["@graph"][0] : schema;
  if (!schemaData) {
    return <div>No schema data available</div>;
  }

  // Función para formatear fechas
  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleString() : "N/A";
  };

  // Función para obtener una propiedad de un objeto de forma segura
  const getSafeProperty = (obj, path) => {
    return path.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), obj);
  };

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
              {schemaData.image && (
                <tr>
                  <th>Image URL</th>
                  <td>
                    {Array.isArray(schemaData.image) ? (
                      schemaData.image.map((img, idx) => (
                        <div key={idx}>
                          <a
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {img}
                          </a>
                        </div>
                      ))
                    ) : (
                      <a
                        href={
                          schemaData.image.url
                            ? schemaData.image.url
                            : schemaData.image
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {schemaData.image.url
                          ? schemaData.image.url
                          : schemaData.image}
                      </a>
                    )}
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
                <td>{getSafeProperty(schemaData, ["author", "@type"])}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{getSafeProperty(schemaData, ["author", "name"])}</td>
              </tr>
              <tr>
                <th>Publisher</th>
                <td></td>
              </tr>
              <tr>
                <td>Type</td>
                <td>{getSafeProperty(schemaData, ["publisher", "@type"])}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{getSafeProperty(schemaData, ["publisher", "name"])}</td>
              </tr>
              {getSafeProperty(schemaData, ["publisher", "logo", "url"]) && (
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
                    href={
                      getSafeProperty(schemaData.mainEntityOfPage, ["@id"]) ||
                      schemaData.mainEntityOfPage
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getSafeProperty(schemaData.mainEntityOfPage, ["@id"]) ||
                      schemaData.mainEntityOfPage}
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
