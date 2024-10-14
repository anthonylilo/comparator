import React, { useState, useEffect } from "react";
import CompareIcon from "../../assets/images/compare.svg";
import ResetIcon from "../../assets/images/reset.svg";
import ArrowIcon from "../../assets/images/arrow-up.svg";
import EnableIcon from "../../assets/images/enable.svg";
import TooltipButton from "./TooltipButton";
import ModalLoading from "../modal/modal";
import compareContent from "../../services/equals";
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
    localStorage.removeItem("editorContent");
    localStorage.removeItem("articleContent");
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [modalText, setModalText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleEqualsClick = async () => {
    setModalText("Making comparison, please wait :D");
    setShowModal(true);

    setTimeout(async () => {
      const storedEditorContent = JSON.parse(
        localStorage.getItem("editorContent")
      );
      const storedArticleContent = JSON.parse(
        localStorage.getItem("articleContent")
      );

      if (!storedEditorContent && !storedArticleContent) {
        setModalText("Error: There's not any content.");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
        return;
      } else if (!storedEditorContent) {
        setModalText("Error: Transformed text not found");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
        return;
      } else if (!storedArticleContent) {
        setModalText("Error: Web text was not found.");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
        return;
      }

      try {
        // Llamar a la función compareContent desde equals.js
        const comparisonResult = await compareContent(
          storedEditorContent,
          storedArticleContent
        );

        if (comparisonResult.hasDifferences) {
          setModalText(
            "Differences were found in the contents :( please verify"
          );
        } else {
          setModalText("No differences in content were found :)");
        }
      } catch (error) {
        console.error("Error:", error);
        setModalText("An error occurred while comparing the content.");
      } finally {
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
      }
    }, 100);
  };

  return (
    <div className="vertical-buttons">
      <TooltipButton
        iconSrc={CompareIcon}
        iconType="custom"
        onClick={handleEqualsClick}
        className="placeholder-button equals"
        tooltip="Comparate"
      />
      <ModalLoading
        text={modalText}
        show={showModal}
        onClose={() => setShowModal(false)}
      />
      <a
        href="https://cors-anywhere.herokuapp.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TooltipButton
          iconType="custom"
          iconSrc={EnableIcon}
          className="placeholder-button api"
          tooltip="Enable API"
        />
      </a>
      <TooltipButton
        iconSrc={ResetIcon}
        iconType="custom"
        onClick={handleReset}
        className="placeholder-button reset"
        tooltip="Reset"
      />
      <TooltipButton
        iconSrc={ArrowIcon}
        iconType="custom"
        onClick={scrollToTop}
        className="scroll-button top"
        tooltip="Scroll to Top"
      />
    </div>
  );
};

export default VerticalButtons;
