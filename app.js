// Simulated values – replace with live data fetching (e.g., via WebSocket, Firebase, etc.)
let gyroData = { pitch: 0, roll: 0, yaw: 0 };
let batteryLevel = 87;
let status = "Balancing";

function updateUI() {
  document.getElementById("pitch").textContent = gyroData.pitch.toFixed(2);
  document.getElementById("roll").textContent = gyroData.roll.toFixed(2);
  document.getElementById("yaw").textContent = gyroData.yaw.toFixed(2);
  document.getElementById("battery").textContent = batteryLevel + "%";
  document.getElementById("status").textContent = status;
}

function toggleMode() {
  if (status === "Balancing") {
    status = "Manual Control";
  } else {
    status = "Balancing";
  }
  updateUI();
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  document.getElementById("toggleMode").addEventListener("click", toggleMode);
});

// Optional: simulate live data updates
setInterval(() => {
  gyroData.pitch += (Math.random() - 0.5) * 2;
  gyroData.roll += (Math.random() - 0.5) * 2;
  gyroData.yaw += (Math.random() - 0.5) * 2;
  updateUI();
}, 2000);
