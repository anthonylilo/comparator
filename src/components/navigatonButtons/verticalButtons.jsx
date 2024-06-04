import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTurnUp, faRotateRight, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import TooltipButton from './TooltipButton';
import './VerticalButtons.css';

const VerticalButtons = () => {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`vertical-buttons ${isVisible ? 'visible' : ''}`}>
            <a href="https://cors-anywhere.herokuapp.com/" target="_blank" rel="noopener noreferrer">
            <TooltipButton icon={faCircleCheck} className="placeholder-button api" tooltip="Enable API" />
            </a>
            <TooltipButton icon={faRotateRight} onClick={handleReset} className="placeholder-button reset" tooltip="Reset" />
            <TooltipButton icon={faArrowTurnUp} onClick={scrollToTop} className="scroll-button top" tooltip="Scroll to Top" />
        </div>
    );
};

export default VerticalButtons;