const { where, Sequelize } = require("sequelize");
const db = require("../models");
const Loging = db.logings;
const User = db.users;
const Op = db.Sequelize.Op;

exports.createForUserId = async (req, res) => {
  let loging = {};
  const id = req.params.id;
  const lastLog = await Loging.findOne({
    where: { userId: id },
    order: [["createdAt", "DESC"]],
  });

  // Create a Loging
  if (lastLog === null) {
    loging = {
      LogDateTime: new Date(),
      LogType: "IN",
      userId: id,
    };
  } else {
    if (lastLog.LogType === "IN") {
      loging = {
        LogDateTime: new Date(),
        LogType: "OUT",
        userId: id,
      };
    } else {
      loging = {
        LogDateTime: new Date(),
        LogType: "IN",
        userId: id,
      };
    }
  }
  console.log(loging);
  //console.log(localTime);
  // Save User in the database
  Loging.create(loging)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Loging.",
      });
    });
};

// Retrive all Logs for userIdfrom the database
exports.findAllForUserId = (req, res) => {
  const id = req.params.id;
  var condition = id ? { userId: id } : null;

  if (!id) {
    res.status(400).send({
      message: err.message || "Bad request.",
    });
  }
  Loging.findAll({ where: condition, order: [["createdAt", "DESC"]] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving logs.",
      });
    });
};

exports.getAllInGym = (req, res) => {
  Loging.findAll({
    where: {
      [Op.and]: [
        {
          LogDateTime: {
            [Op.in]: [
              Sequelize.literal(
                `(SELECT MAX(LogDateTime) FROM logings GROUP BY userId)`
              ),
            ],
          },
        },
        { LogType: "IN" },
      ],
    },
    include: [{ model: User, attributes: ["name", "lastname"] }],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving logs.",
      });
    });
};
