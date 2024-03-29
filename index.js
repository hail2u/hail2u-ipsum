#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "fs";
import he from "he";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2), {
  alias: {
    amount: "a",
    format: "f",
    help: "h",
    type: "t",
    version: "v",
  },
  boolean: ["help", "version"],
  default: {
    amount: "5",
    format: "txt",
    help: false,
    type: "p",
    version: false,
  },
  string: ["amount", "format", "type"],
});
const pkgfile = new URL("./package.json", import.meta.url);
const pkg = JSON.parse(fs.readFileSync(pkgfile, "utf8"));

if (argv.help) {
  console.log(`${pkg.name} v${pkg.version}
  ${pkg.description}

Usage:
  npx github:hail2u/hail2u-ipsum [OPTION]...

Options:
  -a, --amount=NUMBER      set output amount (default: 5)
  -f, --format=(html|txt)  set output format (default: txt)
  -t, --type=(li|p)        set output type (default: p)
  -h, --help               display this help and exit
  -v, --version            output version number and exit
`);
  process.exit();
}

if (argv.version) {
  console.log(pkg.version);
  process.exit();
}

const amount = parseInt(argv.amount, 10);
const { format, type } = argv;

if (isNaN(amount) || amount < 1) {
  throw new Error("--amount must be positive number (default: 5)");
}

if (format !== "html" && format !== "txt") {
  throw new Error("--format must be “html” or “txt” (default: txt)");
}

if (type !== "li" && type !== "p") {
  throw new Error("--type must be “li” or “p” (default: p)");
}

const sentencesFile = new URL("./sentences.json", import.meta.url);
const sentences = JSON.parse(fs.readFileSync(sentencesFile, "utf8"));
let result = [];

for (let i = 0; i < amount; i++) {
  const bmount = Math.floor(Math.random() * 6 + 3);
  let block = [];

  for (let j = 0; j < bmount; j++) {
    block.push(sentences[Math.floor(Math.random() * sentences.length)]);
  }

  if (type === "li") {
    if (format === "html") {
      block = block.map((li) => `<li>${li}</li>`);
      block.unshift("<ul>");
      block.push("</ul>");
    } else {
      block = block.map((li) => `- ${li}`);
    }

    result.push(block.join("\n"));
    continue;
  }

  if (format === "html") {
    block.unshift("<p>");
    block.push("</p>");
  }

  result.push(block.join(""));
}

if (format === "txt") {
  result = result.map(he.decode);
}

console.log(result.join("\n\n"));
