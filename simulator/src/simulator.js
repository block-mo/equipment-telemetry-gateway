// Load environment variables (.env) using ESM side-effect import
import "dotenv/config";

// Import axios for HTTP requests and WebSocket client
import axios from "axios";
import WebSocket from "ws";

// Read backend URL + device ID from environment (with defaults)
const BACKEND = process.env.BACKEND_URL || "http://localhost:4000/telemetry";
const WS_URL = process.env.WS_URL || "ws://localhost:4000/ws";
const DEVICE_ID = process.env.DEVICE_ID || "device-01";

// Command state
let paused = false;

// Connect to backend WebSocket to receive commands
const ws = new WebSocket(WS_URL);

ws.on("message", (data) => {
  try {
    const msg = JSON.parse(data.toString());
    if (msg.type === "command" && msg.payload.deviceId === DEVICE_ID) {
      const { action } = msg.payload;
      if (action === "stop") paused = true;
      if (action === "start") paused = false;
      console.log("command received:", action);
    }
  } catch (e) {
    console.error("ws message parse error", e.message);
  }
});

ws.on("error", (err) => console.error("ws error", err.message));

// Function that creates + sends telemetry to backend
async function sendTelemetry() {
  if (paused) return; // skip sending when paused

  const payload = {
    deviceId: DEVICE_ID,
    timestamp: new Date().toISOString(),
    temperature: 40 + Math.random() * 10, // random temp
    vibration: Math.random() * 5, // random vibration
    status: "OK",
  };

  try {
    await axios.post(BACKEND, payload); // send to backend
    console.log("sent", payload);
  } catch (e) {
    console.error("send failed", e.message);
  }
}

// Repeated send (every 2 seconds)
setInterval(sendTelemetry, 2000);

// Send first payload immediately
sendTelemetry();
