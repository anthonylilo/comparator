import React from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const ModalLoading = ({ text, show, onClose }) => {
  return (
    <>
      <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
        <Modal.Body>{text ? <p>{text}</p> : <p>Loading...</p>}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ModalLoading.propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalLoading;
