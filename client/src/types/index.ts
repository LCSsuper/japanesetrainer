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
    | "interjection";

export type Language =
    | "korean"
    | "japanese"
    | "spanish"
    | "swedish"
    | "arabic"
    | "tomikorean";

export type Library = Word[];

export type Lesson = {
    key: string;
    title: string;
    type?: "category" | "word type";
    count: number;
};
