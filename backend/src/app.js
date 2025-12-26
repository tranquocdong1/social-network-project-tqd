const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/users.routes");
const postsRoutes = require("./modules/posts/posts.routes")
const interactionRoutes = require("./modules/interactions/interaction.routes")
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const replyRoutes = require("./modules/interactions/reply/reply.routes")

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);
app.use("/", interactionRoutes);
app.use("/", replyRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
