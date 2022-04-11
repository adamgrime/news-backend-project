const res = require("express/lib/response");
const { checkExists, checkItExists } = require("../db/helpers/utils");
const fs = require("fs");

const {
  fetchTopics,
  fetchArticleById,
  updateVote,
  fetchUsers,
  fetchArticles,
  fetchComments,
  removeComment,
  insertComment,
} = require("../models/models");

exports.getApi = (req, res, next) => {
  fs.readFile("endpoints.json", "utf8", function (err, data) {
    let allEndpoints = JSON.parse(data);
    res.status(200).send(allEndpoints);
  });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topic) => {
      res.status(200).send({ topics: topic });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVoteUpdate = (req, res, next) => {
  updateVote(req.body, req.params)
    .then((updatedArticle) => res.status(201).send({ updatedArticle }))
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchComments(article_id),
    checkItExists("articles", "article_id", article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  insertComment(article_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  Promise.all([
    checkItExists("comments", "comment_id", comment_id),
    removeComment(comment_id),
  ])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
