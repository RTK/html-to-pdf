import * as path from 'node:path';
import {parseArgs} from 'node:util';

import {type Browser, launch, Page} from 'puppeteer';

const { values } = parseArgs({
    args: process.argv.splice(2),
    strict: true,
    options: {
        input: {
            type: 'string'
        },
        output: {
            type: 'string'
        }
    }
});

const input: string | undefined = values.input as string | undefined;
const output: string | undefined = values.output as string | undefined;

const isInputWebUri: boolean = input && /^https?:\/\//.test(input);

if (!input) {
    throw 'Specify input file';
} else if (!input.endsWith('.html') && !isInputWebUri) {
    throw 'Must provide html file as input';
}

if (!output) {
    throw 'Specify output file';
} else if (!output.endsWith('.pdf')) {
    throw 'Must provide pdf file as output';
}

const cwd: string = process.cwd();

let url: string = input;
if (!isInputWebUri) {
    url = path.isAbsolute(input) ? input : path.join(cwd, input);
}

const browser: Browser = await launch();
const page: Page = await browser.newPage();
await page.goto(url);
await page.setViewport({
    width: 1920,
    height: 1080
});
await page.pdf({
    path: path.isAbsolute(output) ? output : path.join(cwd, output),
    format: 'A4'
});
await browser.close();
