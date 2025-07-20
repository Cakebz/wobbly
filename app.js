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
  status = (status === "Balancing") ? "Manual Control" : "Balancing";
  updateUI();
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  const toggleBtn = document.getElementById("toggleMode");
  if (toggleBtn) toggleBtn.addEventListener("click", toggleMode);
});

// Simulate gyro updates
setInterval(() => {
  gyroData.pitch += (Math.random() - 0.5) * 2;
  gyroData.roll += (Math.random() - 0.5) * 2;
  gyroData.yaw += (Math.random() - 0.5) * 2;
  updateUI();
}, 2000);
