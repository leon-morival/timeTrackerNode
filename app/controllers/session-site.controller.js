const SessionSite = require("../models/session-site.model.js");
const Session = require("../models/session.model.js");
const Site = require("../models/site.model.js");

// Create and Save a new SessionSite record
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  if (!req.body.session_id || !req.body.url) {
    res.status(400).send({
      message: "Session ID and URL are required!",
    });
    return;
  }

  // Check if the session belongs to the current user
  Session.findById(req.body.session_id, (err, sessionData) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Session with id ${req.body.session_id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Session with id " + req.body.session_id,
        });
      }
      return;
    }

    // Verify session belongs to current user
    if (sessionData.user_id !== req.userId) {
      return res.status(403).send({
        message: "You can only track sites for your own sessions!",
      });
    }

    // Find or create the site
    Site.findOrCreateByUrl(req.body.url, (err, siteData) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while processing the site.",
        });
        return;
      }

      // Create a SessionSite record
      const sessionSite = new SessionSite({
        session_id: req.body.session_id,
        site_id: siteData.id,
        start_time: req.body.start_time || new Date(),
        end_time: req.body.end_time || null,
        duration: req.body.duration || 0,
      });

      // Save SessionSite in the database
      SessionSite.create(sessionSite, (err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating the session site record.",
          });
        } else {
          res.send({
            ...data,
            url: siteData.url,
            domain: siteData.domain,
          });
        }
      });
    });
  });
};

// Retrieve all SessionSites for a specific session
exports.findAllBySession = (req, res) => {
  // Check if the session belongs to the current user
  Session.findById(req.params.sessionId, (err, sessionData) => {
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

    // Verify session belongs to current user
    if (sessionData.user_id !== req.userId) {
      return res.status(403).send({
        message: "You can only access site data for your own sessions!",
      });
    }

    SessionSite.getAllBySession(req.params.sessionId, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving session sites.",
        });
      } else {
        res.send(data);
      }
    });
  });
};

// Find active site for a session
exports.getActiveBySession = (req, res) => {
  // Check if the session belongs to the current user
  Session.findById(req.params.sessionId, (err, sessionData) => {
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

    // Verify session belongs to current user
    if (sessionData.user_id !== req.userId) {
      return res.status(403).send({
        message: "You can only access site data for your own sessions!",
      });
    }

    SessionSite.getActiveBySession(req.params.sessionId, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving active session site.",
        });
      } else {
        res.send(data);
      }
    });
  });
};

// End a site visit
exports.endVisit = (req, res) => {
  // First find the session site record
  SessionSite.findById(req.params.id, (err, ssData) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Session Site record with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving Session Site record with id " + req.params.id,
        });
      }
      return;
    }

    // Check if the session belongs to the current user
    Session.findById(ssData.session_id, (err, sessionData) => {
      if (err) {
        res.status(500).send({
          message: "Error retrieving Session",
        });
        return;
      }

      // Verify session belongs to current user
      if (sessionData.user_id !== req.userId) {
        return res.status(403).send({
          message: "You can only end site visits for your own sessions!",
        });
      }

      // End the visit
      SessionSite.endVisit(
        req.params.id,
        req.body.end_time || new Date(),
        (err, data) => {
          if (err) {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while ending the site visit.",
            });
          } else {
            res.send(data);
          }
        }
      );
    });
  });
};

// Delete a SessionSite record
exports.delete = (req, res) => {
  // First find the session site record
  SessionSite.findById(req.params.id, (err, ssData) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Session Site record with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving Session Site record with id " + req.params.id,
        });
      }
      return;
    }

    // Check if the session belongs to the current user
    Session.findById(ssData.session_id, (err, sessionData) => {
      if (err) {
        res.status(500).send({
          message: "Error retrieving Session",
        });
        return;
      }

      // Verify session belongs to current user
      if (sessionData.user_id !== req.userId) {
        return res.status(403).send({
          message: "You can only delete site visits for your own sessions!",
        });
      }

      // Delete the record
      SessionSite.remove(req.params.id, (err, data) => {
        if (err) {
          res.status(500).send({
            message:
              "Could not delete Session Site record with id " + req.params.id,
          });
        } else {
          res.send({
            message: `Session Site record was deleted successfully!`,
          });
        }
      });
    });
  });
};
