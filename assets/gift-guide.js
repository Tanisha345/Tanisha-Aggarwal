document.addEventListener('DOMContentLoaded', function() {
  const plusIcons = document.querySelectorAll('.plus-icon');
  const modal = document.getElementById('productModal');
  const closeModal = modal.querySelector('.close');
  const colorBox = modal.querySelector(".color-box-selector");
  const sizeSelect = modal.querySelector("#sizeSelect");
  const addToCartBtn = modal.querySelector(".gg-btn-cart");

  let currentVariants = [];
  let selectedColor = null;
  let selectedSize = null;
  const ADDON_VARIANT_ID = dark-winter-jacket;

  // Color name -> CSS mapping
  const colorMap = {
    "white": "#ffffff",
    "black": "#000000",
    "blue": "#0000ff",
    "navy": "#000080",
    "red": "#ff0000",
    "green": "#008000",
    "dark green": "#006400",
    "yellow": "#ffff00",
    "grey": "#808080",
    "gray": "#808080",
    "beige": "#f5f5dc",
    "pink": "#ffc0cb",
    "purple": "#800080"
  };

  /** ---------------- Open modal ---------------- */
plusIcons.forEach(icon => {
  icon.addEventListener('click', function() {
    document.getElementById('modalTitle').innerText = this.dataset.title;
    document.getElementById('modalImage').src = this.dataset.image;
    document.getElementById('modalDescription').innerText = this.dataset.description;

    modal.style.display = 'block';

    currentVariants = JSON.parse(this.dataset.variants || "[]");

    // --- COLORS from option2 ---
    const uniqueColors = [...new Set(currentVariants.map(v => v.option2))];
    colorBox.innerHTML = "";
    uniqueColors.forEach(color => {
      if (!color) return;
      const div = document.createElement("div");
      div.classList.add("color-option");
      div.dataset.color = color;

      const swatch = document.createElement("span");
      swatch.classList.add("color-swatch");
      const swatchColor = colorMap[color.toLowerCase()] || color;
      swatch.style.backgroundColor = swatchColor;

      const label = document.createElement("span");
      label.textContent = color;

      div.appendChild(swatch);
      div.appendChild(label);
      colorBox.appendChild(div);
    });

    // Reset size dropdown
    sizeSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose your size";
    placeholder.disabled = true;
    placeholder.selected = true;
    sizeSelect.appendChild(placeholder);

    selectedColor = null;
    selectedSize = null;
  });
});

/** --- When color is picked --- */
colorBox.addEventListener("click", function(e) {
  const target = e.target.closest(".color-option");
  if (target) {
    colorBox.querySelectorAll(".color-option").forEach(opt => opt.classList.remove("selected"));
    target.classList.add("selected");
    selectedColor = target.dataset.color;

    // --- Sizes from option1 for selected color ---
    sizeSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose your size";
    placeholder.disabled = true;
    placeholder.selected = true;
    sizeSelect.appendChild(placeholder);

    const sizes = currentVariants
      .filter(v => v.option2 === selectedColor)  // match color
      .map(v => v.option1);                     // extract sizes

    [...new Set(sizes)].forEach(size => {
      if (!size) return;
      const opt = document.createElement("option");
      opt.value = size;
      opt.textContent = size;
      sizeSelect.appendChild(opt);
    });
  }
});

/** --- When size is picked --- */
sizeSelect.addEventListener("change", function() {
  selectedSize = this.value;
});

/** --- Add to cart --- */
addToCartBtn.addEventListener("click", function() {
  if (!selectedColor || !selectedSize) {
    alert("Please select color and size");
    return;
  }

  const variant = currentVariants.find(v => v.option1 === selectedSize && v.option2 === selectedColor);
  if (!variant) {
    alert("Variant not available");
    return;
  }

  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ id: variant.id, quantity: 1 })
  })
  .then(res => res.json())
  .then(data => {
    console.log("Added to cart:", data);
    alert("Item added to cart!");
    modal.style.display = 'none';
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Something went wrong. Please try again.");
  });
});

  /** ---------------- Close modal ---------------- */
  closeModal.addEventListener('click', () => { modal.style.display = 'none'; });
  window.addEventListener('click', (event) => { if (event.target === modal) modal.style.display = 'none'; });
});
