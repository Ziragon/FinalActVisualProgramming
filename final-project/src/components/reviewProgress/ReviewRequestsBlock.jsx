import React from 'react';
import defcl from "../../styles/ReviewDefaultClasses.module.css";

const ReviewRequestsBlock = ({ item, onAccept, onDecline }) => {
    return (
        <div> 
            <div className={defcl.req_block}>
                <div className={defcl.right_float_block}>
                    <p className={defcl.p_date}>Request: {item.requestDate.toDateString().slice(4)}</p>
                </div>
                <p className={defcl.p_name}>{item.name}</p>
                <p className={defcl.p_author}>Author: {item.author}</p>
                <p className={defcl.p_abstract}>Abstract: {item.abstract}</p>
                <div className={defcl.buttons}>
                    <button 
                        onClick={onDecline}
                        className='white_button'
                    >
                        Decline
                    </button>
                    <button 
                        onClick={onAccept}
                        className='black_button'
                    >
                        Accept Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewRequestsBlock;