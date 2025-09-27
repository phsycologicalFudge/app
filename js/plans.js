const link = document.getElementById("customPlanLink");

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("storageSlider");
  const inputBox = document.getElementById("customStorage");
  const valueDisplay = document.getElementById("storageValue");
  const priceDisplay = document.getElementById("price");

  const MIN = 1000;   // 1 TB
  const MAX = 10000;  // 10 TB

  function clampSnap(val) {
    let v = Number(val);
    if (isNaN(v)) return null; // typing empty/invalid, don't snap yet
    v = Math.min(Math.max(v, MIN), MAX);
    return Math.round(v / 10) * 10; // snap to nearest 10 GB
  }

  function updateSliderBackground(el) {
    const percent = ((el.value - MIN) / (MAX - MIN)) * 100;
    el.style.background = `linear-gradient(to right, #00bfff ${percent}%, #222 ${percent}%)`;
  }

  function updatePrice(gb) {
    const v = clampSnap(gb);
    if (v === null) {
      priceDisplay.textContent = "--"; // show placeholder while typing invalid
      return;
    }

    // update signup link with plan+size
    link.href = `/signup.html?plan=custom&size=${v}`;

    // show current size
    valueDisplay.textContent = v;

    // price calculation
    let price;
    if (v <= 5000) {
      price = 12 + (v - 1000) * 0.01; // £12 base + £0.01/GB above 1 TB
    } else {
      price = 50 + (v - 5000) * 0.003; // discounted slope
    }

    priceDisplay.textContent = price.toFixed(2);
    updateSliderBackground(slider);
  }

  // --- Slider logic ---
  slider.addEventListener("input", () => {
    const val = clampSnap(slider.value);
    if (val !== null) {
      inputBox.value = val;
      updatePrice(val);
    }
  });

  // --- Number box logic ---
  inputBox.addEventListener("input", () => {
    const raw = Number(inputBox.value);
    const val = clampSnap(raw);
    if (val !== null) {
      slider.value = val;
      updatePrice(val);
    } else {
      priceDisplay.textContent = "--"; // invalid/incomplete entry
    }
  });

  // Initialize defaults
  slider.value = MIN;
  inputBox.value = MIN;
  updatePrice(MIN);
});
