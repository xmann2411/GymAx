module.exports = (sequelize, Sequelize) => {
  const PayLog = sequelize.define("paylog", {
    PayDateTime: {
      type: Sequelize.DATE,
    },
    PayAmount: {
      type: Sequelize.DOUBLE,
    },
  });

  // {
  //   "PayDateTime": "03/03/2024",
  //   "PayAmount": "49",
  //   "userId": "12",
  //   "paymodelId": "2"
  // }

  return PayLog;
};
