const db = require("../db/connection");
const { checkExists } = require("../db/helpers/utils");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;")
       .then(({rows}) => {
            return rows;
    })
}

exports.fetchArticleById = (article_id) => {
    return db.query("SELECT articles.*, CAST(COUNT(comment_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",[article_id])
        .then(({ rows }) => {
            const article = rows[0]
            if (!article) {
                   return Promise.reject({
                    status: 404,
                    msg: `No article found for article_id: ${article_id}`,
             });
            }
         return article;
    })
}

exports.updateVote = (votes, articleId) => {
    const { article_id } = articleId
    const { inc_vote } = votes
    if (typeof (inc_vote) != "number") {
        return Promise.reject({
            status: 400,
            msg: "Bad Request"
        })
    }
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_vote, article_id])
        .then(({ rows }) => {
            const article = rows[0]
             if (!article) {
                   return Promise.reject({
                    status: 404,
                    msg: `Invalid ID`,
             });
             }
            return article;
        })
}

exports.fetchUsers = () => {
    return db.query("SELECT username FROM users;")
        .then(({ rows }) => {
            return rows
    })
}

exports.fetchArticles = () => {
    return db.query("SELECT * FROM articles")
        .then(({ rows }) => {
            return rows
        })
}

exports.fetchComments = (article_id) => {
  return db.query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      return rows;
    });
}
