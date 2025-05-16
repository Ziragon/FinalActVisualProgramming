import React from 'react';
import defcl from "../../styles/ReviewDefaultClasses.module.css";
import timeIcon from "../../styles/img/time-svgrepo-com.svg";

const ReviewRequestsBlock = ({item}) => //отображение запросов по статьям
{
    // const AcceptFunction = () => {

    // }
    // const DeclineFunction = () => {

    // }
    return (
        <div> 
            <div className={defcl.req_block}>
                <div className={defcl.right_float_block}>
                    <p className={defcl.p_date}>Request: {item.requestDate.toDateString().slice(4)}</p>
                </div>
                <p className={defcl.p_name}>{item.name}</p>
                <p className={defcl.p_author}>Author: {item.author}</p>
                <p className={defcl.p_abstract}>Abstract: {item.abstract}</p>
                <div className={defcl.time_div}>
                    <img src={timeIcon} alt="time" height='16px' width='16px'/>
                    <p className={defcl.p_exp_time}>Expected time: {item.expectedTime}</p>
                </div>
                <div className={defcl.buttons}>
                    <button 
                        // onClick={AcceptFunction()}
                        className='white_button'
                    >Decline</button>
                    <button 
                        // onClick={DeclineFunction()}
                        className='black_button'
                    >Accept Review</button>
                </div>
            </div>
        </div>
    );
}

export default ReviewRequestsBlock;