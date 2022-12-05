import React from "react";
import { observer } from "mobx-react-lite";
import { useMobxStores } from "./hooks/useMobxStores";
import "./learner.css";
import { useEffect } from "react";

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
        settingsStore: { showRomanji },
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
            <div id="hiragana-container">{currentWord.hiragana}</div>
            <div id="romanji-container">
                {showRomanji || guessIsCorrect || shouldShowAnswer
                    ? currentWord.romanji
                    : ""}
            </div>
            <div id="answers-container">
                {guessIsCorrect || shouldShowAnswer
                    ? `Correct answers: ${currentWord.english.join(", ")}`
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
