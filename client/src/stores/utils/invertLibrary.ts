import { v4 } from "uuid";

import { Word } from "../../types";

export const invertLibrary = (library: Word[]): Word[] => {
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
