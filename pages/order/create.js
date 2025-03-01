import '../../app/globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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

	return (
		<div className='container mx-auto p-4'>
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
							<select
								value={product.name}
								onChange={(e) =>
									handleProductChange(index, 'name', e.target.value)
								}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
							>
								<option value=''>Seleccione un producto</option>
								{products.map((p) => (
									<option key={p._id} value={p.name} data-price={p.price}>
										{p.name} - ₡{p.price}
									</option>
								))}
							</select>
							<input
								type='number'
								value={product.quantity}
								onChange={(e) =>
									handleProductChange(index, 'quantity', e.target.value)
								}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
								min='1'
							/>
							<button
								type='button'
								onClick={() => handleRemoveProduct(index)}
								className='bg-red-500 text-white px-4 py-2 rounded'
							>
								Eliminar
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
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					>
						<option value='cash'>Efectivo</option>
						<option value='sinpe'>SINPE</option>
					</select>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Total
					</label>
					<span className='block text-sm font-medium text-gray-900'>
						₡{total}
					</span>
				</div>
				<button
					type='submit'
					className='bg-blue-500 text-white px-4 py-2 rounded'
				>
					Crear
				</button>
			</form>
		</div>
	);
}
