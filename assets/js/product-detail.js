document.addEventListener('DOMContentLoaded', () => {
  const detailEl = document.querySelector('.product-detail');
  if (!detailEl) return;

  function renderDetailFromCard(card) {
    // render modal content (visibility controlled by .show class)
    detailEl.style.display = 'block';
    const img = card.querySelector('.product-img')?.src || '';
    const name = card.querySelector('.product-name')?.textContent.trim() || '';
    const price = card.querySelector('.product-price')?.textContent.trim() || '';
    const oldPrice = card.querySelector('.product-old-price')?.textContent.trim() || '';
    const discount = card.querySelector('.product-discount')?.textContent.trim() || '';
    const rating = card.querySelector('.product-rating .rating-text')?.textContent.trim() || card.querySelector('.rating-text')?.textContent.trim() || '';
    const promo = card.querySelector('.coupon-price')?.textContent.trim() || '';

    // Try to find a matching product object from localStorage by name or image
    let productObj = null;
    try {
      const products = JSON.parse(localStorage.getItem('product')) || [];
      productObj = products.find(p => (p.tensanpham && p.tensanpham.trim() === name) || (p.hinhanh && img && img.includes(p.hinhanh)) );
      if (productObj) {
        // attach data-id to card for future reference
        card.dataset.productId = productObj.id;
      }
    } catch (e) {
      // ignore parse errors
    }

    const desc = productObj?.mota || productObj?.description || 'Mô tả sản phẩm chưa có. Liên hệ cửa hàng để biết thêm thông tin kỹ thuật và khuyến mãi.';
    const productId = productObj?.id || '';

    detailEl.innerHTML = `
      <div class="detail-card">

        <div class="detail-img">
          <img src="${productObj?.hinhanh || img}" alt="${name}" />
        </div>
        <div class="detail-info">
          <h3 class="detail-name">${name}</h3>
          <button class="detail-close" aria-label="Đóng">×</button>
          <div class="detail-rating">${rating}</div>
          <div class="detail-price">
            <span class="price-now">${price}</span>
            ${oldPrice ? `<span class="price-old">${oldPrice}</span>` : ''}
            ${discount ? `<span class="price-discount">${discount}</span>` : ''}
          </div>
          ${promo ? `<p class="detail-promo">${promo}</p>` : ''}
          <p class="detail-desc">${desc}</p>
          <div class="detail-actions">
            <button class="btn-add-cart" data-product-id="${productId}">Thêm vào giỏ</button>
            <a class="btn-buy-now" href="user-account.html#cart">Mua ngay</a>
          </div>
        </div>
      </div>
    `;

    // Wire "Thêm vào giỏ" to persistent cart in localStorage
    const addBtn = detailEl.querySelector('.btn-add-cart');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        const id = addBtn.dataset.productId || productId || '';
        // build cart item from productObj or fallback to card info
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let existing = null;
        if (id) existing = cart.find(c => String(c.id) === String(id));
        if (!existing) {
          const newItem = {
            id: id || name,
            tensanpham: productObj?.tensanpham || name,
            gia: productObj?.gia || (price ? price : 0),
            hinhanh: productObj?.hinhanh || img,
            quantity: 1
          };
          cart.push(newItem);
        } else {
          existing.quantity = (existing.quantity || 0) + 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));

        // update visual cart count (sum of quantities)
        const countEl = document.querySelector('.cart-count');
        if (countEl) {
          const total = cart.reduce((s, it) => s + (parseInt(it.quantity) || 0), 0);
          countEl.textContent = total;
        }

        // small feedback
        addBtn.textContent = 'Đã thêm ✓';
        setTimeout(() => (addBtn.textContent = 'Thêm vào giỏ'), 900);
      });
    }
    // open modal after rendering
    openDetailModal();
  }

  // Attach click listeners to existing product cards
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card) => {
    const btn = card.querySelector('.btn-detail');
    // if there's a detail button, use it; otherwise clicking the card opens detail
    const clickTarget = btn || card;
    clickTarget.addEventListener('click', (e) => {
      e.stopPropagation();
      renderDetailFromCard(card);
    });
  });

  // If product cards are rendered dynamically later, observe for additions
  const productsFlex = document.querySelector('.products-flex');
  if (productsFlex) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList.contains('product-card')) {
            const btn = node.querySelector('.btn-detail') || node;
              btn.addEventListener('click', (e) => {
                e.stopPropagation();
                renderDetailFromCard(node);
            });
          }
        });
      });
    });
    observer.observe(productsFlex, { childList: true });
  }

  // Modal open/close helpers
  function openDetailModal() {
    detailEl.classList.add('show');
    document.addEventListener('keydown', escHandler);
  }
  function closeDetailModal() {
    detailEl.classList.remove('show');
    document.removeEventListener('keydown', escHandler);
    detailEl.style.display = 'none';
  }
  function escHandler(e) {
    if (e.key === 'Escape') closeDetailModal();
  }

  // Close when clicking on overlay (outside .detail-card)
  detailEl.addEventListener('click', (e) => {
    if (e.target === detailEl) closeDetailModal();
  });

  // Delegate close button clicks
  detailEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('detail-close')) {
      closeDetailModal();
    }
  });
});