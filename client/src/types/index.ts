export type PracticeMode = "eng_to_lang" | "lang_to_eng";

export type Word = {
    id: string;
    word: string;
    romanization: string;
    translations: string[];
    type?: WordType;
    category?: string;
};

export type WordType =
    | "verb"
    | "verb (base)"
    | "verb (past)"
    | "verb (present)"
    | "verb (future)"
    | "noun"
    | "adjective"
    | "adverb"
    | "preposition"
    | "pronoun"
    | "interjection"
    | "conjunction";

export type Language =
    | "korean"
    | "japanese"
    | "spanish"
    | "swedish"
    | "arabic"
    | "tomikorean";

export type Library = Word[];

export type Lesson = GeneratedLesson | CustomLesson;

export type GeneratedLesson = {
    id: string;
    title: string;
    type?: "category" | "word type" | "all";
    count: number;
    wordIds?: string[];
};

export type CustomLesson = {
    id: string;
    title: string;
    type?: "custom";
    count: number;
    wordIds: string[];
};
