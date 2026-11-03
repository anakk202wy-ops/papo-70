const socket = io();
const entry = document.getElementById("entry");
const chat = document.getElementById("chat");
const count = document.getElementById("count");
const messages = document.getElementById("messages");
const joinForm = document.getElementById("join-form");
const messageForm = document.getElementById("message-form");
const nickname = document.getElementById("nickname");
const messageInput = document.getElementById("message");

socket.on("connect_error", (err) => {
  alert(err.message || "Não foi possível entrar no chat.");
});
socket.on("presence", (data) => { count.textContent = data.connected; });
socket.on("welcome", (data) => { count.textContent = data.connected; });

joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nickname.value.trim();
  if (!name) return;
  socket.emit("join", name);
});
socket.on("joined", () => {
  entry.classList.add("hidden");
  chat.classList.remove("hidden");
  messageInput.focus();
});

function addSystem(text) {
  const el = document.createElement("div");
  el.className = "system";
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}
socket.on("system", addSystem);
socket.on("notice", addSystem);
socket.on("chat message", (data) => {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  const meta = document.createElement("div");
  meta.className = "meta";
  const author = document.createElement("strong");
  author.textContent = data.name;
  const time = document.createElement("span");
  time.textContent = data.time;
  const body = document.createElement("p");
  body.textContent = data.text;
  meta.append(author, time);
  bubble.append(meta, body);
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
});
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit("chat message", text);
  messageInput.value = "";
  messageInput.focus();
});
