module.exports = (sequelize, Sequelize) => {
  const PayModel = sequelize.define("paymodel", {
    Name: {
      type: Sequelize.STRING,
    },
    Description: {
      type: Sequelize.STRING,
    },
    Price: {
      type: Sequelize.DOUBLE,
    },
    DurationDays: {
      type: Sequelize.INTEGER,
    },
  });

  return PayModel;
};
