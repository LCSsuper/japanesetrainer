import React from "react";
import "react-range-slider-input/dist/style.css";
import "./settings.css";

const FAQ = () => {
    return (
        <div className="settings-container">
            <div className="header">
                How do I know if I have the right answer?
            </div>
            <i>
                As soon as the correct answer is given, the word will be
                highlighted green
            </i>
            <div className="header">
                Is the daily challenge the same for everyone?
            </div>
            <i>
                No. A random selection of the entire library is made for each
                user
            </i>
            <div className="header">
                Can I do the daily challenge for multiple languages in one day?
            </div>
            <i>
                No. You do the daily challenge in the language that is selected.
                It can be changed each day
            </i>
            <div className="header">
                What happens when I've finished all words in the training?
            </div>
            <i>
                Once all words have been shown once, the selection is shuffled
                again
            </i>
            <div className="header">What languages are supported?</div>
            <i>Currently only Japanese and Spanish are supported</i>
        </div>
    );
};

export default FAQ;
