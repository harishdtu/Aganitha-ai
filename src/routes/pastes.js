const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const { now } = require("../utils/time");

const router = express.Router();

/**
 * POST /api/pastes
 */
router.post("/", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const id = uuidv4();
  const createdAt = now(req);
  const expiresAt = ttl_seconds
    ? new Date(createdAt.getTime() + ttl_seconds * 1000)
    : null;

  await db.query(
    `INSERT INTO pastes (id, content, created_at, expires_at, max_views)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, content, createdAt, expiresAt, max_views ?? null]
  );

  res.status(201).json({
    id,
    url: `${req.protocol}://${req.get("host")}/p/${id}`,
  });
});

/**
 * GET /api/pastes/:id
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await db.query(
    `SELECT * FROM pastes WHERE id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  const paste = result.rows[0];
  const currentTime = now(req);

  // TTL check
  if (paste.expires_at && currentTime > paste.expires_at) {
    return res.status(404).json({ error: "Expired" });
  }

  // View limit check
  if (paste.max_views !== null && paste.view_count >= paste.max_views) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  // Atomic view increment
  await db.query(
    `UPDATE pastes SET view_count = view_count + 1 WHERE id = $1`,
    [id]
  );

  const remainingViews =
    paste.max_views !== null
      ? Math.max(paste.max_views - (paste.view_count + 1), 0)
      : null;

  res.json({
    content: paste.content,
    remaining_views: remainingViews,
    expires_at: paste.expires_at,
  });
});


/**
 * GET /p/:id
 */
router.get("/view/:id", async (req, res) => {
  const { id } = req.params;

  const result = await db.query(`SELECT * FROM pastes WHERE id = $1`, [id]);
  if (result.rowCount === 0) return res.status(404).send("Not found");

  const paste = result.rows[0];
  const currentTime = now(req);

  if (
    (paste.expires_at && currentTime > paste.expires_at) ||
    (paste.max_views !== null && paste.view_count >= paste.max_views)
  ) {
    return res.status(404).send("Not found");
  }

  res.status(200).send(`
    <html>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
    </html>
  `);
});

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = router;
