import React from 'react';

const ScrambleText = ({ text = '', className = '' }) => {
    return (
        <span className={className} style={{ display: 'inline-block' }}>
            {text}
        </span>
    );
};

export default ScrambleText;
