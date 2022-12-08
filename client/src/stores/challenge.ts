import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";

import japaneseLibrary from "./data/0-1000-japanese.json";
import spanishLibrary from "./data/0-1000-spanish.json";
import SettingsStore from "./settings";
import { shuffle } from "./utils/shuffle";

export type Word = {
    word: string;
    description: string;
    translation: string[];
};

type Score = {
    correct: number;
    skipped: number;
    answersShown: number;
    language: string;
};

const libraries = {
    japanese: japaneseLibrary,
    spanish: spanishLibrary,
};

const challengeLength = 3;

export default class ChallengeStore {
    settingsStore: SettingsStore;
    wordIndex: number = 0;
    currentGuess: string = "";
    guessIsCorrect: boolean = false;
    shouldShowAnswer: boolean = false;
    library: Word[] = [];
    selectedLibrary: Word[] = [];
    score: Score = {
        correct: 0,
        skipped: 0,
        answersShown: 0,
        language: "japanese",
    };
    challengeOngoing: boolean = false;
    timeLeft: number = 0;
    intervalId: NodeJS.Timer | undefined = undefined;
    finished: boolean = false;
    wordsShown: Set<number> = new Set<number>();
    wordsSkipped: Set<number> = new Set<number>();
    wordsCorrect: Set<number> = new Set<number>();

    constructor(settingsStore: SettingsStore) {
        makeAutoObservable(this);
        this.settingsStore = settingsStore;
        autoBind(this);
        this.initialize();
    }

    initialize = () => {
        this.library = [...libraries[this.settingsStore.language]];
        this.score = {
            correct: 0,
            skipped: 0,
            answersShown: 0,
            language: this.settingsStore.language,
        };
        shuffle(this.library);
        let index = Math.floor(Math.random() * 1000);
        if (index >= this.library.length - challengeLength)
            index = index - challengeLength;
        this.selectedLibrary = libraries[this.settingsStore.language].slice(
            index,
            index + challengeLength
        );
        this.wordIndex = 0;
        this.guessIsCorrect = false;
        this.shouldShowAnswer = false;
        this.getScore();
    };

    get currentWord(): Word {
        return this.selectedLibrary[this.wordIndex];
    }

    setCurrentGuess = (guess: string) => {
        this.currentGuess = guess;
        this.checkCurrentGuess();
    };

    checkCurrentGuess = () => {
        if (
            this.currentWord.translation.includes(
                this.currentGuess.toLowerCase()
            )
        ) {
            this.score.correct = this.score.correct + 1;
            this.wordsCorrect.add(this.wordIndex);
            this.guessIsCorrect = true;
            this.currentGuess = "";
            if (this.wordsCorrect.size === challengeLength) {
                clearInterval(this.intervalId);
                this.challengeOngoing = false;
                this.finished = true;
                this.timeLeft = 0;
                this.saveScore();
            }
        }
    };

    nextWord = (isSkip = false) => {
        document.documentElement.scrollTop = 0;
        if (
            isSkip &&
            !this.shouldShowAnswer &&
            !this.wordsSkipped.has(this.wordIndex)
        ) {
            this.score.skipped = this.score.skipped + 1;
            this.wordsSkipped.add(this.wordIndex);
        }
        const libraryLength = this.selectedLibrary.length;
        this.currentGuess = "";
        this.guessIsCorrect = false;
        this.shouldShowAnswer = false;
        do {
            const nextWordIndex = this.wordIndex + 1;
            this.wordIndex = nextWordIndex >= libraryLength ? 0 : nextWordIndex;
        } while (this.wordsCorrect.has(this.wordIndex));
    };

    showAnswer = () => {
        if (!this.wordsShown.has(this.wordIndex)) {
            this.score.answersShown = this.score.answersShown + 1;
            this.wordsShown.add(this.wordIndex);
        }
        this.shouldShowAnswer = true;
    };

    doCountDown = () => {
        this.timeLeft = this.timeLeft - 1;
        if (this.timeLeft === 30) this.challengeOngoing = true;
        if (this.timeLeft > 0) return;
        clearInterval(this.intervalId);
        this.challengeOngoing = false;
        this.finished = true;
        this.saveScore();
    };

    startChallenge = () => {
        this.timeLeft = 34;
        this.intervalId = setInterval(this.doCountDown, 1000);
    };

    saveScore = () => {
        window.localStorage.setItem(
            "score",
            JSON.stringify({
                timestamp: new Date().toISOString(),
                ...this.score,
            })
        );
    };

    getScore = () => {
        const score = window.localStorage.getItem("score");
        if (!score) return;
        const { timestamp, ...currentScore } = JSON.parse(score);
        if (
            timestamp.substring(0, 10) ===
            new Date().toISOString().substring(0, 10)
        ) {
            this.finished = true;
            this.score = currentScore;
        }
    };
}
