const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Simple route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Time Tracker application." });
});

// Include routes
require("./app/routes/auth.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/site.routes.js")(app);
require("./app/routes/session.routes.js")(app);
require("./app/routes/session-site.routes.js")(app);

// Set port and listen for requests
const PORT = process.env.PORT;

console.log("PORT", PORT);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
