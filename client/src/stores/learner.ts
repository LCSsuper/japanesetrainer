import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";
import { v4 } from "uuid";

import japaneseLibrary from "./data/0-1000-japanese.json";
import spanishLibrary from "./data/0-1000-spanish.json";
import swedishLibrary from "./data/0-1000-swedish.json";
import koreanLibrary from "./data/common-korean.json";
import arabicLibrary from "./data/0-100-arabic.json";
import { shuffle } from "./utils/shuffle";
import { Word } from "../types";
import LibraryStore from "./library";

export type PracticeMode = "eng_to_lang" | "lang_to_eng";

const libraries = {
    japanese: japaneseLibrary,
    spanish: spanishLibrary,
    swedish: swedishLibrary,
    korean: koreanLibrary,
    arabic: arabicLibrary,
};

export default class LearnerStore {
    libraryStore: LibraryStore;
    wordIndex: number = 0;
    currentGuess: string = "";
    guessIsCorrect: boolean = false;
    answerRevealed: boolean = false;
    selectedLibrary: Word[] = [];
    guessedTranslations: string[] = [];
    practiceMode: PracticeMode = "lang_to_eng";

    constructor(libraryStore: LibraryStore) {
        makeAutoObservable(this);
        this.libraryStore = libraryStore;
        autoBind(this);
    }

    get library() {
        return libraries[this.libraryStore.language];
    }

    reset = () => {
        this.selectedLibrary = libraries[this.libraryStore.language].slice(
            ...this.libraryStore.range
        );
        if (this.practiceMode === "eng_to_lang") {
            // TODO @Lucas there could be multiple words with the same translation...
            this.selectedLibrary = this.selectedLibrary
                .map((lib) =>
                    lib.translation.map((translation) => ({
                        id: v4(),
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

    setPracticeMode = (practiceMode: PracticeMode) => {
        this.practiceMode = practiceMode;
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
