exports.up = function(knex) {
  console.log("creating articles table");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title");
    articlesTable.text("body");
    articlesTable.integer("votes");
    articlesTable.string("topic").references("topics.slug");
    articlesTable.string("author").references("users.username");
    articlesTable.timestamp("created_at");
  });
};

exports.down = function(knex) {
  console.log("removing articles tables...");
  return knex.schema.dropTable("articles");
};
