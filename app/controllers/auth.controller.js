const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");

// Register a new user
exports.signup = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a User object
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(409).send({
          message: "Email already in use!",
        });
        return;
      }
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
      return;
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = data;
    res.send(userWithoutPassword);
  });
};

// Log in a user
exports.signin = (req, res) => {
  // Validate request
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Email and password are required!",
    });
    return;
  }

  User.findByEmail(req.body.email, async (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `User with email ${req.body.email} not found.`,
        });
        return;
      }
      res.status(500).send({
        message: "Error retrieving user",
      });
      return;
    }

    // Compare passwords
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    // Send response
    res.status(200).send({
      id: user.id,
      email: user.email,
      name: user.name,
      accessToken: token,
    });
  });
};

// Get current user from token
exports.getCurrentUser = (req, res) => {
  User.findById(req.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `User not found.`,
        });
        return;
      }
      res.status(500).send({
        message: "Error retrieving current user",
      });
      return;
    }
    res.send(data);
  });
};
