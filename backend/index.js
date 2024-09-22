const express = require("express");
const ytdl = require("ytdl-core");

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/get-audio-info", async (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ status: "ERROR", message: "Invalid URL" });
  }

  try {
    const info = await ytdl.getInfo(url);
    res.json({
      status: "SUCCESS",
      title: info.videoDetails.title,
      streamUrl: `/stream-audio?url=${encodeURIComponent(url)}`,
    });
  } catch (error) {
    console.error("Error getting video info:", error);
    res
      .status(500)
      .json({ status: "ERROR", message: "Failed to get video info" });
  }
});

app.get("/stream-audio", (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.status(400).send("Invalid YouTube URL");
  }

  try {
    res.setHeader("Content-Type", "audio/webm");

    ytdl(url, {
      quality: "highestaudio",
      filter: "audioonly",
    }).pipe(res);
  } catch (error) {
    console.error("Streaming error:", error);
    res.status(500).send("Error occurred while streaming");
  }
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
