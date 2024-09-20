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
          <th>Token</th> {/* Add new heading for Tokens */}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Type</th>
          <td>{schemaData["@type"]}</td>
          <td></td>
        </tr>
        <tr>
          <th>Headline</th>
          <td>{schemaData.headline}</td>
          <td>[node:title]</td> {/* Drupal token for Headline */}
        </tr>
        <tr>
          <th>Description</th>
          <td>{schemaData.description}</td>
          <td>[current-page:metatag:description]</td> {/* Drupal token for Description */}
        </tr>
        {schemaData.image && (
          <tr>
            <th>Image URL</th>
            <td>
              {Array.isArray(schemaData.image) ? (
                schemaData.image.map((img, idx) => (
                  <div key={idx}>
                    <a href={img} target="_blank" rel="noopener noreferrer">
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
            <td>[node:field_article_thumbnail_image:entity:thumbnail]</td> {/* Drupal token for Image */}
          </tr>
        )}
        <tr>
          <th>Published Date</th>
          <td>{formatDate(schemaData.datePublished)}</td>
          <td>[node:created:html_datetime]</td> {/* Drupal token for Published Date */}
        </tr>
        <tr>
          <th>Modified Date</th>
          <td>{formatDate(schemaData.dateModified)}</td>
          <td>[node:changed:html_datetime]</td> {/* Drupal token for Modified Date */}
        </tr>
        <tr>
          <th>Author</th>
          <td></td>
          <td></td> {/* Drupal token for Author */}
        </tr>
        <tr>
          <td>Type</td>
          <td>{getSafeProperty(schemaData, ["author", "@type"])}</td>
          <td></td> {/* Drupal token for Author Type */}
        </tr>
        <tr>
          <td>Name</td>
          <td>{getSafeProperty(schemaData, ["author", "name"])}</td>
          <td></td> {/* Drupal token for Author Name */}
        </tr>
        <tr>
          <th>Publisher</th>
          <td></td>
          <td></td> {/* Drupal token for Publisher */}
        </tr>
        <tr>
          <td>Type</td>
          <td>{getSafeProperty(schemaData, ["publisher", "@type"])}</td>
          <td></td> {/* Drupal token for Publisher Type */}
        </tr>
        <tr>
          <td>Name</td>
          <td>{getSafeProperty(schemaData, ["publisher", "name"])}</td>
          <td></td> {/* Drupal token for Publisher Name */}
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
            <td></td> {/* Drupal token for Publisher Logo */}
          </tr>
        )}
        <tr>
          <th>Main Entity of Page</th>
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
          <td>[node:url]</td> {/* Drupal token for Main Entity of Page */}
        </tr>
      </tbody>
    </Table>
    </Container>
  </Row>
</Container>
  );
};

export default SchemaViewer;
