# html-to-pdf

## Prerequisites

Install node.js runtime 22 or above

## Usage

### CLI

#### Option 1

Use `npx` to execute.

`npx github:RTK/html-to-pdf --input <file.html> --output <file.pdf>`

#### Option 2

Install as dependency

`npm i github:RTK/html-to-pdf -D`

`html-to-pdf --input <file.html> --output <file.pdf>`

### Arguments

#### input

Path to a local `.html` file (relative or absolute path) _or_ a HTTP-URL (scheme either https or http).

#### output

Path to a `.pdf`-File. Can be absolute or relative. Will write and overwrite any existing file.
