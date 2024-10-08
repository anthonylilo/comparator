// TooltipButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TooltipButton = ({ icon, onClick, className, tooltip, iconType }) => {
  return (
    <button className={`tooltip-button ${className}`} onClick={onClick} title={tooltip}>
      {iconType === 'svg' ? (
        <img src={icon} alt={tooltip} />
      ) : (
        <FontAwesomeIcon icon={icon} />
      )}
      
    </button>
  );
};

export default TooltipButton;
