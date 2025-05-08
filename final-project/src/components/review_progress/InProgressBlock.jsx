import React from 'react';
import cl from "../../styles/ReviewProgressPage.module.css";

const InProgressBlock = ({item}) =>
{
    return (
        <div> 
            <div className={cl.req_block}>
                <div className={cl.date_div}>
                    <p className={cl.p_date}>Due: {item.requestDate.toDateString().slice(4)}</p>
                </div>
                <p className={cl.p_name}>{item.name}</p>
                <p className={cl.p_author}>Author: {item.author}</p>
                <div className={cl.progress_bar_container}>
                    <div 
                        className={cl.progress_bar_fill}
                        style={{ width: `${item.progress}%` }}
                    ></div>
                </div>
                <div className={cl.flex_block}>
                    <p className={cl.p_progress}>Progress: {item.progress}%</p>
                    <p className={cl.p_date_remaining}>{item.remaining} remaining</p>
                    <div className={cl.buttons}>
                        <input id="clickMe" type="button" value="Continue Review" onclick="doFunction();" className={cl.black_button}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InProgressBlock;