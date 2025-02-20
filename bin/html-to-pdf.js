#!/usr/bin/env node

import * as path from 'node:path';
import * as url from 'node:url';
import { parseArgs } from 'node:util';
import { launch } from 'puppeteer';
const { values } = parseArgs({
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
const paperFormats = [
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
const input = values.input;
const output = values.output;
const format = values.format;
const isInputWebUri = input && /^https?:\/\//.test(input);
const isInputFileUri = input && /^file:\/\//.test(input);
if (!input) {
    throw 'Specify input file';
}
else if (!input.endsWith('.html') && !isInputWebUri) {
    throw 'Must provide html file as input';
}
if (!output) {
    throw 'Specify output file';
}
else if (!output.endsWith('.pdf')) {
    throw 'Must provide pdf file as output';
}
if (!paperFormats.includes(format)) {
    throw `Unknown format provided ${format}. Allowed Values: ${paperFormats.join(', ')}`;
}
const cwd = process.cwd();
let browserUrl = input;
if (!isInputWebUri && !isInputFileUri) {
    browserUrl = url
        .pathToFileURL(path.isAbsolute(input) ? input : path.join(cwd, input))
        .toString();
}
const browser = await launch();
const page = await browser.newPage();
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
