const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});


module.exports = router;
