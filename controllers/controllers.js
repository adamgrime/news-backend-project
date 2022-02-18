const res = require("express/lib/response")
const { checkExists } = require("../db/helpers/utils")
const { fetchTopics, fetchArticleById, updateVote, fetchUsers, fetchArticles, fetchComments } = require("../models/models")

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

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users})
    })
        .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({articles})
    })
        .catch((err) => {
        next(err)
    })
}

exports.getComments = (req, res, next) => {
    const { article_id } = req.params
    Promise.all([fetchComments(article_id), checkExists(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
        .catch((err) => {
        next(err)
    })
}