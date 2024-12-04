import React from 'react';
import './ExhibitionCard.css';

const ExhibitionCard = ({ exhibition }) => {
    if (!exhibition) {
        return <div className="exhibition-card">Данные о выставке отсутствуют</div>;
    }

    const { title, description } = exhibition;

    return (
        <div className="exhibition-card">
            <div className="exhibition-card-header">
                <h3>{title || 'Без названия'}</h3>
            </div>
            <div className="exhibition-card-body">
                <p>{description || 'Описание отсутствует'}</p>
            </div>
        </div>
    );
};

ExhibitionCard.defaultProps = {
    exhibition: {
        title: 'Без названия',
        description: 'Описание отсутствует',
    },
};

export default ExhibitionCard;
    