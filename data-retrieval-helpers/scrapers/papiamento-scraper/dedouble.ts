import * as fs from "fs";

type Word = {
    word: string;
    description: string;
    translations: string[];
};

const translations: Word[] = JSON.parse(
    fs.readFileSync("./translations.json").toString()
);

const newTranslations: Word[] = [];
for (const { word, description, translations: translation } of translations) {
    if (!newTranslations.find((row) => row.word === word)) {
        newTranslations.push({ word, description, translations: translation });
        continue;
    }
    const index = newTranslations.findIndex((row) => row.word === word);
    newTranslations[index].translation = [
        ...newTranslations[index].translation,
        ...translation,
    ];
}

fs.writeFileSync(
    "./updated-translations.json",
    JSON.stringify(newTranslations)
);
