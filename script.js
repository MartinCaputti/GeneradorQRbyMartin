function generateQR() {
  const input = document.getElementById("qr-input").value;
  const qrcodeDiv = document.getElementById("qrcode");

  // Clear previous QR code
  qrcodeDiv.innerHTML = "";

  if (input) {
    // Generate new QR code
    new QRCode(qrcodeDiv, {
      text: input,
      width: 256,
      height: 256,
    });
  } else {
    alert("Please enter text or a URL.");
  }
}
