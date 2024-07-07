export type PracticeMode = "eng_to_lang" | "lang_to_eng";

export type Word = {
    id: string;
    word: string;
    description: string;
    translation: string[];
    type?: string;
};

export type Language = "korean" | "japanese" | "spanish" | "swedish" | "arabic";
