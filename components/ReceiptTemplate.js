export const generateReceiptHTML = (products, category, table) => {
	const styles = `
      <style>
        @media print {
          body {
            width: 79mm;
            margin: 0;
          }
          .page {
            page-break-after: always;
          }
        }
        body { font-family: monospace; padding: 10px; font-size: 16px; } /* Increased font size */
        .title { text-align: center; font-weight: bold; font-size: 18px; } /* Larger title font */
        .item { display: flex; justify-content: space-between; font-size: 16px; } /* Larger item font */
        .details { font-size: 14px; } /* Adjusted details font size */
      </style>
    `;

	const content = `
      <div class="page">
      <div class="title">${category} - mesa # ${table}</div>
      <hr />
      ${products
				.map(
					(product) => `
        <div class="item">
          <span>${product.quantity} x ${product.name}</span>
          <span>₡${product.price * product.quantity}</span>
        </div>
        ${
					product.details ? `<div class="details">${product.details}</div>` : ''
				}
        `
				)
				.join('')}
      <hr />
      <div class="item">
        <span><strong>Total: </strong></span>
        <span>₡${products.reduce(
					(sum, product) => sum + product.price * product.quantity,
					0
				)}</span>
      </div>
      <hr />
      <div class="title">Gracias por su compra</div>
      </div>
    `;

	return `<!DOCTYPE html><html><head>${styles}</head><body onload="window.print(); setTimeout(() => window.close(), 500);">${content}</body></html>`;
};
