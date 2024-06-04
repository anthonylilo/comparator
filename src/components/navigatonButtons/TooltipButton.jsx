import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TooltipButton.css';

const TooltipButton = ({ icon, onClick, tooltip, className }) => {
    return (
        <button className={`tooltip-button ${className}`} onClick={onClick}>
            <FontAwesomeIcon icon={icon} />
            <span className="tooltip-text">{tooltip}</span>
        </button>
    );
};

export default TooltipButton;