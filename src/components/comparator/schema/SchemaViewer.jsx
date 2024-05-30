import React from "react";
import { Table, Container, Row } from "react-bootstrap";

const SchemaViewer = ({ schema }) => {
  console.log("schema", schema);

  // Determinar si el schema contiene @graph y seleccionar el primer elemento si es así
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
    <Container>
      <Row>
        <h3>Schema</h3>
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <th>Type</th>
              <td>{schemaData["@type"]}</td>
            </tr>
            <tr>
              <th>Headline</th>
              <td>{schemaData.headline}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{schemaData.description}</td>
            </tr>
          </tbody>
        </Table>
        {schemaData.image && (
          <Table striped bordered hover responsive>
            <tbody>
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
              </tr>
            </tbody>
          </Table>
        )}
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <th>Published Date</th>
              <td>{formatDate(schemaData.datePublished)}</td>
            </tr>
            <tr>
              <th>Modified Date</th>
              <td>{formatDate(schemaData.dateModified)}</td>
            </tr>
            <tr>
              <th>Author Type</th>
              <td>{getSafeProperty(schemaData, ["author", "@type"])}</td>
            </tr>
            <tr>
              <th>Author Name</th>
              <td>{getSafeProperty(schemaData, ["author", "name"])}</td>
            </tr>
            <tr>
              <th>Publisher Type</th>
              <td>{getSafeProperty(schemaData, ["publisher", "@type"])}</td>
            </tr>
            <tr>
              <th>Publisher Name</th>
              <td>{getSafeProperty(schemaData, ["publisher", "name"])}</td>
            </tr>
            {getSafeProperty(schemaData, ["publisher", "logo", "url"]) && (
              <tr>
                <th>Publisher Logo</th>
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
            </tr>
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default SchemaViewer;
