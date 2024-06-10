import React, { useRef } from "react";
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
            answerRevealed,
            showAnswer,
            selectedLibrary,
            wordIndex,
            guessedTranslations,
            remainingAnswers,
        },
        settingsStore: { showDescription },
        routerStore: { setCurrentRoute },
    } = useMobxStores();

    const inputRef = useRef<HTMLInputElement | null>(null);

    const onInputChange = (e: any) => {
        if (!remainingAnswers.length) return;
        setCurrentGuess(e.target.value);
    };

    const onKeyDown = (e: any) => {
        if (![ONE, TWO, ENTER].includes(e.keyCode)) return;
        e.preventDefault();
        if (e.keyCode === ONE) nextWord();
        if (e.keyCode === TWO) showAnswer();
        if (!guessIsCorrect && !answerRevealed) return;
        if (e.keyCode === ENTER) {
            nextWord();
            inputRef.current?.blur();
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
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

    const getWordClassName = () => {
        if (guessIsCorrect) return "correct";
        if (answerRevealed) return "incorrect";
        return "";
    };

    return (
        <div className={`learner-container ${getWordClassName()}`}>
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
                {showDescription || guessIsCorrect || answerRevealed
                    ? currentWord.description
                    : ""}
            </div>
            <div id="guesses-container">
                {guessIsCorrect
                    ? `Guessed answers: ${
                          guessIsCorrect
                              ? guessedTranslations.join(", ")
                              : currentWord.translation.join(", ")
                      }`
                    : ""}
            </div>
            <div id="remaining-answers">
                {guessIsCorrect &&
                !answerRevealed &&
                remainingAnswers.length > 0
                    ? `Remaining answers: ${remainingAnswers.length}`
                    : ""}
            </div>
            <div id="answers-container">
                {(guessIsCorrect && remainingAnswers.length === 0) ||
                answerRevealed
                    ? `Correct answers: ${currentWord.translation.join(", ")}`
                    : ""}
            </div>
            <div id="input-container">
                <div>
                    <div>
                        <p>
                            {guessIsCorrect || answerRevealed
                                ? "(press Enter to continue)"
                                : ""}
                        </p>
                        <div id="input">
                            <input
                                ref={inputRef}
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
                                        answerRevealed ||
                                        remainingAnswers.length === 0
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
