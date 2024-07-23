import * as fs from "fs";

const dedoubleTranslations = () => {
    let translations = JSON.parse(
        fs.readFileSync("./translations.json").toString()
    );
    translations = translations.filter(
        (val: any, index: number, self: any[]) => {
            const foundIndex = self.findIndex(
                (e: any) =>
                    e.hiragana === val.hiragana && e.romanji === val.romanji
            );
            if (foundIndex !== index) {
                self[foundIndex].english = [
                    ...self[foundIndex].english,
                    ...self[index].english,
                ];
            }

            return foundIndex === index;
        }
    );
    fs.writeFileSync(
        "./updated-translations.json",
        JSON.stringify(translations, null, 4)
    );
};

dedoubleTranslations();
