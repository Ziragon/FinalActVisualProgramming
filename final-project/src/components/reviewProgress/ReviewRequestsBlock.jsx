import React from 'react';
import defcl from "../../styles/ReviewDefaultClasses.module.css";

const ReviewRequestsBlock = ({ item, onAccept, onDownload, onViewArticle }) => {
    const hasFile = item.bodyFileId !== null;
    const hasContent = item.body && item.body.trim() !== '';

    return (
        <div> 
            <div className={defcl.req_block}>
                <div className={defcl.right_float_block}>
                    <p className={defcl.p_date}>Request: {item.requestDate.toDateString().slice(4)}</p>
                </div>
                <p className={defcl.p_name}>{item.name}</p>
                <p className={defcl.p_author}>Author: {item.author}</p>
                <p className={defcl.p_abstract}>Category: {item.category}</p>
                <div className={defcl.buttons}>
                    {hasFile ? (
                        <button 
                            onClick={onDownload}
                            className='white_button'
                        >
                            Download File
                        </button>
                    ) : hasContent ? (
                        <button 
                            onClick={onViewArticle}
                            className='white_button'
                        >
                            View Article
                        </button>
                    ) : null}
                    
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