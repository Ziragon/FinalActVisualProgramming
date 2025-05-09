import React from 'react';
import defcl from "../../styles/ReviewDefaultClasses.module.css";

const InProgressBlock = ({item}) => {
    const doFunction = () => {

    }
    return (
        <div> 
            <div className={defcl.req_block}>
                <div className={defcl.right_float_block}>
                    <p className={defcl.p_date}>Due: {item.requestDate.toDateString().slice(4)}</p>
                </div>
                <p className={defcl.p_name}>{item.name}</p>
                <p className={defcl.p_author}>Author: {item.author}</p>
                <div className={defcl.progress_bar_container}>
                    <div 
                        className={defcl.progress_bar_fill}
                        style={{ width: `${item.progress}%` }}
                    ></div>
                </div>
                <div className={defcl.flex_block_inprog}>
                    <p className={defcl.p_progress}>Progress: {item.progress}%</p>
                    <p className={defcl.p_date_remaining}>{item.remaining} remaining</p>
                    <div className={defcl.buttons}>
                        <button 
                            onClick={doFunction()}
                            className='black_button'
                        >Continue Review</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InProgressBlock;