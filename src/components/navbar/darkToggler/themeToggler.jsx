import {faMoon} from "@fortawesome/free-solid-svg-icons";
import TooltipButton from "../../navigatonButtons/TooltipButton";
import React, { useState, useEffect } from 'react';

function DarkToggler() {
    const storedTheme = localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    // Apply theme to the document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    // Save theme to local storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <TooltipButton
    iconType="fontawesome"  
    faIcon={faMoon}
      onClick={toggleTheme}
      className="placeholder-button darkMode"
      tooltip={"Switch theme"}
    />
  
  );
}

export default DarkToggler;