const express = require("express");
const { getStreamUrl } = require("./downloader");

const app = express();

app.get("/api", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: "no url" });

  const stream = await getStreamUrl(url);
  res.json({ stream });
});

app.listen(3000, () => console.log("API running"));