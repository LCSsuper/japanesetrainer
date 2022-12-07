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

const libraries = {
    japanese: japaneseLibrary,
    spanish: spanishLibrary,
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
        this.library = libraries[settingsStore.language];
        autoBind(this);
    }

    reset = () => {
        this.selectedLibrary = libraries[this.settingsStore.language].slice(
            ...this.settingsStore.range
        );
        shuffle(this.selectedLibrary);
        this.wordIndex = 0;
        this.guessIsCorrect = false;
        this.shouldShowAnswer = false;
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
            this.guessIsCorrect = true;
            this.currentGuess = "";
        }
    };

    nextWord = () => {
        const nextWordIndex = this.wordIndex + 1;
        const libraryLength = this.selectedLibrary.length;
        if (nextWordIndex >= libraryLength) {
            this.reset();
            return;
        }
        this.wordIndex = nextWordIndex;
        this.currentGuess = "";
        this.guessIsCorrect = false;
        this.shouldShowAnswer = false;
    };

    showAnswer = () => {
        this.shouldShowAnswer = true;
    };
}
