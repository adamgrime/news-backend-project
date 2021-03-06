const express = require("express");
const cors = require("cors");
const {
  getTopics,
  getApi,
  getArticlesById,
  patchVoteUpdate,
  getUsers,
  getArticles,
  getComments,
  postComment,
  deleteCommentById,
  getEndpoints,
} = require("./controllers/controllers");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/articles/:article_id", getArticlesById);

app.patch("/api/articles/:article_id", patchVoteUpdate);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid URL" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err);
    res.status(500).send("Server Error!");
  }
});

module.exports = app;
