let currentQR = null;
let logoImage = null;

// Logo Upload Handler
document.getElementById("logo-upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    logoImage = new Image();
    logoImage.onload = () => {
      // Regenerar QR si ya existe uno
      if (document.getElementById("qrcode").children.length > 0) {
        generateQR();
      }
    };
    logoImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

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
    const qrCode = new QRCode(qrcodeDiv, {
      text: input,
      width: size,
      height: size,
      colorDark: foreground,
      colorLight: background,
      correctLevel: QRCode.CorrectLevel.H,
    });

    setTimeout(() => {
      const qrCanvas = qrcodeDiv.querySelector("canvas");
      if (!qrCanvas) return;

      const ctx = qrCanvas.getContext("2d");
      if (logoImage) {
        const logoSize = Math.min(size * 0.2, 100); // Máximo 20% del QR
        const x = (qrCanvas.width - logoSize) / 2;
        const y = (qrCanvas.height - logoSize) / 2;

        ctx.fillStyle = background;
        ctx.fillRect(x, y, logoSize, logoSize);
        ctx.drawImage(logoImage, x, y, logoSize, logoSize);
      }

      // Reemplazar vista previa con imagen del QR generado
      const qrImage = new Image();
      qrImage.src = qrCanvas.toDataURL("image/png");
      qrcodeDiv.innerHTML = "";
      qrcodeDiv.appendChild(qrImage);

      currentQR = qrCanvas;
      downloadBtn.disabled = false;
      updateSizeDisplay(size);
    }, 500);
  } catch (error) {
    showError("Error al generar el QR. Por favor intenta nuevamente.");
    console.error("QR Generation Error:", error);
  }
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

// Generar QR por defecto al cargar la página
window.addEventListener("load", function () {
  generateQR();
});

// Inicializar visualización de tamaño
updateSizeDisplay(document.getElementById("size").value);
