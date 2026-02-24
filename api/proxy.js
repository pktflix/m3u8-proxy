export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing url");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Referer: new URL(url).origin,
        Origin: new URL(url).origin,
      },
    });

    let body = await response.text();
    const contentType = response.headers.get("content-type") || "";

    // 🔥 DASH manifest rewrite
    if (contentType.includes("application/dash+xml")) {
      const base = url.substring(0, url.lastIndexOf("/") + 1);

      body = body.replace(
        /(media|initialization)="(.*?)"/g,
        (match, p1, p2) => {
          if (p2.startsWith("http")) return match;
          return `${p1}="${req.headers.host}/api/proxy?url=${encodeURIComponent(
            base + p2
          )}"`;
        }
      );

      res.setHeader("Content-Type", "application/dash+xml");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).send(body);
    }

    // binary pass-through
    const buffer = await response.arrayBuffer();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send("Proxy error: " + e.message);
  }
}
