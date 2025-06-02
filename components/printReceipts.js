import { generateReceiptHTML } from './ReceiptTemplate';

export default async function printReceipts({ products, table }) {
	// Filter products by category
	const receipt1 = products.filter((product) => product.category === 'Bebida');
	const receipt2 = products.filter((product) => product.category === 'Comida');

	// Open both windows immediately to avoid popup blocking

	// if (!win1 || !win2) {
	// 	alert('Pop-up blocked! Please allow pop-ups for this site.');
	// 	return;
	// }

	if (receipt1.length > 0) {
		const win1 = window.open('', '_blank', 'width=400,height=600');
		// Write receipt 1 (Bebida)
		await new Promise((resolve) => {
			const html1 = generateReceiptHTML(receipt1, 'Bebida', table);
			win1.document.open();
			win1.document.write(html1);
			win1.document.close();
			resolve();
		});
	}

	if (receipt2.length > 0) {
		const win2 = window.open('', '_blank', 'width=400,height=600');
		// Delay second print slightly to queue jobs
		await new Promise((resolve) => {
			setTimeout(() => {
				// Write receipt 2 (Comida)
				const html2 = generateReceiptHTML(receipt2, 'Comida', table);
				win2.document.open();
				win2.document.write(html2);
				win2.document.close();
				resolve();
			}, 2000); // Adjust delay as needed
		});
	}
}
