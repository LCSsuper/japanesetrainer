import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";

import { shuffle } from "./utils/shuffle";
import { PracticeMode, Translation, Word } from "../types";
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
    guessedTranslations: Map<string, Word> = new Map();
    practiceMode: PracticeMode = "lang_to_eng";
    words: Translation[] = [];

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
        this.guessedTranslations.clear();
    };

    get currentWord(): Translation {
        return this.words[this.wordIndex];
    }

    setCurrentGuess = (guess: string) => {
        this.currentGuess = guess;
        this.checkCurrentGuess();
    };

    checkCurrentGuess = () => {
        const currentGuess = this.currentGuess.toLowerCase().trim();
        const answer = this.currentWord.translations.find((translation) => {
            const original = translation.original.toLowerCase();
            const romanization = translation.romanization?.toLowerCase();

            if (
                original === currentGuess ||
                original.replace(/-/g, "") === currentGuess
            ) {
                return true;
            }

            if (this.settingsStore.allowRomanizationAsAnswer && romanization) {
                return (
                    romanization === currentGuess ||
                    romanization.replace(/-/g, "") === currentGuess
                );
            }

            return false;
        });

        if (!answer) return;
        this.guessIsCorrect = true;
        this.guessedTranslations.set(answer.original, answer);
        this.currentGuess = "";
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
        this.guessedTranslations.clear();
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
        return this.guessedTranslations.size;
    }

    get remainingCount() {
        return this.remainingAnswers.length;
    }

    get remainingAnswers() {
        return this.currentWord.translations.filter(
            (answer) => !this.guessedTranslations.has(answer.original)
        );
    }

    get canContinue() {
        return (
            (this.guessedTranslations.size || this.answerRevealed) &&
            !this.currentGuess
        );
    }

    get progressPercentage() {
        return ((this.wordIndex + 1) / this.words.length) * 100;
    }
}
