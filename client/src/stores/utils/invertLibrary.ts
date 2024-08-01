import { v4 } from "uuid";

import { Translation } from "../../types";

export const invertLibrary = (library: Translation[]): Translation[] => {
    const invertedLibrary = library.reduce((map, word) => {
        for (const translation of word.translations) {
            const invertedWord: Translation = map.get(translation.original) || {
                id: v4(),
                word: translation,
                translations: [],
                type: word.type,
            };

            invertedWord.translations.push(word.word);

            map.set(translation.original, invertedWord);
        }

        return map;
    }, new Map<string, Translation>());

    return Array.from(invertedLibrary.values());
};
