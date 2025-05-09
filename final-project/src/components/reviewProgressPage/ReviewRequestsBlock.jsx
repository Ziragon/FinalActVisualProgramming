import React from 'react';
import cl from "../../styles/ReviewProgressPage.module.css";
import timeIcon from "../../styles/img/time-svgrepo-com.svg";

const ReviewRequestsBlock = ({item}) => //отображение запросов по статьям
{
    const doFunction = () => {

    }
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
                    <button 
                        onClick={doFunction()}
                        className='white_button'
                    >Decline</button>
                    <button 
                        onClick={doFunction()}
                        className='black_button'
                    >Accept Review</button>
                </div>
            </div>
        </div>
    );
}

export default ReviewRequestsBlock;