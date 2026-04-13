import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Track active users
  let activeUsers = 0;

  io.on("connection", (socket) => {
    activeUsers++;
    io.emit("user_count", activeUsers);
    console.log(`User connected. Total active: ${activeUsers}`);

    socket.on("disconnect", () => {
      activeUsers = Math.max(0, activeUsers - 1);
      io.emit("user_count", activeUsers);
      console.log(`User disconnected. Total active: ${activeUsers}`);
    });
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", activeUsers });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
