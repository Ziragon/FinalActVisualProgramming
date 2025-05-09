import React, {useState} from 'react';
import ReviewRequestsBlock from './ReviewRequestsBlock';
import InProgressBlock from './InProgressBlock';
import defcl from "../../styles/ReviewDefaultClasses.module.css";
import clreqcom from "../../styles/ReviewProgressPage.module.css"

const ReviewProgressPage = () =>
{
    const [reviewData, setReviewData] = useState([{
        id: 1,
        name: "Advanced Neural Fignya",
        author: "Vasiliy brezhnev",
        requestDate: new Date("2025-05-01"),
        abstract: "In this review was presented how i like to gerych pls like and subscribe it took very long time to make it",
        body: "Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ",
        expectedTime: "4-5 hours"
    },{
        id: 2,
        name: "Advanced Neural Fignya",
        author: "Vasiliy brezhnev",
        requestDate: new Date("2025-01-05"),
        abstract: "In this review was presented how i like to gerych",
        body: "Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ",
        expectedTime: "4-5 hours"
    }]);

    const [inProgressReview, setInProgressReview] = useState([{
        id: 1,
        name: "Advanced Neural Fignya",
        author: "Vasiliy brezhnev",
        requestDate: new Date("2025-05-01"),
        abstract: "In this review was presented how i like to gerych",
        body: "Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ",
        remaining: "2 days",
        progress: 80,
    },{
        id: 2,
        name: "Advanced Neural Fignya",
        author: "Vasiliy brezhnev",
        requestDate: new Date("2025-01-05"),
        abstract: "In this review was presented how i like to gerych",
        body: "Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ Я ЛЮБЛЮ ГЕРЫЧ",
        remaining: "12 days",
        progress: 30,
    }]);

    return (
        <div className={defcl.main_container}>
            <div className={defcl.container}>
                <p className={defcl.p_header}>New Review Requests</p>
                {reviewData.map((item) =>
                    <ReviewRequestsBlock
                        className={defcl.req_block}
                        item={item}
                    />)}
            </div>
            <div className={defcl.container}>
                <p className={defcl.p_header}>In Progress Reviews</p>
                {inProgressReview.map((item) =>
                    <InProgressBlock
                        className={defcl.req_block}
                        item={item}
                    />)}
            </div>
        </div>
    )
}

export default ReviewProgressPage;