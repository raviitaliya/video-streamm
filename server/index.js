const express = require("express");
const fs = require("fs");
const app = express();

app.get("/video", (req, res) => {
  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Range not specified");
  }

  const videoPath = "./video/video.mkv";
  const videoSize = fs.statSync(videoPath).size;

  const CHUNK_SIZE = 5 * 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/x-matroska"
  };

  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
