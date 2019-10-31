process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const chai = require("chai");
const { expect } = chai;
const request = require("supertest");
const app = require("../app");
const chaiSorted = require("sams-chai-sorted");

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
    describe("ERRORS:", () => {
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

    describe("ERRORS:", () => {
      it("Get:404, returns error message for an invalid username", () => {
        return request(app)
          .get("/api/users/not-a-user-lol")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("no user with that username");
          });
      });
      describe("invalid methods", () => {
        it("status:405, returns 405 when given an invalid method", () => {
          const invalidMethods = ["patch", "put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/butter_bridge")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("you cant use that method!");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });

  describe("/articles", () => {
    it("GET:200, returns an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("array");
          expect(response.body[0]).to.be.an("object");
        });
    });
    it("GET:200, articles in array have desired keys ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body[0]).to.have.all.keys([
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "author",
            "created_at",
            "comment_count"
          ]);
        });
    });
    it("GET:200, returns an array of articles sorted by date when no query provided", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          //console.log(response.body);
          expect(response.body).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET:200, returns an array of articles sorted by date taking in a query of asc/desc to sort them with", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.sortedBy("created_at", {
            descending: false
          });
        });
    });
    it("GET:200, returns an array of articles sorted by given column, defaulting to desc sort", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.sortedBy("comment_count", {
            descending: true
          });
        });
    });
    it("GET:200, returns an array of articles sorted by given column with order specified in query", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(response => {
          //console.log(response.body);
          expect(response.body).to.be.sortedBy("votes", {
            descending: false
          });
        });
    });
    it("GET:200, returns an array of articles filtered by author", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(response => {
          //console.log(response.body);
          response.body.forEach(article => {
            expect(article.author).to.equal("icellusedkars");
          });
        });
    });
    it("GET:200, returns an array of articles filtered by topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(response => {
          //console.log(response.body);
          response.body.forEach(article => {
            expect(article.topic).to.equal("cats");
          });
        });
    });
    describe("ERRORS:", () => {
      it("GET:400, returns 400 when passed an author that doesnt exist", () => {
        return request(app)
          .get("/api/articles?author=not-an-author")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "attempted to sort by author that doesn't exist"
            );
          });
      });
      //add test for it returns empty array when passed a valid topic with no comments in it
      it("GET:400, returns 400 when passed a column that doesnt exist", () => {
        return request(app)
          .get("/api/articles?topic=not-a-column")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "attempted to sort by topic that doesn't exist"
            );
          });
      });

      describe("invalid methods", () => {
        it("status:405, returns 405 when given an invalid method", () => {
          const invalidMethods = ["patch", "put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("you cant use that method!");
              });
          });
          return Promise.all(methodPromises);
        });
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

    it("PATCH updates the votes of an article by the given amount", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(response => {
          expect(response.body.article.votes).to.equal(110);
        });
    });
    describe("ERRORS:", () => {
      it("GET:400, throws an error when given an invalid article_id", () => {
        return request(app)
          .get("/api/articles/not-a-valid-id")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "invalid input syntax, not an integer"
            );
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
      describe("invalid methods", () => {
        it("status:405, returns 405 when given an invalid method", () => {
          const invalidMethods = ["put", "delete", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/1")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("you cant use that method!");
              });
          });
          return Promise.all(methodPromises);
        });
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
    describe("ERRORS:", () => {
      describe("invalid methods", () => {
        it("status:405, returns 405 when given an invalid method", () => {
          const invalidMethods = ["patch", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/5/comments")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("you cant use that method!");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });

  describe("/comments/:commend_id", () => {
    it("PATCH:200  updates the votes of an comment by the given amount", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(response => {
          expect(response.body.comment.votes).to.equal(26);
        });
    });
    it("PATCH:200  updates the votes of an comment by the given amount", () => {
      return request(app)
        .patch("/api/comments/8")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(response => {
          expect(response.body.comment.votes).to.equal(-1);
        });
    });
    it("DELETE:204  deletes the comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(response => {
          console.log(response.body);
          expect(response.body).to.eql({});
        });
    });
    describe("ERRORS:", () => {
      it("patch:400, throws an error when given an invalid comment_id", () => {
        return request(app)
          .patch("/api/comments/not-a-number")
          .expect(400)
          .then(response => {
            //console.log(response.body);
            expect(response.body.msg).to.equal(
              "invalid input syntax, not an integer"
            );
          });
      });

      it("DELETE:404  returns 404 if a comment that doesnt exist", () => {
        return request(app)
          .delete("/api/comments/1111")
          .expect(404)
          .then(response => {
            //console.log(response.body);
            expect(response.body.msg).to.eql(
              "no comment with that comment_id exists"
            );
          });
      });

      describe("invalid methods", () => {
        it("status:405, returns 405 when given an invalid method", () => {
          const invalidMethods = ["get", "put", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments/8")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("you cant use that method!");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
