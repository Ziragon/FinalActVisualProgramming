import React, {useState} from 'react';
import defcl from "../../styles/ReviewDefaultClasses.module.css";
import CompletedReviewsBlock from './CompletedReviewsBlock';

const CompletedReviewsPage = () => {
    const [completedReviewsData, setCompletedReviewsData] = useState([{
        id: 1,
        name: "Advanced Neural Fignya",
        author: "Vasiliy brezhnev",
        completeDate: new Date("2025-05-01"),
        reviewScore: 4,
        decision: "Accept with Minor Revisions"
    }, {
        id: 2,
        name: "Advanced Neural Fignya",
        author: "Vasiliy brezhnev",
        completeDate: new Date("2025-05-01"),
        reviewScore: 2,
        decision: "Major Revisions Required"
    }, {
        id: 3,
        name: "Advanced Neural Fignya",
        author: "Vasiliy brezhnev",
        completeDate: new Date("2025-05-01"),
        reviewScore: 5,
        decision: "Accept as it"
    }])

    return (
        <div className={defcl.main_container}>
        {completedReviewsData.map((item) =>
            <div className={defcl.container}>
                <CompletedReviewsBlock
                    className={defcl.req_block}
                    item={item}
                />
            </div>
        )}
        </div>
    )
}

export default CompletedReviewsPage