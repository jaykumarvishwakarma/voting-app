const express = require("express");
const bcrypt = require("bcrypt");

module.exports = function (prisma, sessions) {
  const router = express.Router();

  // Register
  // Register
  router.post("/register", async (req, res) => {
    const { username, password, name, phone } = req.body;

    if (!username || !password || !name || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const hash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          password: hash,
          name,
          phone,
        },
      });

      res.json({ message: "User registered", userId: user.id });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Username already exists or invalid data" });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const sessionId = Math.random().toString(36);
    sessions[sessionId] = user.id;
    res.json({ message: "Login successful", sessionId });
  });

  // Get current user profile and vote
  router.get("/me", async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        name: true,
        phone: true,
        vote: {
          select: {
            entity: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      phone: user.phone,
      vote: user.vote?.entity || null,
    });
  });

  // Create entity
  router.post("/entities", async (req, res) => {
    const { name } = req.body;
    const entity = await prisma.entity.create({ data: { name } });
    res.json(entity);
  });

  // Get entities
  router.get("/entities", async (req, res) => {
    const entities = await prisma.entity.findMany({ include: { votes: true } });
    const response = entities.map((e) => ({
      id: e.id,
      name: e.name,
      voteCount: e.votes.length,
    }));
    res.json(response);
  });
  //  get my vote
  router.get("/my-vote", async (req, res) => {
    const userId = req.userId;

    const vote = await prisma.vote.findUnique({
      where: { userId },
    });

    if (!vote) {
      return res.json({ entityId: null });
    }

    return res.json({ entityId: vote.entityId });
  });

  // Vote for entity
  // Vote for entity (create or update)
  router.post("/vote/:entityId", async (req, res) => {
    const userId = req.userId;
    const entityId = parseInt(req.params.entityId);

    try {
      const existingVote = await prisma.vote.findUnique({
        where: {
          userId,
        },
      });

      let vote;
      if (existingVote) {
        vote = await prisma.vote.update({
          where: { userId },
          data: { entityId },
        });
      } else {
        vote = await prisma.vote.create({
          data: { userId, entityId },
        });
      }

      res.json({ message: "Vote recorded", vote });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to record vote" });
    }
  });

  return router;
};
