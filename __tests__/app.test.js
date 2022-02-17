const request = require("supertest");
const app = require("../app.js")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index.js")


beforeEach(() => seed(testData));
afterAll(() => db.end())

describe('GET /api/topics', () => {
    describe('GET /api/topics', () => {
    test('responds with an array of topic objects that have a "slug" and "description" property', () => {
      return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
              const { topics } = body;
              expect(topics).toBeInstanceOf(Array)
              expect(topics.length).toBe(3)
              topics.forEach((topic) => {
                  expect(topic.hasOwnProperty("slug"))
                  expect(topic.hasOwnProperty("description"))
              })
          })
          
     });
    })
});

describe('404 error for invalid URL', () => {
    test('should respond with a 404 error message when passed an invalid URL', () => {
        return request(app)
            .get('/notavalidurl')
            .expect(404)
         .then(({ body }) => {
         expect(body.msg).toBe('Invalid URL');
    });
    });
});

describe('GET /api/articles/:article_id', () => {
    test('should respond with an article object with the properties: author, title, article_id, body,topic,created_at & votes.', () => {
        return request(app)
            .get(`/api/articles/11`)
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toBeInstanceOf(Object)
                expect(article).toEqual(expect.objectContaining({
                     article_id: 11,
                    title: "Am I a cat?",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
                    created_at: expect.any(String),
                    votes: 0
                }))       
        })
    });
    test('should respond with a 404 error if an article ID that doesnt exist is passed in', () => {
        return request(app)
            .get(`/api/articles/999`)
            .expect(404)
            .then(({ body }) => {
            expect(body.msg).toBe('No article found for article_id: 999');
    });
    });
     test('should respond with a 400 error if an invalid ID is passed in', () => {
        return request(app)
            .get(`/api/articles/banana`)
            .expect(400)
            .then(({ body }) => {
            expect(body.msg).toBe('Invalid input');
    });
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('should respons with an updated object where the votes have changed by the number provided in the object', () => {
        return request(app)
        .patch("/api/articles/11")
        .send({inc_vote: -333})
        .expect(201)
            .then(({ body }) => {
                expect(body.updatedArticle).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    })
                )
            expect(body.updatedArticle.votes).toBe(-333)
            expect(body.updatedArticle.article_id).toBe(11)
        })
    });
    test('should respond with status 400 & bad request when the object value is not a number ', () => {
        return request(app)
        .patch("/api/articles/11")
        .send({inc_vote: "banana"})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
    });
    });
    test('should respond with status 400 & bad request when the provided object is empty ', () => {
        return request(app)
        .patch("/api/articles/11")
        .send({})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
    });
    });
    test('should respons with a status 404 error if an invalid ID is provided', () => {
         return request(app)
        .patch("/api/articles/99999")
        .send({inc_vote: 33})
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid ID');
    });
    });
    test('should respond with 400 & "Invalid input" for where the article ID is not a number', () => {
           return request(app)
        .patch("/api/articles/banana")
        .send({inc_vote: 14})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid input');
    });
    });
});

describe('GET /api/users', () => {
    test('responds with an array of username objects', () => {
      return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
              const { users } = body;
              expect(users).toBeInstanceOf(Array)
              expect(users.length).toBe(4)
              users.forEach((user) => {
                  expect(user.hasOwnProperty("username"))
              })
          })
          
     });
    })

     describe('GET /api/articles', () => {
        test('responds with an array of article objects', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles.length).toBe(12)
                    articles.forEach((article) => {
                        expect(article.hasOwnProperty("author"))
                        expect(article.hasOwnProperty("title"))
                        expect(article.hasOwnProperty("article_id"))
                        expect(article.hasOwnProperty("topic"))
                        expect(article.hasOwnProperty("created_at"))
                        expect(article.hasOwnProperty("votes"))
                    })
                })

        });
    })