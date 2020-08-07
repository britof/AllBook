const db = require("../models");
const { response } = require("express");
const Schedule = db.schedules;
const Book = db.books;


exports.create = (req, res) => {
    /* schedule.controller.create(req, res)

    Creates a schedule row in the database

    *IF the book is with other client, it is created as a standard schedule
    *ELSE it is created as a rent

    *Cannot create a schedule before the book is back to the store

    req.body: {
        book_id: book's id,
        client_id: client's id,
        start_date: schedule's start,
        end_date: schedule's end
    }
    */
    
    //checks for dates coherence
    if(!req.body.start_date || !req.body.end_date) {
        res.status(400).send({message: "Invalid date"})
        return;
    } else if(Number(new Date(req.body.start_date)) > Number(new Date(req.body.end_date))) {
        res.status(400).send({message: "Invalid dates!"})
    }

    //check if the book is available
    Book.findByPk(req.body.book_id)
        .then(data => {
            var book = data.dataValues;
            //if the book is available, change this indicator to rent it
            if(book.available) {
                Book.update({available: false}, {where: {id: book.id}})
                    //create schedule
                    .then(() => {
                        const schedule = {
                            book_id: req.body.book_id,
                            client_id: req.body.client_id,
                            rent: book.available,
                            checked: false,
                            start_date: req.body.start_date,
                            end_date: req.body.end_date
                        }
                    
                        Schedule.create(schedule)
                                .then(data => {
                                    res.status(200).send(data);
                                })
                                .catch(err => {
                                    res.status(500).send({message: err});
                                });
                        })
                    .catch(err => {
                        return err;
                    });
            } else {
                Schedule.findAll({where: {book_id: book.id}})
                        .then(data => {
                            var schedules = data.map(schedule => {
                                return schedule.dataValues;
                            });

                            //get the last schedule
                            var last_schedule = {id: 0}, s;
                            for(s of schedules) {
                                if(s.id > last_schedule.id) {
                                    last_schedule = s;
                                }
                            }
                            //check if new schedule starts before the last ends
                            if(Number(new Date(last_schedule.end_date)) > Number(new Date(req.body.start_date))) {
                                res.status(400).send({message: "Cannot take a book before it is returned!"})
                                return;
                            } else {
                                const schedule = {
                                    book_id: req.body.book_id,
                                    client_id: req.body.client_id,
                                    rent: book.available,
                                    checked: false,
                                    start_date: req.body.start_date,
                                    end_date: req.body.end_date
                                }
                            
                                Schedule.create(schedule)
                                        .then(data => {
                                            res.status(200).send(data);
                                        })
                                        .catch(err => {
                                            res.status(500).send({message: err});
                                        });
                            }

                        })
                        .catch(err => {
                            res.status(500).send({message: "Error while retrieving last schedule"})
                            return err;
                        })
                
            }
        })
        .catch(err => {
            if(err) {
                res.status(500).send({error: err, message: "Some error occurred when retrieving book information"});
            }
        });
}

exports.findOne = (req, res) => {
    /* schedule.controller.findOne(req, res)
    
    Finds a schedule by it's ID

    req.body: {
        id: schedule's id
    }
    */
    const id = req.body.id;

    Schedule.findByPk(id)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({message: "Error while retrieving schedule"});
            });
}

exports.findAll = (req, res) => {
    /* schedule.controller.findAll(req, res)
    
    Finds all the schedules
    */
    Schedule.findAll()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({message: "Error while retrieving rents"});
            });
}

exports.findAllRents = (req, res) => {
    /* schedule.controller.findAllRents(req, res)
    
    Finds all the rents
    */
    Schedule.findAll({where: {rent: true}})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({message: "Error while retrieving rents"});
            });
}

exports.delete = (req, res) => {
    /* schedule.controller.delete(req, res)
    
    *IF it is a rent, update it to checked and update the book to available
    *ELSE delete the schedule

    req.body: {
        id: schedule's id
    }
    */
    Schedule.findByPk(req.body.id)
            .then(data => {
                const {book_id, id} = data.dataValues;
                if(data.dataValues.rent)
                {
                    Schedule.update({checked: true}, {where: {id: id}})
                            .then(n => {
                                console.log("AFFECTED:::::::::::::::::::::::"+n)
                                Book.update({available: true}, {where: {id: book_id}})
                                    .then(n_2 => {
                                        if(n_2 == 1) {
                                            res.status(200).send()
                                        }
                                        return book;
                                    })
                                    .catch(err => {
                                        res.status(500).send(err);
                                        return err;
                                    });
                            })
                            // .catch(err => {
                            //     res.send(err);
                            //     return err;
                            // })
                } else {
                    Schedule.destroy({where: {id: id}})
                            .then((schedule) => {
                                res.status(200).send(schedule);
                                return schedule;
                            })
                            .catch(err => {
                                res.status(500).send({message: "Error while deleting the schedule"});
                                return err;
                            })
                }
                response.status(200).send({message: "Successful operation"});
                return;
            })
            .catch(err => {
                console.log("ERROR")
                return err;
            })
}

exports.dashboard = async (req, res) => {
    /* schedule.controller.dashboard(req, res)
    
    Returns a weekly dashboard containing new rents and checked rents

    req.body: {
        date: first day of seven in the dashboard
    }
    */
    var date_in_number = Number(new Date(req.body.date));
    const day_in_milli = 86400000,
          week = ([0,1,2,3,4,5,6]).map((i) => {
            return date_in_number + (i* day_in_milli)});
    var dashboard = week.map(async (day) => {
        var current_date = new Date(day).toISOString().slice(0, 10);
        var rents = await Schedule.findAll({where: {start_date: current_date, rent: true}})
            .then(rents => {
                return rents[0].dataValues;
            })
            .catch(err => {
                return null;
            });
        var checks = await Schedule.findAll({where: {end_date: current_date, checked: true}})
            .then(checks => {
                return checks[0].dataValues;
            })
            .catch(err => {
                return null;
            });
        return {rents, checks};    
    });
    Promise.all(dashboard).then(dash => {
        console.log(dash);
        res.status(200).send(dash);
        return dash;
    })
}