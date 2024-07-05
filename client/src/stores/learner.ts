import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";

import japaneseLibrary from "./data/0-1000-japanese.json";
import spanishLibrary from "./data/0-1000-spanish.json";
import swedishLibrary from "./data/0-1000-swedish.json";
import papiamentoLibrary from "./data/0-264-papiamento.json";
import koreanLibrary from "./data/common-korean.json";
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
    swedish: swedishLibrary,
    papiamento: papiamentoLibrary,
    korean: koreanLibrary,
};

export default class LearnerStore {
    settingsStore: SettingsStore;
    wordIndex: number = 0;
    currentGuess: string = "";
    guessIsCorrect: boolean = false;
    answerRevealed: boolean = false;
    selectedLibrary: Word[] = [];
    guessedTranslations: string[] = [];
    englishToLanguage: boolean = false;

    constructor(settingsStore: SettingsStore) {
        makeAutoObservable(this);
        this.settingsStore = settingsStore;
        autoBind(this);
    }

    get library() {
        return libraries[this.settingsStore.language];
    }

    reset = () => {
        this.selectedLibrary = libraries[this.settingsStore.language].slice(
            ...this.settingsStore.range
        );
        if (this.englishToLanguage) {
            this.selectedLibrary = this.selectedLibrary
                .map((lib) =>
                    lib.translation.map((translation) => ({
                        word: translation,
                        description: "",
                        translation: [lib.word, lib.description].filter(
                            (e) => !!e
                        ),
                    }))
                )
                .flat();
        }
        shuffle(this.selectedLibrary);
        this.wordIndex = 0;
        this.guessIsCorrect = false;
        this.answerRevealed = false;
        this.currentGuess = "";
        this.guessedTranslations = [];
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
            (this.currentWord.translation.includes(
                this.currentGuess.toLowerCase()
            ) ||
                this.currentWord.translation
                    .map((answer) =>
                        answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    )
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
        const libraryLength = this.selectedLibrary.length;
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

    setEnglishToLanguage = (onOrOff: boolean) => {
        this.englishToLanguage = onOrOff;
    };

    get translationCount() {
        return this.currentWord.translation.length;
    }

    get guessedCount() {
        return this.guessedTranslations.length;
    }

    get remainingCount() {
        return this.remainingAnswers.length;
    }

    get remainingAnswers() {
        return this.currentWord.translation.filter(
            (answer) => !this.guessedTranslations.includes(answer)
        );
    }

    get canContinue() {
        return this.guessedTranslations.length || this.answerRevealed;
    }

    get progressPercentage() {
        return ((this.wordIndex + 1) / this.selectedLibrary.length) * 100;
    }
}
