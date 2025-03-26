const Site = require("../models/site.model.js");

// Create and Save a new Site
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Site
  const site = new Site({
    url: req.body.url,
    domain: req.body.domain || extractDomain(req.body.url),
  });

  // Save Site in the database
  Site.create(site, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Site.",
      });
    } else {
      res.send(data);
    }
  });
};

// Retrieve all Sites from the database
exports.findAll = (req, res) => {
  Site.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving sites.",
      });
    } else {
      res.send(data);
    }
  });
};

// Find a single Site with a siteId
exports.findOne = (req, res) => {
  Site.findById(req.params.siteId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Site with id ${req.params.siteId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Site with id " + req.params.siteId,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Find or create a site by URL
exports.findOrCreateByUrl = (req, res) => {
  if (!req.body || !req.body.url) {
    res.status(400).send({
      message: "URL is required!",
    });
    return;
  }

  Site.findOrCreateByUrl(req.body.url, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while processing the site.",
      });
    } else {
      res.send(data);
    }
  });
};

// Update a Site identified by the siteId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Site.updateById(req.params.siteId, new Site(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Site with id ${req.params.siteId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Site with id " + req.params.siteId,
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Delete a Site with the specified siteId in the request
exports.delete = (req, res) => {
  Site.remove(req.params.siteId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Site with id ${req.params.siteId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Site with id " + req.params.siteId,
        });
      }
    } else {
      res.send({ message: `Site was deleted successfully!` });
    }
  });
};

// Helper function to extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url; // If URL parsing fails, use the original input
  }
}
