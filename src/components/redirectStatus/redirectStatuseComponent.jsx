import React from "react";
import { Table } from "react-bootstrap";

const RedirectStatusesComponent = ({ redirectStatuses }) => {
  return (
    <div>
      <h3>Redirect Statuses</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>URL</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(redirectStatuses).map(([url, status], index) => (
            <tr key={index}>
              <td>{url}</td>
              <td>{status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RedirectStatusesComponent;
