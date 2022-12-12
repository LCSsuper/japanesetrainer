import React from "react";
import { observer } from "mobx-react-lite";
import { useMobxStores } from "./hooks/useMobxStores";
import "./learner.css";

const ENTER = 13;
const ONE = 49;
const TWO = 50;

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
        routerStore: { setCurrentRoute },
    } = useMobxStores();

    const onInputChange = (e: any) => {
        if (guessIsCorrect || shouldShowAnswer) return;
        setCurrentGuess(e.target.value);
    };

    const onKeyDown = (e: any) => {
        if (![ONE, TWO, ENTER].includes(e.keyCode)) return;
        e.preventDefault();
        if (e.keyCode === ONE) nextWord();
        if (e.keyCode === TWO) showAnswer();
        if (!guessIsCorrect && !shouldShowAnswer) return;
        if (e.keyCode === ENTER) nextWord();
    };

    const onSkip = () => {
        nextWord();
    };

    const onShowAnswer = () => {
        showAnswer();
    };

    const onFocus = () => {
        setTimeout(() => {
            document.documentElement.scrollTop = 0;
        }, 100);
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
            <div
                id="range-explanation"
                onClick={() => setCurrentRoute("settings")}
            >
                The range of words can be changed in the settings
            </div>
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
                        <div id="input">
                            <input
                                type="text"
                                onChange={onInputChange}
                                value={currentGuess}
                                onKeyDown={onKeyDown}
                                onFocus={onFocus}
                            />
                        </div>
                        <div id="button-container">
                            <div>
                                <button onClick={onSkip}>next</button>
                                <span>Press 1</span>
                            </div>
                            <div>
                                <button
                                    disabled={
                                        shouldShowAnswer || guessIsCorrect
                                    }
                                    onClick={onShowAnswer}
                                >
                                    show answer
                                </button>
                                <span>Press 2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Learner;
