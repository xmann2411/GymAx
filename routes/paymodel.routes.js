module.exports = (app) => {
  const loging = require("../controllers/paymodel.controller.js");

  var router = require("express").Router();

  // Create a new PostModel for userId
  router.post("/", loging.create);

  // get all paymodels
  router.get("/", loging.findAll);

  // Update with id
  router.put("/:id", loging.update);

  app.use("/api/paymodels", router);
};
