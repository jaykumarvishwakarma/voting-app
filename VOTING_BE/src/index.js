const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const routes = require("./routes");

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

// In-memory sessions (shared)
const sessions = {};

// Middleware: parse JSON
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Global auth middleware (except /register and /login)
app.use((req, res, next) => {
  const publicPaths = ["/register", "/login"];
  if (publicPaths.includes(req.path)) return next();

  const sessionId = req.headers["x-session-id"];
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = sessions[sessionId];
  next();
});

// Mount all routes
app.use(routes(prisma, sessions));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
