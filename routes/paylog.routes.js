module.exports = (app) => {
  const paylog = require("../controllers/paylog.controller.js");

  var router = require("express").Router();

  //create new
  router.post("/", paylog.create);

  //get all logs for userId
  router.get("/userid/:id", paylog.findAllForUserId);

  //update a log with id
  router.put("/:id", paylog.update);

  // delete a log with id
  router.delete("/:id", paylog.delete);

  //user with last paylog and paymodel
  router.get("/ispayed/:id", paylog.isPayed);

  app.use("/api/paylogs", router);
};
