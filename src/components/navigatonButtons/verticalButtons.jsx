import './VerticalButtons.css';

const VerticalButtons = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="vertical-buttons">
            <button className="scroll-button" onClick={scrollToTop}>Top</button>
            <button className="placeholder-button">Placeholder 1</button>
            <button className="placeholder-button">Placeholder 2</button>
        </div>
    );
};

export default VerticalButtons;
