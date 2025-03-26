const Session = require("../models/session.model.js");

// Create and Save a new Session
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Session
  const session = new Session({
    user_id: req.userId, // Get user ID from JWT token
    start_time: req.body.start_time || new Date(),
    end_time: req.body.end_time || null,
    duration: req.body.duration || 0,
  });

  // Save Session in the database
  Session.create(session, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Session.",
      });
    } else {
      res.send(data);
    }
  });
};

// Retrieve all Sessions for the current user
exports.findAll = (req, res) => {
  Session.getAllByUser(req.userId, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sessions.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find a single Session with a sessionId
exports.findOne = (req, res) => {
  Session.findById(req.params.sessionId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Session with id ${req.params.sessionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Session with id " + req.params.sessionId,
        });
      }
    } else {
      // Check if the session belongs to the current user
      if (data.user_id !== req.userId) {
        return res.status(403).send({
          message: "You can only access your own sessions!",
        });
      }
      res.send(data);
    }
  });
};

// End a session
exports.endSession = (req, res) => {
  // First check if the session belongs to the current user
  Session.findById(req.params.sessionId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Session with id ${req.params.sessionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Session with id " + req.params.sessionId,
        });
      }
      return;
    }

    // Check if session belongs to current user
    if (data.user_id !== req.userId) {
      return res.status(403).send({
        message: "You can only end your own sessions!",
      });
    }

    // If session is already ended
    if (data.end_time !== null) {
      return res.status(400).send({
        message: "This session is already ended!",
      });
    }

    // End the session
    Session.endSession(
      req.params.sessionId,
      req.body.end_time || new Date(),
      (err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while ending the session.",
          });
        } else {
          res.send(data);
        }
      }
    );
  });
};

// Get active session for the current user
exports.getActiveSession = (req, res) => {
  Session.getActiveByUser(req.userId, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving active session.",
      });
    } else {
      res.send(data);
    }
  });
};

// Delete a Session with the specified sessionId in the request
exports.delete = (req, res) => {
  // First check if the session belongs to the current user
  Session.findById(req.params.sessionId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Session with id ${req.params.sessionId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Session with id " + req.params.sessionId,
        });
      }
      return;
    }

    // Check if session belongs to current user
    if (data.user_id !== req.userId) {
      return res.status(403).send({
        message: "You can only delete your own sessions!",
      });
    }

    // Delete the session
    Session.remove(req.params.sessionId, (err, data) => {
      if (err) {
        res.status(500).send({
          message: "Could not delete Session with id " + req.params.sessionId,
        });
      } else {
        res.send({ message: `Session was deleted successfully!` });
      }
    });
  });
};
