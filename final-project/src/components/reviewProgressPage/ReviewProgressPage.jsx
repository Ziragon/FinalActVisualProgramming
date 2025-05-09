import React from 'react';
import ReviewRequestsBlock from './ReviewRequestsBlock';
import InProgressBlock from './InProgressBlock';
import cl from "../../styles/ReviewProgressPage.module.css";

const ReviewProgressPage = () =>
{
    const reviewData = [{
        "id": 1,
        "name": "Advanced Neural Fignya",
        "author": "Vasiliy brezhnev",
        "requestDate": new Date("2025-05-01"),
        "abstract": "In this review was presented how i like to gerych pls like and subscribe it took very long time to make it",
        "body": "Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ",
        "expectedTime": "4-5 hours"
    },{
        "id": 2,
        "name": "Advanced Neural Fignya",
        "author": "Vasiliy brezhnev",
        "requestDate": new Date("2025-01-05"),
        "abstract": "In this review was presented how i like to gerych",
        "body": "Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ",
        "expectedTime": "4-5 hours"
    }]

    const inProgressReview = [{
        "id": 1,
        "name": "Advanced Neural Fignya",
        "author": "Vasiliy brezhnev",
        "requestDate": new Date("2025-05-01"),
        "abstract": "In this review was presented how i like to gerych",
        "body": "Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ",
        "remaining": "2 days",
        "progress": 80,
    },{
        "id": 2,
        "name": "Advanced Neural Fignya",
        "author": "Vasiliy brezhnev",
        "requestDate": new Date("2025-01-05"),
        "abstract": "In this review was presented how i like to gerych",
        "body": "Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ",
        "remaining": "12 days",
        "progress": 30,
    }]

    return (
        <div className={cl.main_container}>
            <p className={cl.p_header}>New Review Requests</p>
            <div className={cl.container}>
                {reviewData.map((item) =>
                    <ReviewRequestsBlock
                        className={cl.req_block}
                        item={item}
                    />)}
            </div>
            <p className={cl.p_header}>In Progress Reviews</p>
            <div className={cl.container}>
                {inProgressReview.map((item) =>
                    <InProgressBlock
                        className={cl.req_block}
                        item={item}
                    />)}
            </div>
        </div>
    )
}

export default ReviewProgressPage;