const sql = require("./db.js");
const bcrypt = require("bcryptjs");

// Constructor
const User = function (user) {
  this.email = user.email;
  this.name = user.name;
  this.password = user.password;
};

// Create a new User
User.create = async (newUser, result) => {
  // Hash password before saving
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

// Find a user by ID
User.findById = (userId, result) => {
  sql.query(
    "SELECT id, email, name, created_at, updated_at FROM users WHERE id = ?",
    userId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }

      // User with the given ID not found
      result({ kind: "not_found" }, null);
    }
  );
};

// Get all Users
User.getAll = (result) => {
  sql.query(
    "SELECT id, email, name, created_at, updated_at FROM users",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("users: ", res);
      result(null, res);
    }
  );
};

// Update a User by ID
User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET email = ?, name = ?, updated_at = NOW() WHERE id = ?",
    [user.email, user.name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // User with the given ID not found
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

// Find user by email
User.findByEmail = (email, result) => {
  sql.query("SELECT * FROM users WHERE email = ?", email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // User with the given email not found
    result({ kind: "not_found" }, null);
  });
};

// Delete a User by ID
User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // User with the given ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

module.exports = User;
