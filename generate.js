import fetch from "node-fetch";
import fs from "fs/promises";

const src = "https://github.com/hail2u/hail2u.net/raw/main/data/articles.json";

const main = async () => {
	const res = await fetch(src);
	const articles = await res.json();
	const sentences = articles
		.map((article) => {
			if (article.link.startsWith("/documents/")) {
				return [];
			}

			const txt = article.body
				.match(/<p>.*?<\/p>/gu)
				?.map((p) => p.replace(/<.*?>/gu, ""))
				.join("");

			if (txt) {
				return txt
					.split("。")
					.filter((sentence) => {
						if (!sentence || /^[!-»]+$/iu.test(sentence)) {
							return false;
						}

						return true;
					})
					.map((sentence) => `${sentence}。`);
			}

			return [];
		})
		.flat()
		.filter((sentence) => sentence);
	await fs.writeFile("sentences.json", JSON.stringify(sentences, null, 2));
};

main().catch((e) => {
	console.trace(e);
	process.exitCode = 1;
});
