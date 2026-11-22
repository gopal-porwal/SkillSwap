const io = require("socket.io-client");

const USER_ID = "69a440d6a2875b7a022e205e";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
console.log("User A Connected:", socket.id);
socket.emit("register", USER_ID);
});

socket.on("notification", (data) => {
console.log("User A Notification:", data);
});