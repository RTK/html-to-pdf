#!/usr/bin/env node
import * as path from 'node:path';
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
        }
    }
});
const input = values.input;
const output = values.output;
const isInputWebUri = input && /^https?:\/\//.test(input);
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
const cwd = process.cwd();
let url = input;
if (!isInputWebUri) {
    url = path.isAbsolute(input) ? input : path.join(cwd, input);
}
const browser = await launch();
const page = await browser.newPage();
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
