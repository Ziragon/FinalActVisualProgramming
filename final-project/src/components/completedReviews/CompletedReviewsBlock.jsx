import React from 'react';
import defcl from "../../styles/ReviewDefaultClasses.module.css";

const CompletedReviewsBlock = ({item}) => {

    const doFunction = () => {

    }

    return (
        <div className={defcl.rew_complete_block}>
            <div className={defcl.right_float_block}>
                <p className={defcl.p_date}>Due: {item.completeDate.toDateString().slice(4)}</p>
            </div>
            <p className={defcl.p_name}>{item.name}</p>
            <p className={defcl.p_author}>Author: {item.author}</p>
            <hr className={defcl.hr}/>
        </div>
    )
}

export default CompletedReviewsBlock;