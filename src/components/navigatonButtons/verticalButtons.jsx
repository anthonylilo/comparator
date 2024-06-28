import React, { useState, useEffect } from "react";
import {
  faArrowTurnUp,
  faRotateRight,
  faCircleCheck,
  faEquals,
} from "@fortawesome/free-solid-svg-icons";
import TooltipButton from "./TooltipButton";
import { compareContent } from "../../modules/equals/equals";
import "./VerticalButtons.css";

const VerticalButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 150) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const handleReset = () => {
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleEqualsClick = () => {
    const editorContent = document.getElementById("editor").innerText;
    const comparatorContent = document.getElementById("comparator").innerHTML;
    const result = compareContent(editorContent, comparatorContent);
    alert(result ? "The contents are equal." : "The contents are not equal.");
  };

  return (
    <div className="vertical-buttons">
      <TooltipButton
        icon={faEquals}
        onClick={handleEqualsClick}
        className="placeholder-button equals"
        tooltip="Equals"
      />
      <a
        href="https://cors-anywhere.herokuapp.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TooltipButton
          icon={faCircleCheck}
          className="placeholder-button api"
          tooltip="Enable API"
        />
      </a>
      <TooltipButton
        icon={faRotateRight}
        onClick={handleReset}
        className="placeholder-button reset"
        tooltip="Reset"
      />
      <TooltipButton
        icon={faArrowTurnUp}
        onClick={scrollToTop}
        className="scroll-button top"
        tooltip="Scroll to Top"
      />
    </div>
  );
};

export default VerticalButtons;
