import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const CopyButton = ({ text }) => {
  const handleCopy = () => {
    const formattedText = text
      .replace(/\n{2,}/g, '\n\n')
      .trim();

    navigator.clipboard
      .writeText(formattedText)
      .then(() => {
        console.log("Copied");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <Button onClick={handleCopy} variant="primary" className="mb-3">
      <FontAwesomeIcon icon={faCopy} />
    </Button>
  );
};

export default CopyButton;
