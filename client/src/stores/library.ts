import { makeAutoObservable } from "mobx";
import autoBind from "auto-bind";

import japaneseLibrary from "./data/0-1000-japanese.json";
import spanishLibrary from "./data/0-1000-spanish.json";
import swedishLibrary from "./data/0-1000-swedish.json";
import koreanLibrary from "./data/common-korean.json";
import tomiKoreanLibrary from "./data/tomi-korean.json";
import arabicLibrary from "./data/0-100-arabic.json";
import { Language, Lesson, Word, WordType } from "../types";
import { flags, languageTitles } from "../constants";
import { get, save } from "./localstorage";

const libraries: {
    [language: string]: Word[];
} = {
    japanese: japaneseLibrary as Word[],
    spanish: spanishLibrary as Word[],
    swedish: swedishLibrary as Word[],
    korean: koreanLibrary as Word[],
    tomikorean: tomiKoreanLibrary as Word[],
    arabic: arabicLibrary as Word[],
};

export default class LibraryStore {
    language: Language = "korean";
    counts: { categories: Map<string, number>; types: Map<WordType, number> } =
        {
            categories: new Map(),
            types: new Map(),
        };
    customLessons: Lesson[] = [];
    selectedLessonId: string | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
        autoBind(this);
        this.getLibraryOptionsFromLocalStorage();
    }

    setLanguage = (language: string, executeSave: boolean = true) => {
        this.language = language as Language;
        if (executeSave) save("language", language);
        this.calculateCounts();

        const customLessons = get(`${this.language}#lessons`);
        const selectedLessonId = get(`${this.language}#selectedLessonId`);

        this.customLessons = customLessons ?? [];
        this.selectedLessonId = selectedLessonId;
    };

    calculateCounts = () => {
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
    };

    setSelectedLesson = (lessonId?: string) => {
        if (this.selectedLessonId === lessonId) {
            lessonId = undefined;
        }
        this.selectedLessonId = lessonId;
        save(`${this.language}#selectedLessonId`, lessonId);
    };

    getWordsInLesson = (lesson: Lesson): Word[] => {
        if (lesson.type === "all") return this.library;
        const [, value] = lesson.id.split("#");
        if (lesson.type === "category") {
            return this.library.filter((word) => word.category === value);
        }
        if (lesson.type === "word type") {
            return this.library.filter((word) => word.type === value);
        }
        if (lesson.type === "custom") {
            return this.library.filter((word) =>
                lesson.wordIds?.includes(word.id)
            );
        }
        return [];
    };

    saveLesson = (lesson: Lesson) => {
        this.customLessons.push(lesson);
        save(`${this.language}#lessons`, this.customLessons);
        this.setSelectedLesson(lesson.id);
    };

    deleteLesson = (lessonId: string) => {
        this.customLessons = this.customLessons.filter(
            (lesson) => lesson.id !== lessonId
        );
        save(`${this.language}#lessons`, this.customLessons);
        if (this.selectedLessonId === lessonId) {
            this.setSelectedLesson(undefined);
        }
    };

    getLibraryOptionsFromLocalStorage = () => {
        const language = get("language");
        this.setLanguage(language ?? "korean", false);
    };

    get flag() {
        return flags[this.language];
    }

    get languageTitle() {
        return languageTitles[this.language];
    }

    get library() {
        return libraries[this.language];
    }

    get selectedLesson(): Lesson | undefined {
        return this.lessons.find(
            (lesson) => lesson.id === this.selectedLessonId
        );
    }

    get practiceLibrary() {
        if (!this.selectedLesson) return [];
        return this.getWordsInLesson(this.selectedLesson);
    }

    get lessons(): Lesson[] {
        return [
            {
                id: "all",
                title: "all words",
                count: this.library.length,
                type: "all",
            },
            ...Array.from(this.counts.categories.keys()).map(
                (category): Lesson => ({
                    id: `category#${category}`,
                    title: category,
                    type: "category",
                    count: this.counts.categories.get(category) || 0,
                })
            ),
            ...Array.from(this.counts.types.keys()).map(
                (type): Lesson => ({
                    id: `type#${type}`,
                    title: type,
                    type: "word type",
                    count: this.counts.types.get(type) || 0,
                })
            ),
            ...this.customLessons,
        ];
    }
}
