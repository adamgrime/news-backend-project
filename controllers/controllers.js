const res = require("express/lib/response")
const { fetchTopics, fetchArticleById } = require("../models/models")

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topic) => {
        res.status(200).send({ topics: topic })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticlesById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article: article})
    })
        .catch((err) => {
        next(err)
    })
}