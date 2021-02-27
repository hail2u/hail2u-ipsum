const fs = require("fs");

const sentences = JSON.parse(fs.readFileSync("articles.json"))
	.map((a) => {
		const txt = a.body.match(/<p>.*?<\/p>/gu)?.map((p) => {
		return p.replace(/<.*?>/gu, "");
		});

		if (txt) {
		return txt
			.join("")
			.split("。")
			.filter((s) => {
				if (!s || /^[!-»]+$/iu.test(s)) {
					return false;
				}

				return true;
			})
			.map((s) => `${s}。`);
		}

		return [];
	})
	.flat()
	.filter((s) => s);
fs.writeFileSync("sentences.json", JSON.stringify(sentences, null, "\t"));
