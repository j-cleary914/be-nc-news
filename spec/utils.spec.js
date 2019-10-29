const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("creates date object within the new objects", () => {
    let input = [{ created_at: 1542284514171 }];
    expect(formatDates(input)[0].created_at).to.be.an.instanceOf(Date);
  });
  it("retains all other keys of original object", () => {
    let input = [{ created_at: 1542284514171, a: 1, b: 2, c: 3 }];
    expect(formatDates(input)[0])
      .to.be.an("object")
      .that.has.all.keys(["a", "b", "c", "created_at"]);
  });
  it("works for larger arrays", () => {
    let input = [
      { created_at: 1542284514171, a: 1, b: 2, c: 3 },
      { created_at: 1542284514172, a: 1, b: 2, c: 3 },
      { created_at: 1542284514173, a: 1, b: 2, c: 3 },
      { created_at: 1542284514174, a: 1, b: 2, c: 3 }
    ];
    expect(formatDates(input)[0])
      .to.be.an("object")
      .that.has.all.keys(["a", "b", "c", "created_at"]);
    expect(formatDates(input)[1])
      .to.be.an("object")
      .that.has.all.keys(["a", "b", "c", "created_at"]);
    expect(formatDates(input)[2])
      .to.be.an("object")
      .that.has.all.keys(["a", "b", "c", "created_at"]);
    expect(formatDates(input)[3])
      .to.be.an("object")
      .that.has.all.keys(["a", "b", "c", "created_at"]);
    it("creates date object within the new objects", () => {
      let input = [{ created_at: 1542284514171 }];
      expect(formatDates(input)[0].created_at).to.be.an.instanceOf(Date);
    });
    it("creates date object within the new objects", () => {
      let input = [{ created_at: 1542284514171 }];
      expect(formatDates(input)[1].created_at).to.be.an.instanceOf(Date);
    });
    it("creates date object within the new objects", () => {
      let input = [{ created_at: 1542284514171 }];
      expect(formatDates(input)[2].created_at).to.be.an.instanceOf(Date);
    });
    it("creates date object within the new objects", () => {
      let input = [{ created_at: 1542284514171 }];
      expect(formatDates(input)[3].created_at).to.be.an.instanceOf(Date);
    });
  });
});

describe("makeRefObj", () => {
  it("creates a reference object for an array of 1 object provided with two keys", () => {
    let input = [[{ a: 1, b: 2, c: 3, d: 4 }], "b", "c"];
    expect(makeRefObj(...input)).to.eql({ 2: 3 });
  });
  it("creates a reference object for an array of many objects provided with two keys", () => {
    let input = [
      [
        { a: 1, b: 2, c: 3, d: 4 },
        { a: 1, b: 8, c: 99, d: 4 },
        { a: 1, b: "test", c: "3", d: 4 },
        { a: 1, b: "ooga", c: false, d: 4 }
      ],
      "b",
      "c"
    ];
    expect(makeRefObj(...input)).to.eql({
      2: 3,
      8: 99,
      test: "3",
      ooga: false
    });
  });
  it("creates a reference object for data in the format of our database", () => {
    let input = [
      [
        {
          article_id: 1,
          title: "abcdefg",
          body: "OOGA",
          votes: null,
          topic: "cooking",
          author: "happyamy2016"
        },
        {
          article_id: 2,
          title: "hijk",
          body: "OOGA",
          votes: null,
          topic: "cooking",
          author: "happyamy2016"
        },
        {
          article_id: 3,
          title: "lmnop",
          body: "OasdGA",
          votes: null,
          topic: "cooasdng",
          author: "happyasdy2016"
        }
      ],
      "title",
      "article_id"
    ];
    expect(makeRefObj(...input)).to.eql({
      abcdefg: 1,
      hijk: 2,
      lmnop: 3
    });
  });
});

describe("formatComments", () => {
  it("formats correctly when given an array of just a single object", () => {
    let input = [
      [
        {
          body: "Oh",
          belongs_to: "title_1",
          created_by: "commenter_1",
          votes: 16,
          created_at: 1511354163389
        }
      ],
      { title_1: 1 }
    ];
    expect(formatComments(...input)).to.eql([
      {
        body: "Oh",
        article_id: 1,
        author: "commenter_1",
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
  it("formats comments for larger arrays of comments", () => {
    let input = [
      [
        {
          body: "Oh",
          belongs_to: "title_1",
          created_by: "commenter_1",
          votes: 16,
          created_at: 1511354163387
        },
        {
          body: "no",
          belongs_to: "title_2",
          created_by: "commenter_2",
          votes: 16,
          created_at: 1511354163388
        },
        {
          body: "Oqweqwe",
          belongs_to: "title_3",
          created_by: "commenter_3",
          votes: 16,
          created_at: 1511354163389
        }
      ],
      { title_1: 314, title_2: 272, title_3: 808 }
    ];
    expect(formatComments(...input)).to.eql([
      {
        body: "Oh",
        article_id: 314,
        author: "commenter_1",
        votes: 16,
        created_at: 1511354163387
      },
      {
        body: "no",
        article_id: 272,
        author: "commenter_2",
        votes: 16,
        created_at: 1511354163388
      },
      {
        body: "Oqweqwe",
        article_id: 808,
        author: "commenter_3",
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
});
