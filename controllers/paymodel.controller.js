const { where, Sequalize } = require("sequelize");
const db = require("../models");
const PayModel = db.paymodels;
const Op = db.Sequelize.Op; //za operacije unutar sequelizera

exports.create = (req, res) => {
  if (!req.body.Name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  if (!req.body.Price) {
    res.status(400).send({
      message: "Price can not be empty!",
    });
    return;
  }

  if (!req.body.DurationDays) {
    res.status(400).send({
      message: "DurationDays can not be empty!",
    });
    return;
  }

  //Create paymodel
  const paymodel = {
    Name: req.body.Name,
    Description: req.body.Description,
    Price: req.body.Price,
    DurationDays: req.body.DurationDays,
  };

  // Save PayModel in the database
  PayModel.create(paymodel)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the PayModel.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  PayModel.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "PayModel was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update PayModel with id=${id}. Maybe PayModel was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating PayModel with id" + id,
      });
    });
};

// Find All Paymodels
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name
    ? {
        [Op.or]: [
          { Name: { [Op.like]: "%${name}" } },
          { Description: { [Op.like]: "%${name}%" } },
        ],
      }
    : null;

  PayModel.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving users.",
      });
    });
};
