(function () {
  function isExternal(href) {
    // absolute URL (http/https/etc) OR mailto OR hash
    return /^([a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('#');
  }

  function filename(path) {
    const f = path.split('/').pop();
    return f === '' ? 'index.html' : f;
  }

  function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');
  }

  function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }

  // Hide after load
  window.addEventListener('load', function () {
    // small tick so you can actually see it flash if needed
    setTimeout(hideLoader, 50);
  });

  // Handle bfcache (back/forward navigation)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) hideLoader();
  });

  document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('header nav').classList.toggle('active');
  });


  // Intercept internal link clicks (event delegation)
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || isExternal(href)) return;

    const current = filename(window.location.pathname);
    const target = filename(href);

    // same-page link: do nothing
    if (current === target) return;

    e.preventDefault();
    showLoader();
    // brief delay so the user sees the transition
    setTimeout(function () {
      window.location.href = href;
    }, 200);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById('storageSlider');
    const valueDisplay = document.getElementById('storageValue');
    const priceDisplay = document.getElementById('price');
    const inputBox = document.getElementById('customStorage');

    function updatePrice(gb) {
      gb = parseInt(gb, 10) || 10;
      valueDisplay.textContent = gb;
      inputBox.value = gb;
      priceDisplay.textContent = (gb * 0.05).toFixed(2); // £0.05/GB
    }

    slider.addEventListener('input', () => updatePrice(slider.value));
    inputBox.addEventListener('input', () => {
      let val = Math.min(Math.max(inputBox.value, 10), 5000);
      val = Math.round(val / 10) * 10; // snap to nearest 10
      slider.value = val;
      updatePrice(val);
    });

    // Initialize values on page load
    updatePrice(slider.value);
  });


})();
