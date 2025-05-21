import fs from "fs/promises";

const src = "https://github.com/hail2u/hail2u.net/raw/main/data/articles.json";
const abortController = new AbortController();
const abortID = setTimeout(() => {
  abortController.abort();
}, 5000);

try {
  const res = await fetch(src, {
    signal: abortController.signal,
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

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
} catch (e) {
  if (e.name === "AbortError") {
    throw new Error(`${src} does not respond in 5s.`);
  }

  throw e;
} finally {
  clearTimeout(abortID);
}
