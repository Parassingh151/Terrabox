const express = require("express");
const { getStreamUrl } = require("./downloader");

const app = express();
const PORT = process.env.PORT || 3000;

// Home route
app.get("/", (req, res) => {
  res.send("TeraBox API is running");
});

// API route
app.get("/api", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ error: "no url provided" });

    const stream = await getStreamUrl(url);
    res.json({ stream });
  } catch (e) {
    res.json({ error: "failed to fetch stream" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
