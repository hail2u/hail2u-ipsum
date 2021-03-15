import fetch from "node-fetch";
import fs from "fs/promises";

const src = "https://github.com/hail2u/hail2u.net/raw/main/data/articles.json";

const main = async () => {
	const res = await fetch(src);
	const articles = await res.json();
	const sentences = articles.map((a) => {
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
	await fs.writeFile("sentences.json", JSON.stringify(sentences, null, "\t"));
};

main().catch((e) => {
	console.trace(e);
	process.exitCode = 1;
});
