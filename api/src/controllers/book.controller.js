const db = require('../models');
const Book = db.books;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if(!req.body.title) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    const book = {
        title: req.body.title,
        author: req.body.author,
        cost: req.body.cost,
        available: true
    };

    Book.create(book)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the book."
            });
        });
}

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: {[Op.iLike]: `%${title}%`}} : null;

    Book.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving books."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Book.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving by id="+id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Book.update(req.body, {
        where: {id: id}
    })
        .then(num => {
            if(num==1) {
                res.send({
                    message: "Book was updated successfully"
                });
            } else {
                res.send({
                    message: `Cannot update Book with id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Book with id="+id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Book.destroy({
        where: {id: id}
    })
    .then(num => {
        if(num==1) {
            res.send({
                message: "Book was deleted successfully"
            });
        } else {
            res.send({
                message: "Cannot delete book with id="+id
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Cannot delete book with id="+id
        });
    });
};

exports.deleteAll = (req, res) => {
    Book.destroy({
        where: {},
        truncate: false
    })
        .then(num => {
            res.send({message: `${num+1} Books were deleted successfully`})
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all books"
            });
        });
};

exports.findAllAvailable = (req, res) => {
    Book.findAll({ where: { available: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving books"
            });
    });
};