const sql = require("./db.js");

// Constructor
const SessionSite = function (sessionSite) {
  this.session_id = sessionSite.session_id;
  this.site_id = sessionSite.site_id;
  this.start_time = sessionSite.start_time || new Date();
  this.end_time = sessionSite.end_time;
  this.duration = sessionSite.duration || 0;
};

// Create a new SessionSite record
SessionSite.create = (newSessionSite, result) => {
  sql.query("INSERT INTO session_sites SET ?", newSessionSite, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created session_site: ", {
      id: res.insertId,
      ...newSessionSite,
    });
    result(null, { id: res.insertId, ...newSessionSite });
  });
};

// Find a SessionSite by ID
SessionSite.findById = (id, result) => {
  sql.query("SELECT * FROM session_sites WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found session_site: ", res[0]);
      result(null, res[0]);
      return;
    }

    // SessionSite with the given ID not found
    result({ kind: "not_found" }, null);
  });
};

// Get all SessionSites for a session
SessionSite.getAllBySession = (sessionId, result) => {
  sql.query(
    `SELECT ss.*, s.url, s.domain 
     FROM session_sites ss 
     JOIN sites s ON ss.site_id = s.id 
     WHERE ss.session_id = ?`,
    sessionId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("session_sites: ", res);
      result(null, res);
    }
  );
};

// Get active session site for a session
SessionSite.getActiveBySession = (sessionId, result) => {
  sql.query(
    `SELECT ss.*, s.url, s.domain 
     FROM session_sites ss 
     JOIN sites s ON ss.site_id = s.id 
     WHERE ss.session_id = ? AND ss.end_time IS NULL`,
    sessionId,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found active session_site: ", res[0]);
        result(null, res[0]);
        return;
      }

      // No active session site found
      result(null, null);
    }
  );
};

// End a session site visit and calculate duration
SessionSite.endVisit = (id, endTime, result) => {
  const now = endTime || new Date();

  // First get the session site to calculate duration
  sql.query("SELECT * FROM session_sites WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length === 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    const sessionSite = res[0];
    const startTime = new Date(sessionSite.start_time);
    const duration = Math.floor((now - startTime) / 1000); // duration in seconds

    // Update the session site with end time and duration
    sql.query(
      "UPDATE session_sites SET end_time = ?, duration = ?, updated_at = NOW() WHERE id = ?",
      [now, duration, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("ended session_site: ", {
          id: id,
          end_time: now,
          duration: duration,
        });
        result(null, { id: id, end_time: now, duration: duration });
      }
    );
  });
};

// Delete a SessionSite by ID
SessionSite.remove = (id, result) => {
  sql.query("DELETE FROM session_sites WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // SessionSite with the given ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted session_site with id: ", id);
    result(null, res);
  });
};

module.exports = SessionSite;
