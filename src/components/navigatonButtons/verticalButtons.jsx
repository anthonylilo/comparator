import React, { useEffect, useState } from "react";
import CompareIcon from "../../assets/images/compare.svg";
import ResetIcon from "../../assets/images/reset.svg";
import ArrowIcon from "../../assets/images/arrow-up.svg";
import EnableIcon from "../../assets/images/enable.svg";
import TooltipButton from "./TooltipButton";
import ModalLoading from "../modal/ModalLoading";
import Equals from "../../services/Equals";
import "./VerticalButtons.css";

const VerticalButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsVisible(scrollTop > 150);
  };

  const handleReset = () => {
    localStorage.removeItem("editorContent");
    localStorage.removeItem("articleContent");
    localStorage.removeItem("articleBanner");
    localStorage.removeItem("imageCompareActive");
    localStorage.removeItem("imageCompareReport");
    window.location.reload();
  };

  const handleEqualsClick = async () => {
    setModalText("Making comparison, please wait.");
    setShowModal(true);

    try {
      const storedEditorContentRaw = localStorage.getItem("editorContent");
      const storedArticleContentRaw = localStorage.getItem("articleContent");
      const storedArticleBannerRaw = localStorage.getItem("articleBanner");

      const storedEditorContent = storedEditorContentRaw
        ? JSON.parse(storedEditorContentRaw)
        : null;
      const storedArticleContent = storedArticleContentRaw
        ? JSON.parse(storedArticleContentRaw)
        : null;
      const storedArticleBanner = storedArticleBannerRaw
        ? JSON.parse(storedArticleBannerRaw)
        : null;

      if (!storedEditorContent) throw new Error("Transformed text not found.");
      if (!storedArticleContent) throw new Error("Web text was not found.");

      const comparatorWithBanner = Array.isArray(storedArticleContent)
        ? storedArticleBanner
          ? [
              { type: "image", data: storedArticleBanner },
              ...storedArticleContent,
            ]
          : storedArticleContent
        : storedArticleBanner
          ? [{ type: "image", data: storedArticleBanner }]
          : [];

      const comparisonResult = await Equals(
        storedEditorContent,
        comparatorWithBanner,
      );

      if (comparisonResult?.imageReport) {
        localStorage.setItem(
          "imageCompareReport",
          JSON.stringify(comparisonResult.imageReport),
        );
        localStorage.setItem("imageCompareActive", "1");
      }

      setModalText(
        comparisonResult.hasDifferences
          ? "Differences were found in the contents. Please verify."
          : "No differences in content were found.",
      );
    } catch (error) {
      const safeErrorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while comparing the content.";
      setModalText(safeErrorMessage);
    } finally {
      window.setTimeout(() => setShowModal(false), 3000);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="vertical-buttons">
      <TooltipButton
        iconSrc={CompareIcon}
        iconType="custom"
        onClick={handleEqualsClick}
        className="placeholder-button equals"
        tooltip="Compare"
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
