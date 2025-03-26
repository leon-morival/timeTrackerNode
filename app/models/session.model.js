const sql = require("./db.js");

// Constructor
const Session = function (session) {
  this.user_id = session.user_id;
  this.start_time = session.start_time || new Date();
  this.end_time = session.end_time;
  this.duration = session.duration || 0;
};

// Create a new Session
Session.create = (newSession, result) => {
  sql.query("INSERT INTO sessions SET ?", newSession, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created session: ", { id: res.insertId, ...newSession });
    result(null, { id: res.insertId, ...newSession });
  });
};

// Find a Session by ID
Session.findById = (sessionId, result) => {
  sql.query("SELECT * FROM sessions WHERE id = ?", sessionId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found session: ", res[0]);
      result(null, res[0]);
      return;
    }

    // Session with the given ID not found
    result({ kind: "not_found" }, null);
  });
};

// Get all Sessions for a user
Session.getAllByUser = (userId, result) => {
  sql.query("SELECT * FROM sessions WHERE user_id = ?", userId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("sessions: ", res);
    result(null, res);
  });
};

// End a session and calculate duration
Session.endSession = (id, endTime, result) => {
  const now = endTime || new Date();

  // First get the session to calculate duration
  sql.query("SELECT * FROM sessions WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length === 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    const session = res[0];
    const startTime = new Date(session.start_time);
    const duration = Math.floor((now - startTime) / 1000); // duration in seconds

    // Update the session with end time and duration
    sql.query(
      "UPDATE sessions SET end_time = ?, duration = ?, updated_at = NOW() WHERE id = ?",
      [now, duration, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("ended session: ", {
          id: id,
          end_time: now,
          duration: duration,
        });
        result(null, { id: id, end_time: now, duration: duration });
      }
    );
  });
};

// Get active session for a user
Session.getActiveByUser = (userId, result) => {
  sql.query(
    "SELECT * FROM sessions WHERE user_id = ? AND end_time IS NULL",
    userId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found active session: ", res[0]);
        result(null, res[0]);
        return;
      }

      // No active session found
      result(null, null);
    }
  );
};

// Delete a Session by ID
Session.remove = (id, result) => {
  sql.query("DELETE FROM sessions WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // Session with the given ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted session with id: ", id);
    result(null, res);
  });
};

module.exports = Session;
