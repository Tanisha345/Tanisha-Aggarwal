/* Vanilla JS for quick view, variant picking, and AJAX add-to-cart */



// open the modal on clicking plus icon of the product
document.addEventListener('DOMContentLoaded', function() {
  const plusIcons = document.querySelectorAll('.plus-icon');
  const modal = document.getElementById('productModal');
  const closeModal = modal.querySelector('.close');
  const colorBox = modal.querySelector(".color-box-selector");
  const sizeSelect = modal.querySelector("#sizeSelect");

  plusIcons.forEach(icon => {
    icon.addEventListener('click', function() {
      document.getElementById('modalTitle').innerText = this.dataset.title;
      document.getElementById('modalImage').src = this.dataset.image;
      document.getElementById('modalDescription').innerText = this.dataset.description;
      const variants = JSON.parse(this.dataset.variants);
      modal.style.display = 'block';
      colorBox.innerHTML = "";

      // add color buttons dynamically
    variants.forEach(color => {
      const div = document.createElement("div");
      div.classList.add("color-option");

      // small color swatch
      const swatch = document.createElement("span");
      swatch.classList.add("color-swatch");
      swatch.style.backgroundColor = color.toLowerCase(); // assumes color names like "Black", "Blue"

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
    });
  });

  colorBox.addEventListener("click", function(e) {
    if (e.target.classList.contains("color-option")) {
      document.querySelectorAll(".color-option").forEach(opt => opt.classList.remove("selected"));
      e.target.classList.add("selected");
    }
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
});

