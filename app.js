const express = require('express');
const { getTopics } = require('./controllers/controllers');

const app = express();

app.get("/api/topics", getTopics)

app.all("/*", (req, res, next) => {
    console.log("inside all")
    res.status(404).send({msg: "Invalid URL"})
})

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Server Error!');
});



module.exports = app;