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
     test('should respond with a 404 error if an invalid ID is passed in', () => {
        return request(app)
            .get(`/api/articles/banana`)
            .expect(400)
            .then(({ body }) => {
            expect(body.msg).toBe('Invalid input');
    });
    });
});