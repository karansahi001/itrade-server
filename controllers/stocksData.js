const knex = require("knex")(require("../knexfile"));

const buy = (req, res) => {
    knex('stocks_bought')
        .insert(req.body)
        .then((data) => {
            return knex("stocks_bought").where({ id: data[0] })
        })
        .then((createdData) => {
            res.status(201).json(createdData);
        })
        .catch((err) =>
            res.status(500).send(`Unable to add this stock: ${err}`)
        );
};

module.exports = { buy }