import React, { useState, useEffect } from "react";
import {
  faArrowTurnUp,
  faRotateRight,
  faCircleCheck,
  faEquals,
} from "@fortawesome/free-solid-svg-icons";
import TooltipButton from "./TooltipButton";
import ModalLoading from "../modal/modal";
import compareContent from "../../modules/equals/equals";
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
    setModalText("Realizando comparación, por favor espere :D");
    setShowModal(true);

    setTimeout(async () => {
      const storedEditorContent = JSON.parse(localStorage.getItem("editorContent"));
      const storedArticleContent = JSON.parse(localStorage.getItem("articleContent"));

      if (!storedEditorContent) {
        setModalText("No se encontró contenido del editor");
        setShowModal(false);
        return;
      } else if(!storedArticleContent) {
        setModalText("No se encontró contenido de la web");
        setShowModal(false);
      }

      const result = await compareContent(storedEditorContent, storedArticleContent);
      if (result) {
        setModalText("No se encontraron diferencias en el contenido :)");
      } else {
        setModalText(
          "Se encontraron diferencias en el contenido :( por favor verifique"
        );
      }

      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    }, 100);
  };

  return (
    <div className="vertical-buttons">
      <TooltipButton
        icon={faEquals}
        onClick={handleEqualsClick}
        className="placeholder-button equals"
        tooltip="Equals"
      />
      <ModalLoading text={modalText} show={showModal} onClose={() => setShowModal(false)} />
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
