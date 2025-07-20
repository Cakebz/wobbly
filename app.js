let gyroData = { pitch: 0, roll: 0, yaw: 0 };
let batteryLevel = 87;
let status = "Balancing";

let socket;

function updateUI() {
  document.getElementById("pitch").textContent = gyroData.pitch.toFixed(2);
  document.getElementById("roll").textContent = gyroData.roll.toFixed(2);
  document.getElementById("yaw").textContent = gyroData.yaw.toFixed(2);
  document.getElementById("battery").textContent = batteryLevel + "%";
  document.getElementById("status").textContent = status;
}

function toggleAutoBalance(el) {
  console.log("Auto Balance:", el.checked);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ cmd: "AUTO_BALANCE", enabled: el.checked }));
  }
}

function sendCommand(cmd) {
  const log = document.getElementById("log");
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ cmd }));
    log.value += `Sent command: ${cmd}\n`;
  } else {
    log.value += `Cannot send command, socket not connected: ${cmd}\n`;
  }
  log.scrollTop = log.scrollHeight;
}

function setupWebSocket() {
  socket = new WebSocket("ws://192.168.x.x/ws"); // Replace with your ESP32 IP

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.gyro) {
        gyroData = data.gyro;
      }
      if (data.battery !== undefined) {
        batteryLevel = data.battery;
      }
      if (data.status) {
        status = data.status;
      }
      updateUI();
    } catch (e) {
      console.warn("Invalid data from ESP32:", event.data);
    }
  };

  socket.onclose = () => {
    console.log("❌ WebSocket disconnected. Reconnecting in 3s...");
    setTimeout(setupWebSocket, 3000);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
    socket.close();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  setupWebSocket();

  // Example button event listeners, update these according to your HTML:
  document.getElementById("forwardBtn").addEventListener("click", () => sendCommand("FORWARD"));
  document.getElementById("backwardBtn").addEventListener("click", () => sendCommand("BACKWARD"));
  document.getElementById("autoBalanceToggle").addEventListener("change", (e) => toggleAutoBalance(e.target));
});
