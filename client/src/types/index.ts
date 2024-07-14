export type PracticeMode = "eng_to_lang" | "lang_to_eng";

export type Word = {
    id: string;
    word: string;
    romanization: string;
    translations: string[];
    type?: WordType;
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

export type Library = {
    lang_to_eng: Word[];
    eng_to_lang: Word[];
};
