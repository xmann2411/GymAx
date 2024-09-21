const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const paylogModel = require("./paylog.model.js");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.logings = require("./loging.model.js")(sequelize, Sequelize);
db.paylogs = require("./paylog.model.js")(sequelize, Sequelize);
db.paymodels = require("./paymodel.model.js")(sequelize, Sequelize);

const User = db.users;
const Loging = db.logings;
const PayLog = db.paylogs;
const PayModel = db.paymodels;

User.hasMany(Loging, {
  foregnKey: {
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Loging.belongsTo(User);

User.hasMany(PayLog, {
  foregnKey: {
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PayLog.belongsTo(User);

PayModel.hasMany(PayLog, {
  foregnKey: {
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PayLog.belongsTo(PayModel);

module.exports = db;
