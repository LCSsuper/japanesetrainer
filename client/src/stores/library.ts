import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";
import { v4 } from "uuid";

import japaneseLibrary from "./data/0-1000-japanese.json";
import spanishLibrary from "./data/0-1000-spanish.json";
import swedishLibrary from "./data/0-1000-swedish.json";
import koreanLibrary from "./data/common-korean.json";
import arabicLibrary from "./data/0-100-arabic.json";
import { Language, Word } from "../types";

const invertLibrary = (library: Word[]): Word[] => {
    const invertedLibrary = library.reduce((map, word) => {
        for (const translation of word.translation) {
            const invertedWord: Word = map.get(translation) || {
                id: v4(),
                word: translation,
                description: "",
                translation: [],
                type: word.type,
            };

            invertedWord.translation.push(word.word);
            if (word.description) {
                invertedWord.translation.push(word.description);
            }
        }

        return map;
    }, new Map<string, Word>());

    return Array.from(invertedLibrary.values());
};

const flags = {
    korean: "🇰🇷",
    japanese: "🇯🇵",
    spanish: "🇪🇸",
    swedish: "🇸🇪",
    arabic: "🇦🇪",
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
        lang_to_eng: koreanLibrary,
        eng_to_lang: invertLibrary(koreanLibrary),
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
    practiceWordIds: Set<string> = new Set();

    constructor() {
        makeAutoObservable(this);
        autoBind(this);
        this.getLibraryOptionsFromLocalStorage();
    }

    setRange = (from: number, to: number) => {
        this.range = [from, to];
        this.saveLibraryOptionsToLocalStorage();
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
        ({
            range: this.range,
            showRomanization: this.showRomanization,
            showWordType: this.showWordType,
            randomize: this.randomize,
            language: this.language,
        } = JSON.parse(libraryOptions));
    };

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

    get practiceLibrary() {
        if (!this.practiceWordIds.size) return this.library;
        return {
            lang_to_eng: this.library.lang_to_eng.filter(
                this.inPracticeSelection
            ),
            eng_to_lang: this.library.eng_to_lang.filter(
                this.inPracticeSelection
            ),
        };
    }

    inPracticeSelection = (word: Word) => this.practiceWordIds.has(word.id);
}
