const modal = document.getElementById("donation-modal");
const openBtn = document.getElementById("open-modal-btn");
const closeBtn = document.getElementById("close-modal-btn");
const qrContainer = document.getElementById("qr-container");
const qrcodeElement = document.getElementById("qrcode");
const addressText = document.getElementById("address-text");
const selectTrigger = document.getElementById("custom-select-trigger");
const selectOptionsList = document.getElementById("custom-options-list");
const donationAssets = window.donationAssets || [];

let qrCodeInstance = null;

function renderDonationOptions() {
  selectOptionsList.innerHTML = "";

  donationAssets.forEach((asset) => {
    const option = document.createElement("div");
    option.className = "custom-option";
    option.dataset.value = asset.address;
    option.textContent = asset.label;

    selectOptionsList.appendChild(option);
  });
}

renderDonationOptions();

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.body.classList.add("modal-open");
});

const closeModal = () => {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
  selectOptionsList.classList.remove("open");
  selectTrigger.classList.remove("open");
  selectTrigger.querySelector("span").innerText = "Select an asset...";
  qrContainer.classList.remove("visible");
  qrcodeElement.innerHTML = "";
  addressText.innerText = "";
  qrCodeInstance = null;
};

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

selectTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  selectTrigger.classList.toggle("open");
  selectOptionsList.classList.toggle("open");
});

selectOptionsList.addEventListener("click", (event) => {
  event.stopPropagation();

  const option = event.target.closest(".custom-option");

  if (!option || !selectOptionsList.contains(option)) {
    return;
  }

  const value = option.dataset.value;
  const label = option.innerText;

  selectTrigger.querySelector("span").innerText = label;
  selectTrigger.classList.remove("open");
  selectOptionsList.classList.remove("open");

  qrcodeElement.innerHTML = "";
  qrCodeInstance = new QRCode(qrcodeElement, {
    text: value,
    width: 180,
    height: 180,
    colorDark: "#FFB020",
    colorLight: "rgba(10, 12, 16, 0.95)",
    correctLevel: QRCode.CorrectLevel.H,
  });

  addressText.innerText = value;
  qrContainer.classList.add("visible");
});

document.addEventListener("click", () => {
  selectTrigger.classList.remove("open");
  selectOptionsList.classList.remove("open");
});
