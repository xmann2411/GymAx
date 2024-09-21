module.exports = (app) => {
  const loging = require("../controllers/loging.controller.js");

  var router = require("express").Router();

  // Create a new Log for userId
  router.post("/userid/:id", loging.createForUserId);

  // Retrive all Logs for userId
  router.get("/userid/:id", loging.findAllForUserId);

  // Retreave all Logs
  router.get("/ingym", loging.getAllInGym);

  app.use("/api/loging", router);
};
