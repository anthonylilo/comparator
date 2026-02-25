import React from "react";
import { Container, Table } from "react-bootstrap";
import PropTypes from "prop-types";

const HttpsModule = ({ linkStatuses }) => {
  return (
    <Container className="mt-3">
      <h3>HTTP STATUS:</h3>
      <Table hover responsive>
        <thead>
          <tr>
            <th>URL</th>
            <th>Anchor Text</th>
            <th>Occurrences</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(linkStatuses).map(([url, value], index) => {
            const statusValue =
              value && typeof value === "object" ? value.status : value;

            const anchorsValue =
              value && typeof value === "object" && Array.isArray(value.anchors)
                ? value.anchors
                : ["Empty"];

            const occurrencesValue =
              value &&
              typeof value === "object" &&
              typeof value.occurrences === "number"
                ? value.occurrences
                : 1;

            return (
              <tr key={index}>
                <td>
                  {url}
                </td>
                <td>{anchorsValue.join(" | ")}</td>
                <td>{occurrencesValue}</td>
                <td>{statusValue}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

HttpsModule.propTypes = {
  linkStatuses: PropTypes.object.isRequired,
};

export default HttpsModule;
