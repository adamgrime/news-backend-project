const db = require("../db/connection");
const { checkExists } = require("../db/helpers/utils");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comment_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return article;
    });
};

exports.updateVote = (votes, articleId) => {
  const { article_id } = articleId;
  const voteNumber = votes.inc_vote;
  console.log(votes)
  console.log(voteNumber)
  console.log(typeof voteNumber)
  if (typeof voteNumber !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [voteNumber, article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `Invalid ID`,
        });
      }
      return article;
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT username FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = (sort_by, order, topic) => {
  if (!order) order = "DESC";
  if (!sort_by) sort_by = "created_at";

  const validOrdering = ["ASC", "DESC"];
  const validSorting = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validSorting.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!validOrdering.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryArray = [];
  let queryString =
    "SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";

  if (topic) {
    queryString += " WHERE articles.topic = $1";
    queryArray.push(topic);
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(queryString + ";", queryArray).then(({ rows }) => {
    return rows;
  });
};

exports.fetchComments = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, newComment) => {
  const { username, body } = newComment;
  if (!newComment) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*;`, [
    comment_id,
  ]);
};
