module.exports = (app) => {
  const sites = require("../controllers/site.controller.js");
  const { verifyToken } = require("../middleware/auth.middleware.js");

  // All site routes require authentication
  app.use("/api/sites", verifyToken);

  // Create a new Site
  app.post("/api/sites", sites.create);

  // Find or create a site by URL
  app.post("/api/sites/findOrCreate", sites.findOrCreateByUrl);

  // Retrieve all Sites
  app.get("/api/sites", sites.findAll);

  // Retrieve a single Site with siteId
  app.get("/api/sites/:siteId", sites.findOne);

  // Update a Site with siteId
  app.put("/api/sites/:siteId", sites.update);

  // Delete a Site with siteId
  app.delete("/api/sites/:siteId", sites.delete);
};
