/* Vanilla JS for quick view, variant picking, and AJAX add-to-cart */

(function () {
  // Find grid root to get addon variant id
  const gridRoot = document.querySelector("[data-gg-grid-root]");
  const addonVariantId = gridRoot ? gridRoot.dataset.addonVariantId : null;

  // ---------- Helpers ----------
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  const openModal = (html) => {
    let modal = qs("#gg-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "gg-modal";
      modal.className = "gg-modal";
      modal.innerHTML = `
        <div class="gg-modal__overlay" data-close></div>
        <div class="gg-modal__dialog" role="dialog" aria-modal="true">
          <button class="gg-modal__close" aria-label="Close" data-close>&times;</button>
          <div class="gg-modal__media"></div>
          <div class="gg-modal__body"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener("click", (e) => {
        if (e.target.hasAttribute("data-close")) closeModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
      });
    }
    qs(".gg-modal__body", modal).innerHTML = html.body;
    qs(".gg-modal__media", modal).innerHTML = html.media;
    modal.removeAttribute("hidden");
  };

  const closeModal = () => {
    const modal = qs("#gg-modal");
    if (modal) modal.setAttribute("hidden", "");
  };

  const fetchProduct = async (handle) => {
    const res = await fetch(`/products/${handle}.js`);
    if (!res.ok) throw new Error("Product fetch failed");
    return res.json();
  };

  const findVariantId = (product, chosen) => {
    // chosen is array of option values in order
    const v = product.variants.find((vv) =>
      [vv.option1, vv.option2, vv.option3]
        .filter(Boolean)
        .every((opt, idx) => opt === chosen[idx])
    );
    return v ? v.id : product.variants[0]?.id;
  };

  const addToCart = async (variantId, qty = 1) => {
    const res = await fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: Number(variantId), quantity: qty }),
    });
    if (!res.ok) throw new Error("Add to cart failed");
    return res.json();
  };

  const buildOptionSelectors = (product) => {
    const optHtml = product.options
      .map((opt, i) => {
        const values = Array.from(
          new Set(
            product.variants.map((v) => v[`option${i + 1}`]).filter(Boolean)
          )
        );
        const id = `gg-opt-${i}-${product.id}`;
        const label = `<label for="${id}">${opt.name}</label>`;
        const select = `
        <select id="${id}" data-opt-index="${i}">
          ${values.map((v) => `<option value="${v}">${v}</option>`).join("")}
        </select>
      `;
        return `<div>${label}${select}</div>`;
      })
      .join("");
    return `<div class="gg-modal__options">${optHtml}</div>`;
  };

  const modalTemplate = (product) => {
    const firstImg = product.images?.[0] || product.featured_image;
    const media = firstImg
      ? `<img src="${firstImg}" alt="${product.title}">`
      : "";
    const options = product.options?.length
      ? buildOptionSelectors(product)
      : "";
    const body = `
      <div class="gg-modal__title">${product.title}</div>
      ${options}
      <div class="gg-modal__actions">
        <button class="gg-btn gg-modal__add" data-add data-handle="${product.handle}">
          ADD TO CART <span class="gg-btn__arrow">→</span>
        </button>
      </div>
    `;
    return { media, body };
  };

  // ---------- Wire hotspots ----------
  qsa("[data-gg-hotspot]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const handle = btn.dataset.handle;
      try {
        const product = await fetchProduct(handle);
        openModal(modalTemplate(product));

        // After modal opens, wire "Add" interaction
        const modal = document.getElementById("gg-modal");
        const selects = qsa(".gg-modal select", modal);
        const getChosen = () => selects.map((s) => s.value);
        let chosen = selects.length ? getChosen() : [];

        selects.forEach((sel) =>
          sel.addEventListener("change", () => {
            chosen = getChosen();
          })
        );

        qs("[data-add]", modal).addEventListener("click", async () => {
          const prod = await fetchProduct(handle); // ensure fresh data
          const variantId = findVariantId(prod, chosen);
          await addToCart(variantId, 1);

          // Auto-add rule: if selected options include Black and Medium
          const lower = chosen.map((v) => (v || "").toLowerCase());
          const isBlackMedium =
            lower.includes("black") && lower.includes("medium");

          if (isBlackMedium && addonVariantId) {
            try {
              await addToCart(addonVariantId, 1);
            } catch (e) {
              console.warn("Addon add failed", e);
            }
          }

          closeModal();
        });
      } catch (e) {
        console.error(e);
      }
    });
  });
})();


// open the modal on clicking plus icon of the product
document.addEventListener('DOMContentLoaded', function() {
  const plusIcons = document.querySelectorAll('.plus-icon');
  const modal = document.getElementById('productModal');
  const closeModal = modal.querySelector('.close');
  const colorBox = modal.querySelector(".color-box-selector");

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
        div.textContent = color;
        colorBox.appendChild(div);
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

