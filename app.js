let socket;

function updateUI(telemetry) {
  try {
    document.getElementById("pitch").textContent = telemetry.gyro.pitch.toFixed(2);
    document.getElementById("roll").textContent = telemetry.gyro.roll.toFixed(2);
    document.getElementById("yaw").textContent = telemetry.gyro.yaw.toFixed(2);
    document.getElementById("battery").textContent = telemetry.battery + "%";
    document.getElementById("rpm1").textContent = telemetry.rpm1.toFixed(0);
    document.getElementById("rpm2").textContent = telemetry.rpm2.toFixed(0);
    document.getElementById("status").textContent = telemetry.status || "Unknown";
  } catch (error) {
    addLog("Error updating UI: " + error.message);
  }
}

function addLog(message) {
  const logArea = document.getElementById("log");
  const timestamp = new Date().toLocaleTimeString();
  logArea.value += `${timestamp} - ${message}\n`;
  logArea.scrollTop = logArea.scrollHeight;
}

function sendCommand(command) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ cmd: command }));
    addLog(`Sent command: ${command}`);
  } else {
    addLog(`Failed to send command (disconnected): ${command}`);
  }
}

function toggleAutoBalance(checkbox) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ cmd: "autoBalance", enabled: checkbox.checked }));
    addLog(`Auto Balance ${checkbox.checked ? "enabled" : "disabled"}`);
  } else {
    addLog("Failed to toggle Auto Balance (socket disconnected)");
  }
}

function setupWebSocket() {
  socket = new WebSocket("ws://192.168.8.103:81");

  socket.addEventListener("open", () => {
    addLog("WebSocket connected");
  });

  socket.addEventListener("close", () => {
    addLog("WebSocket disconnected. Reconnecting in 3 seconds...");
    setTimeout(setupWebSocket, 3000);
  });

  socket.addEventListener("error", (err) => {
    addLog("WebSocket error: " + err.message);
    socket.close();
  });

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);
      updateUI(data);
    } catch (err) {
      addLog("Received invalid telemetry");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupWebSocket();

  // Setup control buttons
  document.querySelectorAll(".button-group button").forEach(button => {
    const command = button.dataset.command;
    if (command) {
      button.addEventListener("click", () => sendCommand(command));
    }
  });

  // Setup auto balance checkbox
  const autoBalanceCheckbox = document.getElementById("autoBalance");
  if (autoBalanceCheckbox) {
    autoBalanceCheckbox.addEventListener("change", () => toggleAutoBalance(autoBalanceCheckbox));
  }
});
