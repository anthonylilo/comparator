import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";

const Notification = ({ message, type, show, setShow }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, setShow]);

  return (
    <>
      {show && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "2%",
            zIndex: 9999,
            maxWidth: "300px",
          }}
        >
          <Alert variant={type} onClose={() => setShow(false)} dismissible>
            <p>{message}</p>
          </Alert>
        </div>
      )}
    </>
  );
};

export default Notification;
