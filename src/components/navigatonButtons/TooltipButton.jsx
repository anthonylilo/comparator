import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TooltipButton.css';

const TooltipButton = ({ iconType, iconSrc, faIcon, onClick, tooltip, className }) => {
    return (
        <button className={`tooltip-button ${className}`} onClick={onClick}>
            {iconType === 'fontawesome' ? (
                <FontAwesomeIcon icon={faIcon} />
            ) : (
                <img src={iconSrc} alt={tooltip} className="custom-svg-icon" />
            )}
            <span className="tooltip-text">{tooltip}</span>
        </button>
    );
};

export default TooltipButton;