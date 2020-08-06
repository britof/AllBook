const { sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("book", {
        title: {
            type: Sequelize.STRING
        },
        author: {
            type: Sequelize.STRING
        },
        cost: {
            type: Sequelize.DOUBLE
        },
        available: {
            type: Sequelize.BOOLEAN
        }
    })
    return Book;
};