export type PracticeMode = "eng_to_lang" | "lang_to_eng";

export type Word = {
    original: string;
    romanization?: string;
};

export type Translation = {
    id: string;
    word: Word;
    translations: Word[];
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

export type Library = Translation[];

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
