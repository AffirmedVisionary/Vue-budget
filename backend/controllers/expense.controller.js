const db = require("../models");
const Expense = db.expenses;

// Create and Save a new Expense
exports.create = (req, res) => {
    // validate request
    if (!req.body.name) {
        res.status(400).send({ message: "Missing content!" });
        return;
    }

    //Create an expense
    const expense = new Expense({
        name: req.body.name,
        purpose: req.body.purpose,
        firstDate: req.body.firstDate,
        expected: req.body.expected,
        frequency: req.body.frequency,
    })

    // save expense
    expense
        .save(expense)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Expense."
            });
        });
};

// Retrieve all Expenses from the database.
exports.findAll = (req, res) => {

};

// Find a single Expense with an id
exports.findOne = (req, res) => {

};

// Update a Expense by the id in the request
exports.update = (req, res) => {

};

// Delete a Expense with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Expenses from the database.
exports.deleteAll = (req, res) => {

};

// Find all unpaid Expenses
exports.findAllUnpaid = (req, res) => {

};
