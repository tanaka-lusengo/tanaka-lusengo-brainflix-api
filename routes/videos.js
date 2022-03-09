const router = require("express").Router();
const fs = require("fs");
const readFile = require("../utils/helpers");
const { v4: uuidv4 } = require("uuid");
const { uniqueNamesGenerator, starWars } = require("unique-names-generator");
const randomName = uniqueNamesGenerator({
  dictionaries: [starWars],
  style: "Capital",
});
const starwarsQuote = require("starwars");

// handling GET request for Video Data
router
  .get("/", (req, res) => {
    const fileContent = readFile("./data/videos.json");
    const videoList = fileContent.map((content) => {
      return {
        id: content.id,
        title: content.title,
        channel: content.channel,
        image: content.image,
      };
    });
    res.status(200).json(videoList);
  })
  .get("/:id", (req, res) => {
    const fileContent = readFile("./data/videos.json");
    const videoDetail = fileContent.find(
      (content) => content.id == req.params.id
    );
    res.status(200).json(videoDetail);
  });

// handling POST request for new video via upload page
router.post("/", (req, res) => {
  const newVid = {
    title: req.body.title,
    channel: `${randomName}`,
    image: "http://localhost:8080/" + "Upload-video-preview.jpg",
    description: req.body.description,
    views: "2,345",
    likes: 0,
    duration: "2:00",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [
      {
        name: `${randomName}`,
        comment: starwarsQuote(),
        likes: 0,
        timestamp: Date.now(),
      },
    ],
    id: uuidv4(),
  };
  const fileContent = readFile("./data/videos.json");
  fileContent.push(newVid);
  fs.writeFileSync("./data/videos.json", JSON.stringify(fileContent));

  const one_day_ms = 8640000;
  res.setHeader("cache-control", `public, max-age=${one_day_ms}`);
  res.status(201).json(newVid);
});

// handling POST request for comments
router.post("/:id/comments", (req, res) => {
  const newComment = {
    name: req.body.name,
    comment: req.body.comment,
    likes: 0,
    timestamp: Date.now(),
  };

  const fileContent = readFile("./data/videos.json");
  const videoDetail = fileContent.find((video) => video.id == req.params.id);
  videoDetail.comments.push(newComment);
  fs.writeFileSync("./data/videos.json", JSON.stringify(fileContent));
  res.status(201).json(newComment);
});

module.exports = router;
