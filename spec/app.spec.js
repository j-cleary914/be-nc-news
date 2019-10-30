process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const app = require("../app");
const chaiSorted = require("chai-sorted");

chai.use(chaiSorted);

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

    describe("invalid methods", () => {
      it("status:405, returns 405 when given an invalid method", () => {
        const invalidMethods = ["patch", "put", "delete", "post"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("you cant use that method!");
            });
        });
        return Promise.all(methodPromises);
      });
    });
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
    it("Get:404, returns error message for an invalid username", () => {
      return request(app)
        .get("/api/users/not-a-user-lol")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("no user with that username");
        });
    });
  });

  describe("/articles", () => {
    it("GET:200, does stuff", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          console.log(response.body);
        });
    });
  });

  describe("/articles/:article_id", () => {
    it("GET:200, recieves an an object with the required keys when article exists", () => {
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then(response => {
          // console.log(response.body);
          expect(response.body).to.have.all.keys([
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          ]);
          expect(response.body.article_id).to.equal(9);
        });
    });
    it("GET:404 returns error message when given an article_id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(response => {
          expect(response.body).to.eql({
            msg: "no article with that article_id"
          });
        });
    });
    it("PATCH updates the votes of an article by the given amount", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(response => {
          // console.log("ur in the app.spec!");
          // console.log(response.body.article);
          expect(response.body.article.votes).to.equal(110);
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("POST:201, returns posted comment", () => {
      return request(app)
        .post("/api/articles/9/comments")
        .send({ username: "butter_bridge", body: "a new and exciting comment" })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.have.all.keys([
            "author",
            "comment_id",
            "body",
            "article_id",
            "created_at",
            "votes"
          ]);
          expect(response.body.comment.body).to.equal(
            "a new and exciting comment"
          );
        });
    });
    it("GET:200, returns an array of all comments associated with an article given article_id", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(response => {
          //console.log(response.body);
          //expect it to be an array
          expect(response.body.comments[0]).to.have.all.keys([
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          ]);
        });
    });
    it("GET:200, sorts by a column provided in query, defaults to descending", () => {
      return request(app)
        .get("/api/articles/5/comments?sort_by=votes")
        .expect(200)
        .then(response => {
          //console.log(response.body);
          expect(response.body.comments).to.be.sortedBy("votes", {
            descending: true
          });
        });
    });
    it("GET:200, sorts the column by a specified order, asc or desc", () => {
      return request(app)
        .get("/api/articles/5/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(response => {
          //console.log(response.body);
          expect(response.body.comments).to.be.sortedBy("votes", {
            descending: false
          });
        });
    });
  });
});
