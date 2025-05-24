export default async function handler(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("No URL provided");
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    const body = await response.arrayBuffer();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(body));
  } catch (error) {
    res.status(500).send("Failed to fetch stream");
  }
}
