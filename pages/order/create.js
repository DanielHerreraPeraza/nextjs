import Layout from '../layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select';

export default function CreateOrder() {
	const [clientName, setClientName] = useState('');
	const [products, setProducts] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [paymentMethod, setPaymentMethod] = useState('cash');
	const [total, setTotal] = useState(0);
	const router = useRouter();

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await fetch('/api/products');
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch('/api/orders', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				clientName,
				products: selectedProducts,
				creationDate: new Date().toISOString(),
				status: 'open',
				total: total,
				paymentMethod,
			}),
		});

		if (res.ok) {
			router.push('/order');
		}
	};

	const productOptions = products.map((product) => ({
		value: product.name,
		label: `${product.name} - ₡${product.price}`,
	}));

	return (
		<Layout>
			<div className='container sm:w-lg md:w-lg mx-auto p-4'>
				<h1 className='text-2xl font-bold mb-4'>Crear Orden</h1>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Nombre del cliente
						</label>
						<input
							type='text'
							value={clientName}
							onChange={(e) => setClientName(e.target.value)}
							className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Productos
						</label>
						{selectedProducts.map((product, index) => (
							<div key={index} className='flex space-x-4 mb-2'>
								<Select
									value={productOptions.find(
										(option) => option.value === product.name
									)}
									onChange={(selectedOption) =>
										handleProductChange(index, 'name', selectedOption.value)
									}
									options={productOptions}
									className='block w-10/12'
								/>
								<input
									type='number'
									value={product.quantity}
									onChange={(e) =>
										handleProductChange(index, 'quantity', e.target.value)
									}
									className='block w-2/12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									min='1'
								/>
								<button
									type='button'
									onClick={() => handleRemoveProduct(index)}
									className='bg-red-500 text-white px-4 py-2 rounded'
								>
									-
								</button>
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
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Método de Pago
						</label>
						<select
							value={paymentMethod}
							onChange={(e) => setPaymentMethod(e.target.value)}
							className='mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm sm:w-12/12 md:w-4/12'
						>
							<option value='cash'>Efectivo</option>
							<option value='sinpe'>SINPE</option>
						</select>
					</div>
					<div>
						<label className='block text-sm font-bold text-gray-700'>
							Total
						</label>
						<span className='block text-lg font-medium text-gray-900'>
							₡{total}
						</span>
					</div>
					<div className='flex justify-center'>
						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-2 rounded'
						>
							Crear
						</button>
					</div>
				</form>
			</div>
		</Layout>
	);
}
