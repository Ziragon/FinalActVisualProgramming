import React, { useState } from 'react';
import defcl from "../../styles/ReviewDefaultClasses.module.css";
import StarRating from './StarRating';
import ReviewDetailsModal from './ReviewDetailsModal.jsx';

const CompletedReviewsBlock = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fullReviewData = {
    ...item,
    technicalComments: "The research demonstrates solid technical quality with appropriate methodology.",
    originalityComments: "The work presents novel insights into the field of neural networks.",
    presentationComments: "The paper is well-organized but could benefit from clearer figures.",
    authorComments: "Please consider revising the methodology section for clarity.",
    editorComments: "This paper makes a significant contribution to the field.",
    attachments: [
      { name: "review_notes.pdf" },
      { name: "supplementary_comments.docx" }
    ]
  };

  return (
    <div className={defcl.rew_complete_block}>
      <div className={defcl.right_float_block}>
        <p className={defcl.p_date}>Completed: {item.completeDate.toDateString().slice(4)}</p>
      </div>
      <p className={defcl.p_name}>{item.name}</p>
      <p className={defcl.p_author}>Author: {item.author}</p>
      <hr className={defcl.hr}/>
      <div className={defcl.flex_block_comp}>
        <p className={defcl.p_rew_score}>Review Score: </p>
        <p className={defcl.p_right_float}>Decision:</p>
        <div className={defcl.right_float_block}>
          <p className={defcl.p_date}>{item.decision}</p>
        </div>
      </div>
      <div className={defcl.star_block}>
        <StarRating rating={item.reviewScore} />
      </div>
      <div className={defcl.view_button_block}>
        <button 
          onClick={() => setIsModalOpen(true)}
          className='black_button_cover'
        >
          View Full Review
        </button>
      </div>
      
      {isModalOpen && (
        <ReviewDetailsModal 
          review={fullReviewData} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default CompletedReviewsBlock;