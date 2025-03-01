import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function UpdateProduct() {
	const router = useRouter();
	const { id, name, price } = router.query;

	const [productName, setProductName] = useState('');
	const [productPrice, setProductPrice] = useState('');

	useEffect(() => {
		if (name) setProductName(name);
		if (price) setProductPrice(price);
	}, [name, price]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch('/api/products', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, name: productName, price: productPrice }),
		});

		if (res.ok) {
			router.push('/product');
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Actualizar Producto</h1>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						ID:{id}
					</label>
					{/* <span className='block text-sm font-medium text-gray-900'>{id}</span> */}
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Nombre:{' '}
					</label>
					<input
						type='text'
						value={productName}
						onChange={(e) => setProductName(e.target.value)}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Precio:{' '}
					</label>
					<input
						type='text'
						value={productPrice}
						onChange={(e) => setProductPrice(e.target.value)}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					/>
				</div>
				<button
					type='submit'
					className='bg-blue-500 text-white px-4 py-2 rounded'
				>
					Actualizar
				</button>
			</form>
		</div>
	);
}
