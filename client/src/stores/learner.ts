import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";

import { shuffle } from "./utils/shuffle";
import { PracticeMode, Word } from "../types";
import LibraryStore from "./library";
import SettingsStore from "./settings";
import { invertLibrary } from "./utils/invertLibrary";

export default class LearnerStore {
    libraryStore: LibraryStore;
    settingsStore: SettingsStore;
    wordIndex: number = 0;
    currentGuess: string = "";
    guessIsCorrect: boolean = false;
    answerRevealed: boolean = false;
    guessedTranslations: string[] = [];
    practiceMode: PracticeMode = "lang_to_eng";
    words: Word[] = [];

    constructor(libraryStore: LibraryStore, settingsStore: SettingsStore) {
        makeAutoObservable(this);
        this.libraryStore = libraryStore;
        this.settingsStore = settingsStore;
        autoBind(this);
    }

    reset = () => {
        this.words = JSON.parse(
            JSON.stringify(
                this.practiceMode === "lang_to_eng"
                    ? this.libraryStore.practiceLibrary
                    : invertLibrary(this.libraryStore.practiceLibrary)
            )
        );

        if (this.settingsStore.randomize) shuffle(this.words);
        this.wordIndex = 0;
        this.guessIsCorrect = false;
        this.answerRevealed = false;
        this.currentGuess = "";
        this.guessedTranslations = [];
    };

    get currentWord(): Word {
        return this.words[this.wordIndex];
    }

    setCurrentGuess = (guess: string) => {
        this.currentGuess = guess;
        this.checkCurrentGuess();
    };

    checkCurrentGuess = () => {
        if (
            (this.currentWord.translations.includes(
                this.currentGuess.toLowerCase().trim()
            ) ||
                this.currentWord.translations
                    .map((answer) => answer.replace(/-/g, ""))
                    .includes(this.currentGuess.toLowerCase())) &&
            !this.guessedTranslations.includes(this.currentGuess)
        ) {
            this.guessIsCorrect = true;
            this.guessedTranslations.push(this.currentGuess);
            this.currentGuess = "";
        }
    };

    nextWord = () => {
        document.documentElement.scrollTop = 0;
        const nextWordIndex = this.wordIndex + 1;
        const libraryLength = this.words.length;
        if (nextWordIndex >= libraryLength) {
            this.reset();
            return;
        }
        this.wordIndex = nextWordIndex;
        this.currentGuess = "";
        this.guessedTranslations = [];
        this.guessIsCorrect = false;
        this.answerRevealed = false;
    };

    showAnswer = () => {
        this.answerRevealed = true;
        this.currentGuess = "";
    };

    setPracticeMode = (practiceMode: PracticeMode) => {
        this.practiceMode = practiceMode;
    };

    get translationCount() {
        return this.currentWord.translations.length;
    }

    get guessedCount() {
        return this.guessedTranslations.length;
    }

    get remainingCount() {
        return this.remainingAnswers.length;
    }

    get remainingAnswers() {
        return this.currentWord.translations.filter(
            (answer) => !this.guessedTranslations.includes(answer)
        );
    }

    get canContinue() {
        return this.guessedTranslations.length || this.answerRevealed;
    }

    get progressPercentage() {
        return ((this.wordIndex + 1) / this.words.length) * 100;
    }
}
