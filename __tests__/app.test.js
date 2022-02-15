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

