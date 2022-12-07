import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useMobxStores } from "./hooks/useMobxStores";
import "./challenge.css";

const ENTER = 13;

const Timer = ({ timeLeft }: { timeLeft: number }) => {
    if (timeLeft === 0) return <></>;
    let text = `${timeLeft} seconds left`;
    if (timeLeft <= 34 && timeLeft >= 32) text = `Start in ${timeLeft - 31}`;
    if (timeLeft === 31) text = `Go!`;
    return (
        <div id="time" className={`${timeLeft <= 5 ? "warning" : ""}`}>
            {text}
        </div>
    );
};

const Challenge = observer(() => {
    const {
        challengeStore: {
            currentWord,
            currentGuess,
            guessIsCorrect,
            shouldShowAnswer,
            wordIndex,
            nextWord,
            setCurrentGuess,
            showAnswer,
            selectedLibrary,
            timeLeft,
            challengeOngoing,
            startChallenge,
            finished,
            score,
        },
        settingsStore: { showDescription },
    } = useMobxStores();

    const [showCopied, setShowCopied] = useState(false);

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
        nextWord(true);
    };

    const onShowAnswer = () => {
        showAnswer();
    };

    const copyScore = () => {
        setShowCopied(true);
        navigator.clipboard.writeText(
            `Daily challenge results:\n\nLanguage: ${score.language}\nCorrect guesses: ${score.correct}\nAnswers shown: ${score.answersShown}\nWords skipped: ${score.skipped}\n\nTry it yourself! https://trainer.lucasbos.dev`
        );
        setTimeout(() => setShowCopied(false), 2000);
    };

    return (
        <div className="challenge-container">
            <Timer timeLeft={timeLeft}></Timer>
            {!challengeOngoing && !finished && (
                <>
                    <div className="explanation">
                        <div>
                            In the daily challenge, you have to guess 10 random
                            words within 30 seconds.
                        </div>
                        <div>
                            You are allowed to show the answer and return to the
                            word later.
                        </div>
                    </div>
                    <button onClick={startChallenge} disabled={timeLeft > 0}>
                        Start challenge
                    </button>
                </>
            )}

            {finished && (
                <>
                    <div className="explanation">
                        <h4>
                            You've completed the daily challenge! Come back
                            tomorrow for a new challenge
                        </h4>
                        <div>{`Correct guesses: ${score.correct}`}</div>
                        <div>{`Answers shown: ${score.answersShown}`}</div>
                        <div>{`Words skipped: ${score.skipped}`}</div>
                    </div>
                    <button onClick={copyScore}>
                        {showCopied ? "Copied!" : "Copy score"}
                    </button>
                </>
            )}

            {challengeOngoing && (
                <div
                    className={`learner-container ${
                        guessIsCorrect ? "correct" : ""
                    } ${shouldShowAnswer ? "incorrect" : ""}`}
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
                            ? `Correct answers: ${currentWord.translation.join(
                                  ", "
                              )}`
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
                                        disabled={
                                            shouldShowAnswer || guessIsCorrect
                                        }
                                        onClick={onShowAnswer}
                                    >
                                        show answer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Challenge;
