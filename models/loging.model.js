module.exports = (sequelize, Sequelize) => {
  const Loging = sequelize.define("loging", {
    LogDateTime: {
      type: Sequelize.DATE,
    },
    LogType: {
      type: Sequelize.STRING, // IN or OUT
    },
  });

  return Loging;
};
