const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);
  // router.post("/", upload.single("profilePicture"), users.create);

  // Retrieve all Users
  router.get("/", users.findAll);

  router.get("/:id", users.findOneUser);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // Get user picture
  router.get("/picture/:id", users.getPicture);

  router.get("/picture", users.getAllPictures);

  //zakaj je tu api
  app.use("/api/users", router);
};
