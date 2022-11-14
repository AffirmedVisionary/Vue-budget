const db = require("../models");
const Expense = db.expenses;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };

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
const { page, size, name } = req.query;
const condition = name ? { name: { $$regex: new RegExp(name), $options: "i" }} : {}

const { limit, offset } = getPagination(page, size);

Expense.paginate(condition, { offset, limit })
.then((data) => {
  res.send({
    totalItems: data.totalDocs,
    expenses: data.docs,
    totalPages: data.totalPages,
    currentPage: data.page - 1,
  });
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occured while retrieving expenses"
    })
})
};

// Find a single Expense with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Expense.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Expense with the id " + id + " not found!" });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Expense with id=" + id });
      });
  };
  

// Update a Expense by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Expense.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Expense with id=${id}. Maybe Expense was not found!`
          });
        } else res.send({ message: "Expense was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Expense with id=" + id
        });
      });
  };

// Delete a Expense with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Expense.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Expense with id=${id}. Maybe Expense was not found!`
          });
        } else {
          res.send({
            message: "Expense was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Expense with id=" + id
        });
      });
  };

// Delete all Expenses from the database.
exports.deleteAll = (req, res) => {
    Expense.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Expenses were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all expenses."
        });
      });
  };

// Find all unpaid Expenses
exports.findAllUpToDate = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    Expense.find({ upToDate: true }, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        expenses: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving expenses."
      });
    });
};
