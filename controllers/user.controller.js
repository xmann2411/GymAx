const { where } = require("sequelize");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.lastname) {
    return res.status(400).send({
      message: "Name and lastname can not be empty!",
    });
  }

  console.log(req.body);
  // Create a User
  const user = {
    name: req.body.name,
    lastname: req.body.lastname,
    password: req.body.password,
    dateOfBirth: req.body.dateOfBirth,
    isPaid: req.body.isPaid,
    profilePicture: req.file ? req.file.buffer : null, // Save the file buffer
  };

  // Save User in the database
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

//dodavanje novog usera
//pa to je ovo gore? createa ga pa ga sejva

//dohvacanje svih usera

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.findOneUser = (req, res) => {
  const id = req.params.id;

  // findByPk(id): Ovo je metoda iz Sequelize koja traži zapis u bazi prema primarnom ključu (id)
  User.findByPk(id) // ili User.findOne({ where: { id: id } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

//edit usera
// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// izbrisi usera
// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

//  Get user picture
exports.getPicture = async (req, res) => {
  const id = req.params.id;
  const fs = require("fs");
  const path = require("path");

  const user = await User.findByPk(id);
  //console.log(user);

  if (user.profilePicture === null) {
    res.status(400).send({
      message: "Could not find picture for user with id=" + id,
    });
    return;
  }

  const image = path.join(
    __dirname,
    "../../Backend-gymcounter/images/",
    user.profilePicture
  );

  const file = fs.readFile(image, function (err, content) {
    var img = Buffer.from(content, "base64");
    console.log(img);
    res.writeHead(200, {
      "Content-Type": "image/jpg",
      "Content-Length": img.length,
    });
    res.end(img);
  });
  //console.log(file);
};

// Get all users pictures for backend
exports.getAllPictures = async (req, res) => {
  const fs = require("fs");
  const path = require("path");

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).send({
        message: "Could not retrieve images from the directory",
        error: err.message,
      });
    }

    if (imageFiles.length === 0) {
      return res.status(404).send({
        message: "No images found in the directory",
      });
    }

    // Prepare a response with the file names
    res.status(200).send({
      message: "Images retrieved successfully",
      images: imageFiles,
    });
  });
};
