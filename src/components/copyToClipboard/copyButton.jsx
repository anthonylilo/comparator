import React from "react";
import { Button } from "react-bootstrap";

const CopyButton = ({ text }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Text copied to clipboard");
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <Button onClick={handleCopy} variant="primary" className="mb-3">
      Copy
    </Button>
  );
};

export default CopyButton;