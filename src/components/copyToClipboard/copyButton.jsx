import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Notification from "../notification/notification"; // Importa el nuevo componente

const CopyButton = ({ text }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const handleCopy = () => {
    const formattedText = text.replace(/\n{2,}/g, "\n\n").trim();

    navigator.clipboard
      .writeText(formattedText)
      .then(() => {
        setNotificationMessage("Text copied to clipboard!");
        setNotificationType("success");
        setShowNotification(true);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setNotificationMessage("Failed to copy text.");
        setNotificationType("danger");
        setShowNotification(true);
      });
  };

  return (
    <>
      <Button onClick={handleCopy} variant="primary" className="mb-3">
        <FontAwesomeIcon icon={faCopy} />
      </Button>
      <Notification
        message={notificationMessage}
        type={notificationType}
        show={showNotification}
        setShow={setShowNotification}
      />
    </>
  );
};

export default CopyButton;
