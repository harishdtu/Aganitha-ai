const express = require("express");
const cors = require("cors");

const healthRoute = require("./routes/health");
const pasteRoutes = require("./routes/pastes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/healthz", healthRoute);
app.use("/api/pastes", pasteRoutes);

module.exports = app;
