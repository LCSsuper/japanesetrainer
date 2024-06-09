import * as fs from "fs";
var Aromanize = require("aromanize");

type Word = {
    word: string;
    description: string;
    translation: string[];
};

const translations: Word[] = JSON.parse(
    fs.readFileSync("./updated-translations.json").toString()
);

for (const translation of translations) {
    translation.description = Aromanize.hangulToLatin(
        translation.word,
        "rr-translit"
    );
}

fs.writeFileSync(
    "./updated-translations-test.json",
    JSON.stringify(translations)
);
