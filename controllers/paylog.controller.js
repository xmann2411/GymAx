const { where, Sequelize } = require("sequelize");
const db = require("../models");
const paymodelModel = require("../models/paymodel.model");
const PayLog = db.paylogs;
const User = db.users;
const PayModel = db.paymodels;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.PayDateTime) {
    res.status(400).send({
      message: "PayDateTime can not be empty!",
    });
    return;
  }

  if (!req.body.userId) {
    res.status(400).send({
      message: "userId can not be empty!",
    });
    return;
  }

  if (!req.body.paymodelId) {
    res.status(400).send({
      message: "paymodelId can not be empty!",
    });
    return;
  }

  if (!req.body.PayAmount) {
    res.status(400).send({
      message: "PayAmount can not be empty!",
    });
    return;
  }

  if (req.body.PayAmount <= 0) {
    console.log(req.body.PayAmount);
    res.status(400).send({
      message: "PayAmount must be greather then 0!",
    });
    return;
  }

  const paylog = {
    PayDateTime: req.body.PayDateTime,
    userId: req.body.userId,
    paymodelId: req.body.paymodelId,
    PayAmount: req.body.PayAmount,
  };

  PayLog.create(paylog)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the PayLog",
      });
    });
};

exports.findAllForUserId = (req, res) => {
  const id = req.params.id;
  var condition = id ? { userId: id } : null;

  if (!id) {
    res.status(400).send({
      message: err.message || "Bad request.",
    });
  }

  PayLog.findAll({ where: condition, order: [["createdAt", "DESC"]] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving paylog.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  PayLog.update(req.body, {
    where: { id, id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "PayLog was updated successfully.",
        });
      } else {
        res.send({
          message:
            "Cannot update PayLog with id=${id}. Maybe Paylog was not found or req.body is empty!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating PayLog with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  PayLog.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "PayLog was deleted successfully!",
        });
      } else {
        res.send({
          message:
            "Cannot delete PayLog with id=${id}. Maybe Paylog was not found!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Paylog with id=" + id,
      });
    });
};

// Check is payed for User
exports.isPayed = (req, res) => {
  const id = req.params.id;
  var condition = id ? { userId: id } : null;

  if (!id) {
    res.status(400).send({
      message: err.message || "Bad request.",
    });
  }

  PayLog.findOne({
    include: [
      {
        model: User,
        attributes: ["Name", "LastName"],
      },
      {
        model: PayModel,
        attributes: ["Name", "Description", "Price", "DurationDays"],
      },
    ],
    where: condition,
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving paylog.",
      });
    });
};
