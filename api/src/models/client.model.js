

module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("client", {
        name: {
            type: Sequelize.STRING
        },
        active: {
            type: Sequelize.BOOLEAN
        },
    });

    return Client;
}