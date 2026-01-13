const { chromium } = require("playwright");

async function getStreamUrl(teraboxLink) {
  let streamUrl = null;

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // capture video stream from network
  page.on("requestfinished", (req) => {
    const url = req.url();
    if (!streamUrl && (url.includes(".mp4") || url.includes("video"))) {
      streamUrl = url;
    }
  });

  try {
    await page.goto("https://teraboxdl.site/", {
      waitUntil: "domcontentloaded"
    });

    // accept cookies if present
    try {
      await page.click('button:has-text("Accept All")', { timeout: 5000 });
    } catch {}

    // paste terabox link
    await page.waitForSelector('input[placeholder*="Terabox"]', { timeout: 10000 });
    await page.fill('input[placeholder*="Terabox"]', teraboxLink);

    // click Download & Stream
    await page.click('button:has-text("Download & Stream")');

    // wait and click play button
    await page.waitForSelector("svg.lucide-play", { timeout: 20000 });
    const play = await page.$("svg.lucide-play");
    const parent = await play.evaluateHandle(
      el => el.closest("button,div,span") || el
    );
    await parent.click();

    // wait for stream request
    await page.waitForTimeout(8000);

  } catch (e) {
    console.log("Error:", e.message);
  }

  await browser.close();
  return streamUrl;
}

module.exports = { getStreamUrl };
