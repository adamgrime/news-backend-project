const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;")
       .then(({rows}) => {
            return rows;
    })
}

exports.fetchArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
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
    console.log(article_id)
    const { inc_vote } = votes
    if (typeof (inc_vote) != "number") {
        return Promise.reject({
            status: 400,
            msg: "Bad Request"
        })
    }
    console.log(typeof (inc_vote))
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
            console.log(rows)
            return rows
    })
}