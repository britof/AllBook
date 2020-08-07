module.exports = (sequelize, Sequelize) => {
    const Schedule = sequelize.define("schedule", {
        book_id: {
            type: Sequelize.INTEGER
        },
        client_id: {
            type: Sequelize.INTEGER
        },
        rent: {
            type: Sequelize.BOOLEAN
        },
        checked: {
            type: Sequelize.BOOLEAN
        },
        start_date: {
            type: Sequelize.DATEONLY
        },
        end_date: {
            type: Sequelize.DATEONLY
        }
    });

    return Schedule;
}