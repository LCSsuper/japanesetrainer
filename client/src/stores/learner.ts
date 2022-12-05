import { makeAutoObservable, runInAction } from "mobx";
import autoBind from "auto-bind";

import library from "./data/0-1000-translations.json";
import SettingsStore from "./settings";

export type Word = {
    hiragana: string;
    romanji: string;
    english: string[];
};

const shuffle = (array: any[]): void => {
    let currentIndex = array.length,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
};

export default class LearnerStore {
    settingsStore: SettingsStore;
    wordIndex: number = 0;
    currentGuess: string = "";
    guessIsCorrect: boolean = false;
    shouldShowAnswer: boolean = false;
    library: Word[];
    selectedLibrary: Word[] = [];

    constructor(settingsStore: SettingsStore) {
        makeAutoObservable(this);
        this.settingsStore = settingsStore;
        this.library = library;
        autoBind(this);
    }

    reset = () => {
        this.selectedLibrary = library.slice(...this.settingsStore.range);
        shuffle(this.selectedLibrary);
        this.wordIndex = 0;
        this.guessIsCorrect = false;
        this.shouldShowAnswer = false;
    };

    get currentWord(): Word {
        return this.selectedLibrary[this.wordIndex];
    }

    setCurrentGuess = (guess: string) => {
        runInAction(() => {
            this.currentGuess = guess;
        });
        this.checkCurrentGuess();
    };

    checkCurrentGuess = () => {
        if (
            this.currentWord.english.includes(this.currentGuess.toLowerCase())
        ) {
            runInAction(() => {
                this.guessIsCorrect = true;
                this.currentGuess = "";
            });
        }
    };

    nextWord = () => {
        const nextWordIndex = this.wordIndex + 1;
        const libraryLength = this.selectedLibrary.length;
        this.wordIndex = nextWordIndex >= libraryLength ? 0 : nextWordIndex;
        this.guessIsCorrect = false;
        this.shouldShowAnswer = false;
    };

    showAnswer = () => {
        this.shouldShowAnswer = true;
    };
}
