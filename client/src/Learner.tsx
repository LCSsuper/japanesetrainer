import React from "react";
import { observer } from "mobx-react-lite";
import { useMobxStores } from "./hooks/useMobxStores";
import "./learner.css";

const ENTER = 13;

const Learner = observer(() => {
    const {
        learnerStore: {
            currentWord,
            nextWord,
            setCurrentGuess,
            currentGuess,
            guessIsCorrect,
            shouldShowAnswer,
            showAnswer,
            selectedLibrary,
            wordIndex,
        },
        settingsStore: { showDescription },
    } = useMobxStores();

    const onInputChange = (e: any) => {
        if (guessIsCorrect || shouldShowAnswer) return;
        setCurrentGuess(e.target.value);
    };

    const onKeyDown = (e: any) => {
        if ((!guessIsCorrect && !shouldShowAnswer) || e.keyCode !== ENTER)
            return;
        nextWord();
    };

    const onSkip = () => {
        nextWord();
    };

    const onShowAnswer = () => {
        showAnswer();
    };

    return (
        <div
            className={`learner-container ${guessIsCorrect ? "correct" : ""} ${
                shouldShowAnswer ? "incorrect" : ""
            }`}
        >
            <div id="count">{`${wordIndex + 1} of ${
                selectedLibrary.length
            }`}</div>
            <div id="word-container">{currentWord.word}</div>
            <div id="description-container">
                {showDescription || guessIsCorrect || shouldShowAnswer
                    ? currentWord.description
                    : ""}
            </div>
            <div id="answers-container">
                {guessIsCorrect || shouldShowAnswer
                    ? `Correct answers: ${currentWord.translation.join(", ")}`
                    : ""}
            </div>
            <div id="input-container">
                <div>
                    <div>
                        <p>
                            {guessIsCorrect || shouldShowAnswer
                                ? "(press Enter for the next word)"
                                : ""}
                        </p>
                        <input
                            type="text"
                            onChange={onInputChange}
                            value={currentGuess}
                            onKeyDown={onKeyDown}
                        />
                        <div id="button-container">
                            <button onClick={onSkip}>next</button>
                            <button
                                disabled={shouldShowAnswer || guessIsCorrect}
                                onClick={onShowAnswer}
                            >
                                show answer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Learner;
