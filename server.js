const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 10_000,
  cors: { origin: process.env.ALLOWED_ORIGIN || "*" }
});

const PORT = process.env.PORT || 3000;
const MAX_PEOPLE = 70;
const names = new Map();
const recentMessages = new Map();

app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.json({ ok: true, connected: io.engine.clientsCount, limit: MAX_PEOPLE }));

io.use((socket, next) => {
  if (io.engine.clientsCount >= MAX_PEOPLE) {
    return next(new Error("A sala atingiu o limite de 70 pessoas. Tente novamente mais tarde."));
  }
  next();
});

io.on("connection", (socket) => {
  socket.emit("welcome", { connected: io.engine.clientsCount, limit: MAX_PEOPLE });
  io.emit("presence", { connected: io.engine.clientsCount, limit: MAX_PEOPLE });

  socket.on("join", (rawName) => {
    const name = String(rawName || "Visitante").trim().replace(/[<>]/g, "").slice(0, 20) || "Visitante";
    names.set(socket.id, name);
    socket.emit("joined", { name });
    io.emit("system", `${name} entrou no chat.`);
  });

  socket.on("chat message", (rawText) => {
    const text = String(rawText || "").trim().slice(0, 500);
    if (!text || !names.has(socket.id)) return;

    const now = Date.now();
    const previous = recentMessages.get(socket.id) || 0;
    if (now - previous < 700) {
      socket.emit("notice", "Espere um pouquinho antes de enviar outra mensagem.");
      return;
    }
    recentMessages.set(socket.id, now);

    io.emit("chat message", {
      name: names.get(socket.id),
      text,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    });
  });

  socket.on("disconnect", () => {
    const name = names.get(socket.id);
    names.delete(socket.id);
    recentMessages.delete(socket.id);
    if (name) io.emit("system", `${name} saiu do chat.`);
    io.emit("presence", { connected: io.engine.clientsCount, limit: MAX_PEOPLE });
  });
});

server.listen(PORT, () => console.log(`Papo 70 rodando na porta ${PORT}`));
