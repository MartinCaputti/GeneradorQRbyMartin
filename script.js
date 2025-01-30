let currentQR = null;

function generateQR() {
  const input = document.getElementById("qr-input").value.trim();
  const qrcodeDiv = document.getElementById("qrcode");
  const foreground = document.getElementById("foreground").value;
  const background = document.getElementById("background").value;
  const size = document.getElementById("size").value;
  const downloadBtn = document.querySelector(".download-btn");

  qrcodeDiv.innerHTML = "";
  downloadBtn.disabled = true;

  if (!input) {
    showError("Por favor ingresa texto o una URL válida");
    return;
  }

  try {
    new QRCode(qrcodeDiv, {
      text: input,
      width: size,
      height: size,
      colorDark: foreground,
      colorLight: background,
      correctLevel: QRCode.CorrectLevel.H,
    });

    currentQR = qrcodeDiv.querySelector("canvas");
    downloadBtn.disabled = false;
    updateSizeDisplay(size);
  } catch (error) {
    showError("Error al generar el QR. Por favor intenta nuevamente.");
    console.error("QR Generation Error:", error);
  }
}

function generateDefaultQR() {
  const qrInput = document.getElementById("qr-input");
  qrInput.value = qrInput.dataset.default; // Set input to default URL
  generateQR(); // Generate the QR code
}

function downloadQR() {
  if (!currentQR) return;

  const link = document.createElement("a");
  link.download = `QR-${Date.now()}.png`;
  link.href = currentQR.toDataURL("image/png");
  link.click();
}

function updateSizeDisplay(size) {
  document.getElementById("size-value").textContent = size;
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;

  const container = document.querySelector(".container");
  container.insertBefore(errorDiv, container.firstChild);

  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// Event Listeners
document.getElementById("size").addEventListener("input", function (e) {
  updateSizeDisplay(e.target.value);
});

document.getElementById("qr-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") generateQR();
});

// Initialize default QR code on page load
window.addEventListener("load", function () {
  generateDefaultQR();
});

// Initialize size display
updateSizeDisplay(document.getElementById("size").value);
