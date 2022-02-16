const res = require("express/lib/response")
const { fetchTopics, fetchArticleById, updateVote } = require("../models/models")

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

exports.patchVoteUpdate = (req, res, next) => {
    updateVote(req.body, req.params).then((updatedArticle) => res.status(201).send({ updatedArticle }))
        .catch((err) => {
        next(err)
    })
}