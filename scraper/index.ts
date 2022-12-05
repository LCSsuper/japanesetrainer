import * as puppeteer from "puppeteer";
import * as fs from "fs";

const viewport = { width: 1920, height: 1080 };
const visible = { visible: true, timeout: 1000 };

const initializePuppeteer = async (): Promise<{
    browser: puppeteer.Browser;
    page: puppeteer.Page;
}> => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: viewport,
        ignoreHTTPSErrors: true,
        args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-first-run",
            "--no-sandbox",
            "--no-zygote",
            "--deterministic-fetch",
            "--disable-features=IsolateOrigins",
            "--disable-site-isolation-trials",
        ],
    });
    const [page] = await browser.pages();
    await page.setViewport(viewport);
    return { browser, page };
};

const scrapeTopJapaneseWords = async () => {
    const translations: {
        hiragana: string;
        romanji: string;
        english: string[];
    }[] = [];
    const { browser, page } = await initializePuppeteer();

    // await page.goto(
    //     "https://learnjapanesedaily.com/most-common-japanese-words.html"
    // );
    // await page.goto(
    //     "https://learnjapanesedaily.com/2000-most-common-japanese-words.html"
    // );
    await page.goto(
        "https://learnjapanesedaily.com/3000-most-common-japanese-words.html"
    );

    await page.waitForXPath('//a[@class="nextpostslink"]', visible);

    while (true) {
        try {
            const wordElements = await page.$x(
                '//div[contains(@class, "entry-content")]//p'
            );

            for (const wordElement of wordElements) {
                const word = await page.evaluate(
                    (e) => e.textContent,
                    wordElement
                );
                if (!word?.includes(") :")) continue;
                const [japaneseRaw, englishRaw] = word.split(" :");
                const [hiragana, romanjiRaw] = japaneseRaw
                    .split(". ")[1]
                    .split(" ");
                const romanji = romanjiRaw.substring(1, romanjiRaw.length - 1);
                const english = englishRaw.split(", ");
                translations.push({ hiragana, romanji, english });
            }

            const nextPageButton = await page.waitForXPath(
                '//a[@class="nextpostslink"]',
                visible
            );
            await (nextPageButton as puppeteer.ElementHandle).click();
            await page.waitForNavigation();
        } catch (e) {
            console.error(e);
            break;
        }
    }

    console.log("🙋‍♂️", translations.length);

    fs.writeFileSync(
        "./translations.json",
        JSON.stringify(translations, null, 4)
    );

    await browser.close();
};

scrapeTopJapaneseWords();
