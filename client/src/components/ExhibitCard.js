import React from 'react';
import './ExhibitCard.css';

const ExhibitCard = ({ exhibit }) => {
    return (
        <div className="exhibit-card">
            <h3>{exhibit.name}</h3>
            <p>{exhibit.description}</p>
            <p>{exhibit.hall.name}</p>
        </div>
    );
};

export default ExhibitCard;
