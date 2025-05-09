import React from 'react';
import cl from "../../styles/ReviewProgressPage.module.css";

const CompletedReviewsBlock = ({item}) => {

    const doFunction = () => {

    }

    return (
        <div>
            <p className={cl.p_name}>{item.name}</p>
        </div>
    )
}

export default CompletedReviewsBlock;