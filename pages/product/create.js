import Layout from '../layout';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateProduct() {
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [category, setCategory] = useState('');
	const [status, setStatus] = useState('enabled');
	const [errors, setErrors] = useState({});
	const router = useRouter();

	const validateForm = () => {
		const newErrors = {};
		if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
		if (!price || isNaN(price) || price <= 0)
			newErrors.price = 'El precio debe ser un número mayor a 0.';
		if (!category) newErrors.category = 'Debe seleccionar una categoría.';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const res = await fetch('/api/products', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, price, category, status }),
		});

		if (res.ok) {
			router.push('/product');
		}
	};

	return (
		<Layout>
			<div className='container sm:w-sm md:w-md mx-auto p-4'>
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
							className={`mt-1 block w-full px-3 py-2 border ${
								errors.name ? 'border-red-500' : 'border-gray-300'
							} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
						/>
						{errors.name && (
							<p className='text-red-500 text-sm mt-1'>{errors.name}</p>
						)}
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Precio
						</label>
						<input
							type='number'
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							className={`mt-1 block w-full px-3 py-2 border ${
								errors.price ? 'border-red-500' : 'border-gray-300'
							} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
						/>
						{errors.price && (
							<p className='text-red-500 text-sm mt-1'>{errors.price}</p>
						)}
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Categoría
						</label>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className={`mt-1 block w-full px-3 py-2 border ${
								errors.category ? 'border-red-500' : 'border-gray-300'
							} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
						>
							<option value=''>Seleccione una categoría</option>
							<option value='Bebida'>Bebida</option>
							<option value='Comida'>Comida</option>
						</select>
						{errors.category && (
							<p className='text-red-500 text-sm mt-1'>{errors.category}</p>
						)}
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
