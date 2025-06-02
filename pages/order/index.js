import Layout from '../layout';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import printReceipts from '../../components/printReceipts';

export default function CreateOrder() {
	const [tableNumber, setTableNumber] = useState('');
	const [products, setProducts] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [paymentMethod, setPaymentMethod] = useState('efectivo');
	const [total, setTotal] = useState(0);
	const [montoRecibido, setMontoRecibido] = useState(0);
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await fetch('/api/products?status=enabled');
			const data = await res.json();
			setProducts(data);
		};

		fetchProducts();
	}, []);

	useEffect(() => {
		calculateTotal();
	}, [selectedProducts]);

	const handleProductChange = (index, field, value) => {
		const newSelectedProducts = [...selectedProducts];
		newSelectedProducts[index] = {
			...newSelectedProducts[index],
			[field]: value,
		};

		if (field === 'name') {
			const selectedProduct = products.find(
				(product) => product.name === value
			);
			if (selectedProduct) {
				newSelectedProducts[index].price = selectedProduct.price;
			}
		}

		setSelectedProducts(newSelectedProducts);
	};

	const handleAddProduct = () => {
		const newSelectedProducts = [
			...selectedProducts,
			{ name: '', quantity: 1, price: 0 },
		];
		setSelectedProducts(newSelectedProducts);
	};

	const handleRemoveProduct = (index) => {
		const newSelectedProducts = selectedProducts.filter((_, i) => i !== index);
		setSelectedProducts(newSelectedProducts);
	};

	const calculateTotal = () => {
		const total = selectedProducts.reduce((sum, product) => {
			const productPrice = product.price || 0;
			const productQuantity = product.quantity || 1;
			return sum + productPrice * productQuantity;
		}, 0);
		setTotal(total);
	};

	const handleSubmit = async () => {
		const timezone = 'America/Costa_Rica'; // Replace with your desired timezone
		const now = new Date();

		// Format the date manually as DD/MM/YYYYT06:45:10
		const formatter = new Intl.DateTimeFormat('en-GB', {
			timeZone: timezone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false, // Ensure 24-hour format
		});

		// Format the date and time separately
		const datePart = formatter.format(now).split(', ')[0]; // Extract DD/MM/YYYY
		const timePart = formatter.format(now).split(', ')[1]; // Extract HH:mm:ss

		// Combine date and time into the correct format
		const formattedCreationDate = `${datePart}T${timePart}`;

		const res = await fetch('/api/orders', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tableNumber,
				products: selectedProducts,
				creationDate: formattedCreationDate,
				status: 'open',
				total: total,
				paymentMethod,
			}),
		});

		if (res.ok) {
			await printReceipts({ products: selectedProducts, table: tableNumber });
			window.location.reload();
		}
	};

	const productOptions = products.map((product) => ({
		value: product.name,
		label: `${product.name} ${'.'.repeat(50 - product.name.length)} ₡${
			product.price
		}`,
	}));

	const handleCreateClick = () => {
		const updatedSelectedProducts = selectedProducts.map((selectedProduct) => {
			const product = products.find((p) => p.name === selectedProduct.name);
			return {
				...selectedProduct,
				category: product ? product.category : null,
			};
		});

		setSelectedProducts(updatedSelectedProducts);

		setShowPopup(true);
	};

	const handleCancelClick = () => {
		setShowPopup(false);
	};

	const handleConfirmClick = async () => {
		setShowPopup(false);
		await handleSubmit();
	};

	return (
		<Layout>
			<div className='container mx-auto p-4'>
				<h1 className='text-2xl font-bold mb-4'>Crear Orden</h1>
				<div>
					<form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
						<div className='grid grid-cols-12 gap-4'>
							<div className='col-span-2'>
								<label className='block text-sm font-medium text-gray-700'>
									Número de Mesa
								</label>
								<input
									type='number'
									value={tableNumber}
									onChange={(e) => setTableNumber(e.target.value)}
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									min={1}
								/>
							</div>
							<div className='col-span-2'>
								<label className='text-sm font-medium text-gray-700'>
									Método de Pago
								</label>
								<select
									value={paymentMethod}
									onChange={(e) => {
										setPaymentMethod(e.target.value);
										if (e.target.value === 'efectivo') {
											setMontoRecibido(0); // Reset montoRecibido to 0 for efectivo
										}
									}}
									className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								>
									<option value='efectivo'>Efectivo</option>
									<option value='sinpe'>SINPE</option>
									<option value='tarjeta'>Tarjeta</option>
									<option value='tiquete'>Tiquete</option>
								</select>
							</div>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700'>
								Productos
							</label>
							{selectedProducts.map((product, index) => (
								<div key={index} className=''>
									<div className='grid grid-cols-12 gap-x-4 mb-3'>
										<div className='col-span-4'>
											<Select
												value={productOptions.find(
													(option) => option.value === product.name
												)}
												onChange={(selectedOption) =>
													handleProductChange(
														index,
														'name',
														selectedOption.value
													)
												}
												options={productOptions}
												className=''
											/>
										</div>
										<div className='col-span-1'>
											<input
												type='number'
												value={product.quantity}
												onChange={(e) =>
													handleProductChange(index, 'quantity', e.target.value)
												}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
												min='1'
											/>
										</div>
										<div className='col-span-6'>
											<input
												type='text'
												value={product.details || ''}
												onChange={(e) =>
													handleProductChange(index, 'details', e.target.value)
												}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
												placeholder='Ingrese detalles adicionales'
											/>
										</div>
										<div className='col-span-1 flex items-center justify-center'>
											<IconButton
												onClick={() => handleRemoveProduct(index)}
												color='error'
												size='small'
											>
												<DeleteIcon />
											</IconButton>
										</div>
									</div>
								</div>
							))}
							<button
								type='button'
								onClick={handleAddProduct}
								className='bg-blue-500 text-white px-4 py-2 rounded'
							>
								Agregar Producto
							</button>
						</div>

						<div className='grid grid-cols-3 gap-4'>
							{/* {paymentMethod === 'efectivo' && (
								<div>
									<label className='text-sm font-medium text-gray-700'>
										Monto a Recibir
									</label>
									<input
										type='number'
										value={montoRecibido}
										onChange={(e) => setMontoRecibido(Number(e.target.value))}
										className='mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full'
										placeholder='Ingrese monto'
										min={0}
									/>
								</div>
							)} */}
							{/* {paymentMethod === 'efectivo' && (
								<div>
									<label className='block text-sm font-bold text-gray-700'>
										Vuelto
									</label>
									<span className='block text-lg font-medium text-gray-900'>
										₡{montoRecibido <= 0 ? 0 : montoRecibido - total}
									</span>
								</div>
							)} */}
						</div>

						<div className='flex justify-center'>
							<button
								type='button'
								onClick={handleCreateClick}
								className='bg-blue-500 text-white px-4 py-2 rounded'
							>
								Crear
							</button>
						</div>
					</form>
				</div>
				{showPopup && (
					<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
						<div className='bg-white p-8 rounded shadow-lg w-1/2 max-w-2xl'>
							<h2 className='text-xl font-bold mb-4'>Detalles de la Orden</h2>
							<p>
								<strong>Número de mesa:</strong> {tableNumber}
							</p>
							<p>
								<strong>Método de pago:</strong> {paymentMethod}
							</p>
							<div className='mt-4 grid grid-cols-2 gap-4'>
								{['Bebida', 'Comida'].map((category) => (
									<div key={category}>
										<h3 className='font-bold'>{category}</h3>
										<ul>
											{selectedProducts
												.filter(
													(selectedProduct) =>
														selectedProduct.category === category
												)
												.map((product, index) => (
													<li
														key={index}
														className='flex flex-col justify-between'
													>
														<div className='flex justify-between'>
															<span>
																{product.quantity} x {product.name}
															</span>
															<span className='flex-grow border-dotted border-b border-gray-300 mx-2'></span>
															<span>₡{product.price * product.quantity}</span>
														</div>
														{product.details && (
															<div className='text-xs text-gray-500 mt-1'>
																{product.details}
															</div>
														)}
													</li>
												))}
											<div className='flex justify-between mt-2'>
												<strong>Subtotal: </strong>
												<span className='flex-grow border-dotted border-b border-gray-300 mx-2'></span>
												<span>
													₡
													{selectedProducts
														.filter(
															(selectedProduct) =>
																selectedProduct.category === category
														)
														.reduce((sum, product) => {
															return sum + product.price * product.quantity;
														}, 0)}
												</span>
											</div>
										</ul>
										<hr className='border-t border-gray-300 mt-4 mb-4' />
									</div>
								))}
							</div>
							<div className='flex justify-between mt-2 mb-2'>
								<p>
									<strong>Total:</strong>
								</p>
								<span className='flex-grow border-dotted border-b border-gray-300 mx-2'></span>
								<p>₡{total}</p>
							</div>
							{paymentMethod === 'efectivo' && (
								<div className='grid grid-cols-2 gap-4'>
									<div className='flex items-center gap-4'>
										<label className='text-sm font-medium text-gray-700'>
											Monto a Recibir
										</label>
										<input
											type='number'
											value={montoRecibido}
											onChange={(e) => setMontoRecibido(Number(e.target.value))}
											className='block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full'
											placeholder='Ingrese monto'
											min={0}
										/>
									</div>
									<div>
										<div className='flex justify-between mt-2'>
											<p>
												<strong>Vuelto:</strong>
											</p>
											<span className='flex-grow border-dotted border-b border-gray-300 mx-2'></span>
											<p>₡{montoRecibido <= 0 ? 0 : montoRecibido - total}</p>
										</div>
									</div>
								</div>
							)}
							<div className='flex justify-end mt-4'>
								<button
									onClick={handleCancelClick}
									className='bg-gray-500 text-white px-4 py-2 rounded mr-2'
								>
									Cancelar
								</button>
								<button
									onClick={handleConfirmClick}
									className='bg-blue-500 text-white px-4 py-2 rounded'
								>
									Confirmar
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}
