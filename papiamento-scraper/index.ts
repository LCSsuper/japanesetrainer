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

const scrapeTopPapiamentoWords = async () => {
    const translations: {
        word: string;
        description: string;
        translation: string[];
    }[] = [];
    const { browser, page } = await initializePuppeteer();

    await page.goto(
        "https://en.wiktionary.org/wiki/Appendix:Papiamento_Swadesh_list"
    );

    await page.waitForXPath('//div[@id="bodyContent"]', visible);

    try {
        const rows = await page.$x("//tr");

        console.log("😈", rows.length);

        for (const row of rows) {
            try {
                let english = (
                    await row.$eval("td:nth-child(2)", (e) => e?.textContent)
                )?.toLowerCase();
                let papiamento = (
                    await row.$eval("td:nth-child(3)", (e) => e?.textContent)
                )?.toLowerCase();
                english = english?.replace("\n", "");
                papiamento = papiamento?.replace("\n", "");
                for (const word of papiamento?.split(", ") || []) {
                    translations.push({
                        word: word || "",
                        description: "",
                        translation: [english || ""],
                    });
                }
            } catch (e) {
                // console.error(e);
            }
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

scrapeTopPapiamentoWords();
