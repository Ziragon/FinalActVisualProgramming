import React from "react";
import defcl from "../../styles/ReviewDefaultClasses.module.css";
import starIcon from "../../styles/img/star.svg"; // Импорт SVG

const StarRating = ({ rating = 0, maxStars = 5 }) => {
    return (
        <div className={defcl.star_rating}>
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <span
                        key={starValue}
                        className={starValue <= rating ? defcl.active : defcl.star}
                    >
                    <img 
                        src={starIcon} 
                        alt="Star" 
                        width="18" 
                        height="18"
                        className={defcl.star_icon}
                    />
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;