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

describe('GET /api/articles/:article_id', () => {
    test('response should now include a comment_count', () => {
        return request(app)
            .get(`/api/articles/1`)
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toBeInstanceOf(Object)
                expect(article).toEqual(expect.objectContaining({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 100,
                    comment_count: 11
                }))
            })
    })
        test('should still return a comment count when there are 0 comments', () => {
        return request(app)
            .get(`/api/articles/2`)
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toBeInstanceOf(Object)
                expect(article).toEqual(expect.objectContaining({
                    article_id: 2,
                    title: "Sony Vaio; or, The Laptop",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                    created_at: expect.any(String),
                    votes: 0,
                    comment_count: 0
                }))
            })
    })
});

describe('Get /api/articles/:article_id/comments', () => {
    test('should repond with an array of comments for the given article id', () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toBeInstanceOf(Array)
                comments.forEach((comment) => {
                    expect(comment.hasOwnProperty("comment_id"))
                    expect(comment.hasOwnProperty("votes"))
                    expect(comment.hasOwnProperty("created_at"))
                    expect(comment.hasOwnProperty("author"))
                    expect(comment.hasOwnProperty("body"))
                })
            })
    });
    test('should return an empty array when passing a valid ID that has no comments', () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toEqual([])
            })
    });
    test('should respond with 404 not found when articleID is valid but does not exist', () => {
        return request(app)
            .get("/api/articles/1234567/comments")
            .expect(404)
            .then(({ body: { msg } }) => {
            expect(msg).toBe("Article not found");
        })
});
    test('status: 400 - responds with "invalid input" for invalid article_id', () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe('GET /api/articles (comment count)', () => {
    test("Each article object in the array should also now include a comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});