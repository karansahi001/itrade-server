/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("stocks_bought", (table) => {
      table.increments("id").primary();
      table.string("user").notNullable();
      table.string("ticker").notNullable();
      table.string("qty").notNullable();
      table.string("price").notNullable();
      table.timestamp("bought_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("stocks_bought");
};
