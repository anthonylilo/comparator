import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TooltipButton.css';

const TooltipButton = ({ icon, onClick, tooltip, className }) => {
    return (
        <button className={`tooltip-button ${className}`} onClick={onClick} title={tooltip}>
            <FontAwesomeIcon icon={icon} />
        </button>
    );
};

export default TooltipButton;