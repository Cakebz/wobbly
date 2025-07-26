let socket;

function updateUI(telemetry) {
  document.getElementById("pitch").textContent = telemetry.gyro.pitch.toFixed(2);
  document.getElementById("roll").textContent = telemetry.gyro.roll.toFixed(2);
  document.getElementById("yaw").textContent = telemetry.gyro.yaw.toFixed(2);
  document.getElementById("battery").textContent = telemetry.battery + "%";
  document.getElementById("rpm1").textContent = telemetry.rpm1.toFixed(0);
  document.getElementById("rpm2").textContent = telemetry.rpm2.toFixed(0);
  document.getElementById("status").textContent = telemetry.status;
}

function addLog(msg) {
  const log = document.getElementById("log");
  log.value += `${new Date().toLocaleTimeString()} - ${msg}\n`;
  log.scrollTop = log.scrollHeight;
}

function sendCommand(cmd) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ cmd }));
    addLog(`Sent command: ${cmd}`);
  } else {
    addLog(`Cannot send command, socket not connected: ${cmd}`);
  }
}

function toggleAutoBalance(el) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ cmd: "autoBalance", enabled: el.checked }));
    addLog(`Auto Balance ${el.checked ? "enabled" : "disabled"}`);
  }
}

function setupWebSocket() {
  socket = new WebSocket("ws://192.168.8.103/ws");  // <-- REPLACE with your ESP32 IP

  socket.onopen = () => addLog("WebSocket connected");
  socket.onclose = () => {
    addLog("WebSocket disconnected. Reconnecting in 3 seconds...");
    setTimeout(setupWebSocket, 3000);
  };
  socket.onerror = () => {
    addLog("WebSocket error");
    socket.close();
  };
  socket.onmessage = (event) => {
    try {
      const telemetry = JSON.parse(event.data);
      updateUI(telemetry);
    } catch (e) {
      addLog("Invalid telemetry data");
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  setupWebSocket();

  document.querySelectorAll(".button-group button").forEach(button => {
    button.addEventListener("click", () => sendCommand(button.textContent.toLowerCase()));
  });

  document.getElementById("autoBalance").addEventListener("change", (e) => toggleAutoBalance(e.target));
});
