const express = require('express');
const { getTopics, getArticlesById, patchVoteUpdate, getUsers, getArticles, getComments, postComment } = require('./controllers/controllers');

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api/users", getUsers)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getComments)

app.post("/api/articles/article_id/comments", postComment)

app.get("/api/articles/:article_id", getArticlesById)

app.patch("/api/articles/:article_id", patchVoteUpdate)






app.all("/*", (req, res, next) => {
    console.log("inside all")
    res.status(404).send({msg: "Invalid URL"})
})

app.use((err, req, res, next) => {
      if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid input' });
  }
     if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else 
  //console.log(err);
  res.status(500).send('Server Error!');
});



module.exports = app;