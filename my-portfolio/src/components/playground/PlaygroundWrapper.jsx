import './PlaygroundItemWrapper.css';

function PlaygroundItemWrapper({ children, title, technologies, description }) {
    return (
        <div className='playground-item'>
            <div className="playground-header">
                <h3>{title}</h3>
                <div className="tech-badges">
                    {technologies.map((tech, index) => (
                        <span key={index} className={`tech-badge tech-${tech.toLowerCase()}`}>
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
            {description && <p className="playground-description">{description}</p>}
            <div className="playground-content">
                {children}
            </div>
        </div>
    );
}

export default PlaygroundItemWrapper;