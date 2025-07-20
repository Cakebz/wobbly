
let gyroData = { pitch: 0, roll: 0, yaw: 0 };
let batteryLevel = 87;
let status = "Balancing";

function updateUI() {
  document.getElementById("pitch").textContent = gyroData.pitch.toFixed(2);
  document.getElementById("roll").textContent = gyroData.roll.toFixed(2);
  document.getElementById("yaw").textContent = gyroData.yaw.toFixed(2);
  document.getElementById("battery").textContent = batteryLevel + "%";
}

function toggleAutoBalance(el) {
  console.log("Auto Balance:", el.checked);
}

function sendCommand(cmd) {
  const log = document.getElementById("log");
  log.value += `Sent command: ${cmd}\n`;
  log.scrollTop = log.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
});

setInterval(() => {
  gyroData.pitch += (Math.random() - 0.5) * 2;
  gyroData.roll += (Math.random() - 0.5) * 2;
  gyroData.yaw += (Math.random() - 0.5) * 2;
  updateUI();
}, 2000);
