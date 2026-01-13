const fetch = require("node-fetch");

async function getStreamUrl(teraboxLink) {
  try {
    const apiUrl =
      "https://teraboxdownloader.com/api?url=" +
      encodeURIComponent(teraboxLink);

    const res = await fetch(apiUrl, {
      headers: {
        "user-agent": "Mozilla/5.0"
      }
    });

    const data = await res.json();

    if (data.stream) return data.stream;
    if (data.download) return data.download;

    return null;
  } catch (e) {
    return null;
  }
}

module.exports = { getStreamUrl };
