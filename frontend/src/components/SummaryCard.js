import React from 'react';
import './SummaryCard.css'; // I will create this file later

const SummaryCard = ({ title, value }) => {
    return (
        <div className="summary-card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};

export default SummaryCard;
