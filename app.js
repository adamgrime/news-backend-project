const express = require('express');
const { getTopics, getArticlesById } = require('./controllers/controllers');

const app = express();

app.get("/api/topics", getTopics)




app.get("/api/articles/:article_id", getArticlesById)






app.all("/*", (req, res, next) => {
    console.log("inside all")
    res.status(404).send({msg: "Invalid URL"})
})

app.use((err, req, res, next) => {
     if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  console.log(err);
  res.status(500).send('Server Error!');
});



module.exports = app;