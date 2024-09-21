module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: Sequelize.STRING,
    },
    lastname: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    dateOfBirth: {
      type: Sequelize.DATE,
    },
    isPaid: {
      type: Sequelize.BOOLEAN,
    },
    profilePicture: {
      type: Sequelize.STRING,
    },
  });

  // {
  //   "name": "Jana",
  //   "lastname": "Mišković",
  //   "password": "pas",
  //   "dateOfBirth": "12/17/2003"
  // }

  return User;
};
