/* Vanilla JS for quick view, variant picking, and AJAX add-to-cart */

document.addEventListener('DOMContentLoaded', function() {
  const plusIcons = document.querySelectorAll('.plus-icon');
  const modal = document.getElementById('productModal');
  const closeModal = modal.querySelector('.close');
  const colorBox = modal.querySelector(".color-box-selector");
  const sizeSelect = modal.querySelector("#sizeSelect");

  // mapping Shopify variant names -> CSS colors
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
    "purple": "#800080",
    // add more mappings if needed
  };

  // handle click on product "plus" icon
  plusIcons.forEach(icon => {
    icon.addEventListener('click', function() {
      // populate modal info
      document.getElementById('modalTitle').innerText = this.dataset.title;
      document.getElementById('modalImage').src = this.dataset.image;
      document.getElementById('modalDescription').innerText = this.dataset.description;

      // show modal
      modal.style.display = 'block';

      /** ---------------- Colors ---------------- */
      const variants = JSON.parse(this.dataset.variants || "[]");
      colorBox.innerHTML = "";

      variants.forEach(color => {
        const div = document.createElement("div");
        div.classList.add("color-option");

        // color swatch
        const swatch = document.createElement("span");
        swatch.classList.add("color-swatch");

        const colorName = color.toLowerCase().trim();
        const swatchColor = colorMap[colorName] || colorName; // fallback if valid css color
        swatch.style.backgroundColor = swatchColor;

        const label = document.createElement("span");
        label.textContent = color;

        div.appendChild(swatch);
        div.appendChild(label);
        colorBox.appendChild(div);
      });

      // set equal widths
      const options = colorBox.querySelectorAll(".color-option");
      options.forEach(opt => {
        opt.style.flex = `1 1 ${100 / options.length}%`;
      });

      /** ---------------- Sizes ---------------- */
      /** ---------------- Sizes ---------------- */
const sizes = JSON.parse(this.dataset.sizes || "[]");
sizeSelect.innerHTML = "";

// add placeholder
const placeholder = document.createElement("option");
placeholder.value = "";
placeholder.textContent = "Choose your size";
placeholder.disabled = true;
placeholder.selected = true;
sizeSelect.appendChild(placeholder);

// add real sizes
sizes.forEach(size => {
  const opt = document.createElement("option");
  opt.value = size;
  opt.textContent = size;
  sizeSelect.appendChild(opt);
});

    });
  });

  /** Color selection */
  colorBox.addEventListener("click", function(e) {
    const target = e.target.closest(".color-option");
    if (target) {
      colorBox.querySelectorAll(".color-option").forEach(opt => opt.classList.remove("selected"));
      target.classList.add("selected");
    }
  });

  /** Close modal */
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
