import * as path from 'node:path';
import * as url from 'node:url';
import {parseArgs} from 'node:util';

import {type Browser, launch, type Page, type PaperFormat} from 'puppeteer';

const {values} = parseArgs({
    args: process.argv.splice(2),
    strict: true,
    options: {
        input: {
            type: 'string'
        },
        output: {
            type: 'string'
        },
        format: {
            type: 'string',
            default: 'A4'
        }
    }
});

const paperFormats: ReadonlyArray<PaperFormat> = [
    'A0',
    'A1',
    'A2',
    'A3',
    'A4',
    'A5',
    'A6',
    'Letter',
    'Legal',
    'Tabloid',
    'Ledger'
];

const input: string | undefined = values.input as string | undefined;
const output: string | undefined = values.output as string | undefined;

const format: string = values.format;

const isInputWebUri: boolean = input && /^https?:\/\//.test(input);
const isInputFileUri: boolean = input && /^file:\/\//.test(input);

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

if (!paperFormats.includes(format as PaperFormat)) {
    throw `Unknown format provided ${format}. Allowed Values: ${paperFormats.join(', ')}`;
}

const cwd: string = process.cwd();

let browserUrl: string = input;
if (!isInputWebUri && !isInputFileUri) {
    browserUrl = url
        .pathToFileURL(path.isAbsolute(input) ? input : path.join(cwd, input))
        .toString();
}

const browser: Browser = await launch();
const page: Page = await browser.newPage();
await page.goto(browserUrl);
await page.setViewport({
    width: 1920,
    height: 1080
});
await page.pdf({
    path: path.isAbsolute(output) ? output : path.join(cwd, output),
    format: 'A4'
});
await browser.close();
