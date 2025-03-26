module.exports = (app) => {
  const sessionSites = require("../controllers/session-site.controller.js");
  const { verifyToken } = require("../middleware/auth.middleware.js");

  // All session-site routes require authentication
  app.use("/api/session-sites", verifyToken);

  // Create a new SessionSite record
  app.post("/api/session-sites", sessionSites.create);

  // Retrieve all SessionSites for a session
  app.get("/api/sessions/:sessionId/sites", sessionSites.findAllBySession);

  // Get active site for a session
  app.get(
    "/api/sessions/:sessionId/sites/active",
    sessionSites.getActiveBySession
  );

  // End a site visit
  app.put("/api/session-sites/:id/end", sessionSites.endVisit);

  // Delete a SessionSite record
  app.delete("/api/session-sites/:id", sessionSites.delete);
};
