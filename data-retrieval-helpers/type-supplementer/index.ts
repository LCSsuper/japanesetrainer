import * as fs from "fs";
import * as superagent from "superagent";

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

const acceptedTypes: WordType[] = [
    "verb",
    "noun",
    "adjective",
    "adverb",
    "preposition",
    "pronoun",
    "interjection",
];

type Word = {
    id: string;
    word: string;
    romanization: string;
    translations: string[];
    type?: WordType;
    category?: string;
};

const words = JSON.parse(fs.readFileSync("./words.json").toString()) as Word[];

const getWordType = async (word: Word) => {
    try {
        const response = await superagent.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word.translations[0]}`
        );
        const wordTypes = response.body[0].meanings.map(
            (m: any) => m.partOfSpeech
        );

        const wordType = wordTypes.find((wordType: string) =>
            acceptedTypes.includes(wordType as WordType)
        );

        return wordType || `MULTIPLE TYPES: ${wordTypes.join(", ")}`;
    } catch (e) {
        console.log((e as any).response.status);
    }

    return "UNKNOWN";
};

(async () => {
    let progress = 0;
    let progressPercentage = 0;
    for (const word of words) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        word.type = await getWordType(word);
        progress++;
        progressPercentage = Math.floor((progress / words.length) * 100);

        if (progressPercentage % 10 === 0) {
            console.log(`Progress: ${progressPercentage}%`);
        }
    }

    console.log("finished!");

    fs.writeFileSync("./words2.json", JSON.stringify(words, null, 4));
})();
