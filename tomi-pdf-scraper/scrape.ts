import * as fs from "fs";
import PDFParser from "pdf2json";

const pdfParser = new PDFParser();

type Page = {
    texts: { x: number; y: number; text: string; decoded: string }[];
    t: string[];
};

const shiftToAscii = (text: string) => {
    // for (let amt = 75; amt < 85; amt++) {
    let shiftedText = "";
    for (let i = 0; i < text.length; i++) {
        let char = text.charAt(i);
        let codePoint = char.charCodeAt(0);
        // Shift control characters (0x00 to 0x1F) to the printable ASCII range
        if (codePoint >= 0x00 && codePoint <= 0x1f) {
            shiftedText += String.fromCharCode(codePoint + 0x49);
        } else {
            shiftedText += char;
        }
    }
    console.log(shiftedText);
    // }
};

shiftToAscii("\u001e\u001d\u001c");

pdfParser.on("pdfParser_dataError", (errData) =>
    console.error(errData.parserError)
);
pdfParser.on("pdfParser_dataReady", (pdfData) => {
    const pages: Page[] = [];
    for (const pdfPage of pdfData.Pages) {
        const page: Page = { texts: [], t: [] };
        for (const text of pdfPage.Texts) {
            const x = text.x;
            const y = text.y;
            const t = text.R[0].T;
            const d = decodeURIComponent(t);
            page.texts.push({ x, y, text: t, decoded: d });
            page.t.push(d);
            // page.t.push(shiftToAscii(d));
            // text.R[0].T = decodeURIComponent(text.R[0].T);
        }
        pages.push(page);
    }
    fs.writeFileSync("./output.json", JSON.stringify(pdfData, null, 4));
    fs.writeFileSync("./parsed.json", JSON.stringify(pages, null, 4));
});

pdfParser.loadPDF("./TomiKorean-430-Basic-Korean-Words.pdf");
