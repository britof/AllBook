const db = require("../models");
const Schedule = db.schedules;

exports.create = (req, res) => {
    if(!req.body.start_date) {
        res.status(400).send({message: "Invalid start date."})
        return;
    }

    const schedule = {
        book_id: req.body.book_id,
        client_id: req.body.client_id,
        rent: req.body.rent,
        checked: req.body.checked,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    }

    Schedule.create(schedule)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({message: "Error while create schedule"});
            });
}

exports.findOne = (req, res) => {
    const id = req.body.id;

    Schedule.findByPk(id)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({message: "Error while retrieving schedule"});
            });
}

exports.findAllRents = (req, res) => {
    Schedule.findAll({where: {rent: true}})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({message: "Error while retrieving rents"});
            });
}

exports.delete = (req, res) => {
    const id = req.body.id;
    Schedule.destroy({where: {id: id}})
            .then(num => {
                if(num==1) {
                    res.send({
                        message: "Schedule was deleted successfully"
                    });
                } else {
                    res.send({
                        message: "Cannot delete schedule with id="+id
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Cannot delete schedule with id="+id
                });
            });
}

exports.dashboard = (req, res) => {
    var new_rents = [],
        to_check = [],
        in_a_day_rents = [],
        in_a_day_checks = [],
        in_a_week = [],
        date_in_number = Number(new Date(req.body.date));
    const day_in_milli = 86400000,
          week = ([0,1,2,3,4,5,6]).map((i) => {
            return date_in_number + (i* day_in_milli)});
    
    for(day of week) {
        var current_date = new Date(day).toISOString().slice(0, 10);
        Schedule.findAll({where: {start_date: current_date,
                                  checked: false}
                        })
                .then(data => {
                    new_rents.push(data);
                    in_a_day_checks.push(data);
                })
                .catch(err => {
                    res.status(500).send({message: err});
                })

        Schedule.findAll({where: {end_date: current_date,
                                checked: true}
                    })
                .then(data => {
                    to_check.concat(data);
                    in_a_day_rents.push(data);
                })
                    .catch(err => {
                    res.status(500).send({message: err});
                })
        in_a_week.push({checks: in_a_day_checks, 
                        rents: in_a_day_rents});
        in_a_day_rents = [];
        in_a_day_checks = [];
    }

    const dashboard = {
        total_new_rents: new_rents,
        total_to_check: to_check,
        week_schedules: in_a_week,
        c_total_rents: new_rents.length,
        c_total_checks: to_check.length,
        c_week_schedules: (in_a_week.map(tuple => {
            return [tuple.checks.length, tuple.rents.length];
        }))
    };

    res.send(dashboard);
}