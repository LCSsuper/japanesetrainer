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

const scrapeTopKoreanWords = async () => {
    const translations: {
        word: string;
        description: string;
        translation: string[];
    }[] = [];
    const { browser, page } = await initializePuppeteer();

    await page.goto(
        "https://1000mostcommonwords.com/1000-most-common-korean-words/"
    );

    await page.waitForXPath('//div[@class="entry-content clear"]', visible);

    try {
        const rows = await page.$x("//tr");

        for (const row of rows) {
            const korean = (
                await row.$eval("td:nth-child(2)", (e) => e?.textContent)
            )?.toLowerCase();
            const english = (
                await row.$eval("td:nth-child(3)", (e) => e?.textContent)
            )?.toLowerCase();
            if (korean === "korean" && english === "in english") continue;
            translations.push({
                word: korean || "",
                description: "",
                translation: [english || ""],
            });
        }
    } catch (e) {
        console.error(e);
    }

    console.log("🙋‍♂️", translations.length);

    fs.writeFileSync(
        "./translations.json",
        JSON.stringify(translations, null, 4)
    );

    await browser.close();
};

scrapeTopKoreanWords();
