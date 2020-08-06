module.exports = (app) => {
    const books = require('../controllers/book.controller');
    const clients = require('../controllers/client.controller');
    const schedules = require('../controllers/schedule.controller');

    var router = require('express').Router();

    router.post("/new-book", books.create);
    router.get("/allbook", books.findAll);
    router.get("/book-available", books.findAllAvailable);
    router.get("/book/:id", books.findOne);
    router.put("/book/:id", books.update);
    router.delete("/book/:id", books.delete);
    router.delete("/books", books.deleteAll);

    router.post("/new-client", clients.create);
    router.get("/client/:id", clients.findOne);
    router.get("/active-clients");

    router.post("/new-schedule", schedules.create);
    router.get("/schedule/:id", schedules.findOne);
    router.get("/rents", schedules.findAllRents);

    app.use("/allbook-api", router);
}