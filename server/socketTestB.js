const io = require("socket.io-client");

const USER_ID = "69a4419ba2875b7a022e2067";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
console.log("User B Connected:", socket.id);
socket.emit("register", USER_ID);
});

socket.on("notification", (data) => {
console.log("User B Notification:", data);
});