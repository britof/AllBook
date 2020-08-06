const db = require('../models');
const Client = db.clients;

exports.create = (req, res) => {
    if(!req.body.name) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    const client = {
        name: req.body.name,
        active: false
    };

    Client.create(client)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: 
                    err.message || "Some error occurred while creating client"
            });
        });
}

exports.findOne = (req, res) => {
    const id = req.params.id;

    Client.findByPk(id)
          .then(data => {
               res.send(data);
          })
          .catch(err => {
               res.status(500).send({
                message: "Error retrieving by id="+id
              });
          });
}

exports.findAllActive = (req, res) => {
    Client.findAll({where: {active: true}})
          .then(data => {
              res.send(data);
          })
          .catch(err => {
              res.status(500).send({message: 
                err.message || "Some error occurred when retrieving clients"
              });
          });
};