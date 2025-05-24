export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) return res.status(400).send("No URL provided");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Referer": "http://example.com",
        "Origin": "http://example.com"
      }
    });

    if (!response.ok) {
      return res.status(response.status).send("Stream not accessible");
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const body = await response.arrayBuffer();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(body));
  } catch (e) {
    res.status(500).send("Proxy failed: " + e.message);
  }
}
