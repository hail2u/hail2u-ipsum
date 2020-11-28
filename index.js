#!/usr/bin/env node

const decode = require("he").decode;
const fs = require("fs");
const minimist = require("minimist");

const argv = minimist(process.argv.slice(2), {
	"alias": {
		"amount": "a",
		"format": "f",
		"help": "h",
		"type": "t",
		"version": "v"
	},
	"boolean": [
		"help"
	],
	"default": {
		"amount": "5",
		"format": "txt",
		"help": false,
		"type": "p"
	},
	"string": [
		"amount",
		"format",
		"type"
	]
});
const pkg = require("./package.json");

if (argv.help) {
	console.log(`${pkg.name} v${pkg.version}
  ${pkg.description}

Usage:
  node index.js [OPTION]...

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
const format = argv.format;
const type = argv.type;

if (isNaN(amount) || amount < 1) {
	throw new Error("--amount must be positive number (default: 5)")
}

if (format !== "html" && format !== "txt") {
	throw new Error("--format must be “html” or “txt” (default: html)")
}

if (type !== "li" && type !== "p") {
	throw new Error("--type must be “li” or “p” (default: p)");
}

const sentences = JSON.parse(fs.readFileSync("./sentences.json", "utf8"));
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
	result = result.map(decode);
}

console.log(result.join("\n\n"));
