import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateProduct() {
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch('/api/products', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, price }),
		});

		if (res.ok) {
			router.push('/product');
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Crear Producto</h1>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Nombre
					</label>
					<input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Precio
					</label>
					<input
						type='number'
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					/>
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
