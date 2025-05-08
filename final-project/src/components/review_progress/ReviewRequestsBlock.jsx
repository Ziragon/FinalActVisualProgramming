import React from 'react';
import cl from "../../styles/ReviewProgressPage.module.css";
import timeIcon from "../../styles/img/time-svgrepo-com.svg";

const ReviewRequestsBlock = ({item}) => //отображение запросов по статьям
{
    return (
        <div> 
            <div className={cl.req_block}>
                <div className={cl.date_div}>
                    <p className={cl.p_date}>Request: {item.requestDate.toDateString().slice(4)}</p>
                </div>
                <p className={cl.p_name}>{item.name}</p>
                <p className={cl.p_author}>Author: {item.author}</p>
                <p className={cl.p_abstract}>Abstract: {item.abstract}</p>
                <div className={cl.time_div}>
                    <img src={timeIcon} alt="time" height='16px' width='16px'/>
                    <p className={cl.p_exp_time}>Expected time: {item.expectedTime}</p>
                </div>
                <div className={cl.buttons}>
                    <input id="clickMe" type="button" value="Decline" onclick="doFunction();" className={cl.white_button}/>
                    <input id="clickMe" type="button" value="Accept Review" onclick="doFunction();" className={cl.black_button}/>
                </div>
            </div>
        </div>
    );
}

export default ReviewRequestsBlock;