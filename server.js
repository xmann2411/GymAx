const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
// db.sequelize.sync();
db.sequelize.sync({ alter: true });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to GymAx web application." });
});

// Include your routes  NOVO!!!!
require("./routes/user.routes")(app);
require("./routes/paymodel.routes")(app);
require("./routes/paylog.routes")(app);
require("./routes/loging.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
