import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";
import { v4 } from "uuid";

import japaneseLibrary from "./data/0-1000-japanese.json";
import spanishLibrary from "./data/0-1000-spanish.json";
import swedishLibrary from "./data/0-1000-swedish.json";
import koreanLibrary from "./data/common-korean.json";
import tomiKoreanLibrary from "./data/tomi-korean.json";
import arabicLibrary from "./data/0-100-arabic.json";
import { Language, Word, WordType } from "../types";
import { flags } from "../constants";

const invertLibrary = (library: Word[]): Word[] => {
    const invertedLibrary = library.reduce((map, word) => {
        for (const translation of word.translations) {
            const invertedWord: Word = map.get(translation) || {
                id: v4(),
                word: translation,
                romanization: "",
                translations: [],
                type: word.type,
            };

            invertedWord.translations.push(word.word);
            if (word.romanization) {
                invertedWord.translations.push(word.romanization);
            }

            map.set(translation, invertedWord);
        }

        return map;
    }, new Map<string, Word>());

    return Array.from(invertedLibrary.values());
};

const libraries: {
    [language: string]: { lang_to_eng: Word[]; eng_to_lang: Word[] };
} = {
    japanese: {
        lang_to_eng: japaneseLibrary,
        eng_to_lang: invertLibrary(japaneseLibrary),
    },
    spanish: {
        lang_to_eng: spanishLibrary,
        eng_to_lang: invertLibrary(spanishLibrary),
    },
    swedish: {
        lang_to_eng: swedishLibrary,
        eng_to_lang: invertLibrary(swedishLibrary),
    },
    korean: {
        lang_to_eng: koreanLibrary as Word[],
        eng_to_lang: invertLibrary(koreanLibrary as Word[]),
    },
    tomikorean: {
        lang_to_eng: tomiKoreanLibrary as Word[],
        eng_to_lang: invertLibrary(tomiKoreanLibrary as Word[]),
    },
    arabic: {
        lang_to_eng: arabicLibrary,
        eng_to_lang: invertLibrary(arabicLibrary),
    },
};

export default class LibraryStore {
    range: [number, number] = [0, 10];
    language: Language = "korean";
    selectedWordIds: Set<string> = new Set();
    selectionMode: "range" | "custom" = "range";
    wordTypeCounts: Map<WordType, number> = new Map();

    constructor() {
        makeAutoObservable(this);
        autoBind(this);
        this.getLibraryOptionsFromLocalStorage();
    }

    setSelectionMode = (selectionMode: "range" | "custom") => {
        this.selectionMode = selectionMode;
        this.saveLibraryOptionsToLocalStorage();
    };

    setRange = (from: number, to: number) => {
        this.range = [from, to];
        this.saveLibraryOptionsToLocalStorage();
    };

    setLanguage = (language: string) => {
        this.language = language as Language;
        this.selectedWordIds.clear();
        this.saveLibraryOptionsToLocalStorage();
        this.calculateWordTypeCounts();
    };

    calculateWordTypeCounts = () => {
        this.wordTypeCounts.clear();
        for (const word of this.library.lang_to_eng) {
            if (!word.type) continue;
            const count = this.wordTypeCounts.get(word.type) || 0;
            this.wordTypeCounts.set(word.type, count + 1);
        }
    };

    saveLibraryOptionsToLocalStorage = () => {
        window.localStorage.setItem(
            "libraryOptions",
            JSON.stringify({
                range: this.range,
                language: this.language,
                selectionMode: this.selectionMode,
                selectedWordIds: Array.from(this.selectedWordIds),
            })
        );
    };

    getLibraryOptionsFromLocalStorage = () => {
        const libraryOptions = window.localStorage.getItem("libraryOptions");
        if (!libraryOptions) return;
        const {
            range = [0, 10],
            language = "korean" as Language,
            selectionMode = "range" as "range" | "custom",
            selectedWordIds = [],
        } = JSON.parse(libraryOptions);

        this.setRange(range[0], range[1]);
        this.setLanguage(language);
        this.setSelectionMode(selectionMode);
        this.selectedWordIds = new Set(selectedWordIds);
        this.saveLibraryOptionsToLocalStorage();
    };

    toggleAll = () => {
        if (this.selectedWordIds.size) this.selectedWordIds.clear();
        else {
            this.library.lang_to_eng.forEach((word) =>
                this.selectedWordIds.add(word.id)
            );
        }
        this.saveLibraryOptionsToLocalStorage();
    };

    toggleAllWithWordType = (type: WordType) => {
        if (this.hasWordTypeInSelection(type)) {
            this.library.lang_to_eng
                .filter((word) => word.type === type)
                .forEach((word) => this.selectedWordIds.delete(word.id));
        } else {
            this.library.lang_to_eng
                .filter((word) => word.type === type)
                .forEach((word) => this.selectedWordIds.add(word.id));
        }
        this.saveLibraryOptionsToLocalStorage();
    };

    toggleWord = (wordId: string) => {
        if (this.selectedWordIds.has(wordId)) {
            this.selectedWordIds.delete(wordId);
        } else {
            this.selectedWordIds.add(wordId);
        }
        this.saveLibraryOptionsToLocalStorage();
    };

    hasWordTypeInSelection = (type: WordType) =>
        this.practiceLibrary.lang_to_eng.some((word) => word.type === type);

    isSelected = (wordId: string, index: number): boolean =>
        this.selectionMode === "custom"
            ? this.selectedWordIds.has(wordId)
            : index >= this.range[0] && index < this.range[1];

    get ISOlanguage() {
        switch (this.language) {
            case "japanese":
                return "ja";
            case "spanish":
                return "es";
            case "swedish":
                return "sv";
            case "korean":
                return "ko";
        }
        return "en";
    }

    get flag() {
        return flags[this.language];
    }

    get library() {
        return libraries[this.language];
    }

    get selectedWordCount() {
        return this.selectionMode === "custom"
            ? this.selectedWordIds.size
            : this.range[1] - this.range[0];
    }

    // TODO @Lucas for performance, probably better to filter the library once
    get practiceLibrary() {
        // TODO @lucas range should only be used if user creates a subset by range
        let filtered =
            this.selectionMode === "range"
                ? this.library.lang_to_eng.slice(...this.range)
                : this.library.lang_to_eng.filter(this.inPracticeSelection);

        return {
            lang_to_eng: filtered,
            eng_to_lang: invertLibrary(filtered),
        };
    }

    inPracticeSelection = (word: Word) => this.selectedWordIds.has(word.id);
}
