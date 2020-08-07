const db = require('../models');
const Client = db.clients;

exports.create = (req, res) => {
    /* client.controller.create(req, res)
    
    Saves a new client
    
    req.body: {
        name: client's name
    }
    */
    if(!req.body.name) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    const client = {
        name: req.body.name,
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
    /* client.controller.create(req, res)
    
    Retrieves a client by it's ID
    
    req.body: {
        id: client's ID
    }
    */

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

exports.findAll = (req, res) => {
    /* client.controller.create(req, res)
    
    Retrieves all the clients
    
    */

    Client.findAll()
          .then(data => {
              res.send(data);
          })
          .catch(err => {
              res.status(500).send({message: 
                err.message || "Some error occurred when retrieving clients"
              });
          });
};