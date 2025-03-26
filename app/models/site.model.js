const sql = require("./db.js");

// Constructor
const Site = function (site) {
  this.url = site.url;
  this.domain = site.domain;
};

// Create a new Site
Site.create = (newSite, result) => {
  sql.query("INSERT INTO sites SET ?", newSite, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created site: ", { id: res.insertId, ...newSite });
    result(null, { id: res.insertId, ...newSite });
  });
};

// Find a Site by ID
Site.findById = (siteId, result) => {
  sql.query("SELECT * FROM sites WHERE id = ?", siteId, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found site: ", res[0]);
      result(null, res[0]);
      return;
    }

    // Site with the given ID not found
    result({ kind: "not_found" }, null);
  });
};

// Find or create a site by URL
Site.findOrCreateByUrl = (url, result) => {
  // Extract domain from URL
  let domain = "";
  try {
    const urlObj = new URL(url);
    domain = urlObj.hostname;
  } catch (e) {
    domain = url; // If URL parsing fails, use the original input
  }

  sql.query("SELECT * FROM sites WHERE url = ?", url, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // Site exists, return it
      console.log("found site: ", res[0]);
      result(null, res[0]);
      return;
    }

    // Site not found, create it
    const newSite = { url, domain };
    sql.query("INSERT INTO sites SET ?", newSite, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created site: ", { id: res.insertId, ...newSite });
      result(null, { id: res.insertId, ...newSite });
    });
  });
};

// Get all Sites
Site.getAll = (result) => {
  sql.query("SELECT * FROM sites", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("sites: ", res);
    result(null, res);
  });
};

// Update a Site by ID
Site.updateById = (id, site, result) => {
  sql.query(
    "UPDATE sites SET url = ?, domain = ?, updated_at = NOW() WHERE id = ?",
    [site.url, site.domain, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // Site with the given ID not found
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated site: ", { id: id, ...site });
      result(null, { id: id, ...site });
    }
  );
};

// Delete a Site by ID
Site.remove = (id, result) => {
  sql.query("DELETE FROM sites WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // Site with the given ID not found
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted site with id: ", id);
    result(null, res);
  });
};

module.exports = Site;
