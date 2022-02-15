const { fetchTopics } = require("../models/models")

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topic) => {
        res.status(200).send({ topics: topic })
    })
    .catch((err) => {
        next(err)
    })
}