import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";
import { v4 } from "uuid";

import japaneseLibrary from "./data/0-1000-japanese.json";
import spanishLibrary from "./data/0-1000-spanish.json";
import swedishLibrary from "./data/0-1000-swedish.json";
import koreanLibrary from "./data/common-korean.json";
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
    arabic: {
        lang_to_eng: arabicLibrary,
        eng_to_lang: invertLibrary(arabicLibrary),
    },
};

export default class LibraryStore {
    range: [number, number] = [0, 10];
    showRomanization: boolean = true;
    showWordType: boolean = true;
    randomize: boolean = true;
    language: Language = "korean";
    selectedWordIds: Set<string> = new Set();

    constructor() {
        makeAutoObservable(this);
        autoBind(this);
        this.getLibraryOptionsFromLocalStorage();
    }

    setRange = (from: number, to: number) => {
        this.range = [from, to];
        this.updateSelectedWordIdsBasedOnRange(); // TODO @Lucas this is a side effect (only when using range selection)
        this.saveLibraryOptionsToLocalStorage();
    };

    updateSelectedWordIdsBasedOnRange = () => {
        this.selectedWordIds.clear();
        for (let i = this.range[0]; i < this.range[1]; i++) {
            this.selectedWordIds.add(this.library.lang_to_eng[i].id);
        }
    };

    setShowRomanization = (showRomanization: boolean) => {
        this.showRomanization = showRomanization;
        this.saveLibraryOptionsToLocalStorage();
    };

    setShowWordType = (showWordType: boolean) => {
        this.showWordType = showWordType;
        this.saveLibraryOptionsToLocalStorage();
    };

    setRandomize = (randomize: boolean) => {
        this.randomize = randomize;
        this.saveLibraryOptionsToLocalStorage();
    };

    setLanguage = (language: string) => {
        this.language = language as Language;
        this.selectedWordIds.clear();
        this.updateSelectedWordIdsBasedOnRange(); // TODO @Lucas this is a side effect (only when using range selection)
        this.saveLibraryOptionsToLocalStorage();
    };

    saveLibraryOptionsToLocalStorage = () => {
        window.localStorage.setItem(
            "libraryOptions",
            JSON.stringify({
                range: this.range,
                showRomanization: this.showRomanization,
                showWordType: this.showWordType,
                randomize: this.randomize,
                language: this.language,
            })
        );
    };

    getLibraryOptionsFromLocalStorage = () => {
        const libraryOptions = window.localStorage.getItem("libraryOptions");
        if (!libraryOptions) return;
        const { range, showRomanization, showWordType, randomize, language } =
            JSON.parse(libraryOptions);

        this.setRange(range[0], range[1]);
        this.setShowRomanization(showRomanization);
        this.setShowWordType(showWordType);
        this.setRandomize(randomize);
        this.setLanguage(language);
    };

    toggleAll = () => {
        if (this.selectedWordIds.size) this.selectedWordIds.clear();
        else {
            this.library.lang_to_eng.forEach((word) =>
                this.selectedWordIds.add(word.id)
            );
        }
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
    };

    hasWordTypeInSelection = (type: WordType) =>
        this.practiceLibrary.lang_to_eng.some((word) => word.type === type);

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

    // TODO @Lucas for performance, probably better to filter the library once
    get practiceLibrary() {
        // TODO @lucas range should only be used if user creates a subset by range
        let filtered = this.range
            ? this.library.lang_to_eng.slice(...this.range)
            : this.library.lang_to_eng;

        return {
            lang_to_eng: filtered,
            eng_to_lang: invertLibrary(filtered),
        };
    }

    inPracticeSelection = (word: Word) => this.selectedWordIds.has(word.id);
}
