import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";

import japaneseLibrary from "./data/0-1000-japanese.json";
import spanishLibrary from "./data/0-1000-spanish.json";
import swedishLibrary from "./data/0-1000-swedish.json";
import koreanLibrary from "./data/common-korean.json";
import tomiKoreanLibrary from "./data/tomi-korean.json";
import arabicLibrary from "./data/0-100-arabic.json";
import { Language, Lesson, Word, WordType } from "../types";
import { flags } from "../constants";

const libraries: {
    [language: string]: Word[];
} = {
    japanese: japaneseLibrary,
    spanish: spanishLibrary,
    swedish: swedishLibrary,
    korean: koreanLibrary as Word[],
    tomikorean: tomiKoreanLibrary as Word[],
    arabic: arabicLibrary,
};

export default class LibraryStore {
    language: Language = "korean";
    counts: { categories: Map<string, number>; types: Map<WordType, number> } =
        {
            categories: new Map(),
            types: new Map(),
        };
    lessons: Lesson[] = [{ key: "all", title: "All words", count: 0 }];
    selectedLessonId: string | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
        autoBind(this);
        this.getLibraryOptionsFromLocalStorage();
    }

    setLanguage = (language: string) => {
        this.language = language as Language;
        this.saveLibraryOptionsToLocalStorage();
        this.counts = this.library.reduce(
            (maps, word) => {
                if (word.type) {
                    maps.types.set(
                        word.type,
                        (maps.types.get(word.type) || 0) + 1
                    );
                }
                if (word.category) {
                    maps.categories.set(
                        word.category,
                        (maps.categories.get(word.category) || 0) + 1
                    );
                }
                return maps;
            },
            {
                categories: new Map<string, number>(),
                types: new Map<WordType, number>(),
            }
        );
        this.lessons = [
            { key: "all", title: "all words", count: this.library.length },
            ...Array.from(this.counts.categories.keys()).map(
                (category): Lesson => ({
                    key: `category#${category}`,
                    title: category,
                    type: "category",
                    count: this.counts.categories.get(category) || 0,
                })
            ),
            ...Array.from(this.counts.types.keys()).map(
                (type): Lesson => ({
                    key: `type#${type}`,
                    title: type,
                    type: "word type",
                    count: this.counts.types.get(type) || 0,
                })
            ),
        ];
    };

    setSelectedLesson = (lessonId: string) => {
        this.selectedLessonId = lessonId;
    };

    get selectedLesson(): Lesson | undefined {
        return this.lessons.find(
            (lesson) => lesson.key === this.selectedLessonId
        );
    }

    getWordsInLesson = (lesson: Lesson): Word[] => {
        if (lesson.key === "all") return this.library;
        const [type, value] = lesson.key.split("#");
        if (type === "category") {
            return this.library.filter((word) => word.category === value);
        }
        if (type === "type") {
            return this.library.filter((word) => word.type === value);
        }
        return [];
    };

    saveLibraryOptionsToLocalStorage = () => {
        window.localStorage.setItem(
            "libraryOptions",
            JSON.stringify({
                language: this.language,
            })
        );
    };

    getLibraryOptionsFromLocalStorage = () => {
        const libraryOptions = window.localStorage.getItem("libraryOptions");
        if (!libraryOptions) return;
        const { language = "korean" as Language } = JSON.parse(libraryOptions);

        this.setLanguage(language);
        this.saveLibraryOptionsToLocalStorage();
    };

    get flag() {
        return flags[this.language];
    }

    get library() {
        return libraries[this.language];
    }

    get practiceLibrary() {
        if (!this.selectedLesson) return [];
        return this.getWordsInLesson(this.selectedLesson);
    }
}
