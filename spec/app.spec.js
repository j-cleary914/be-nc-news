process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const app = require("../app");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => {
    connection.destroy();
  });
  describe("/topics", () => {
    it("GET:200, returns an array of all the topics in the database", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          expect(response.body).to.eql([
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" }
          ]);
        });
    });

    //add some tests for invalid methods
    //create array of strings, each string is an invalid method
    //['post','patch'] .map to an array of the promise for each method
    //
  });
  describe("/users/:username", () => {
    it("GET:200, returns a user object with keys username, avatar_url, name", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(response => {
          expect(response.body).to.eql({
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
          });
        });
    });
  });
});
