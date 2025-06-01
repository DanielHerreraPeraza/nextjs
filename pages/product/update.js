import Layout from '../layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function UpdateProduct() {
	const router = useRouter();
	const { id, name, price, category, status } = router.query;

	const [productName, setProductName] = useState('');
	const [productPrice, setProductPrice] = useState('');
	const [productCategory, setProductCategory] = useState('');
	const [productStatus, setProductStatus] = useState('');
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (name) setProductName(name);
		if (price) setProductPrice(price);
		if (category) setProductCategory(category);
		if (status) setProductStatus(status);
	}, [name, price, category, status]);

	const validateForm = () => {
		const newErrors = {};
		if (!productName.trim()) newErrors.name = 'El nombre es obligatorio.';
		if (!productPrice || isNaN(productPrice) || productPrice <= 0)
			newErrors.price = 'El precio debe ser un número mayor a 0.';
		if (!productCategory)
			newErrors.category = 'Debe seleccionar una categoría.';
		if (!productStatus) newErrors.status = 'Debe seleccionar un estado.';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const res = await fetch('/api/products', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id,
				name: productName,
				price: productPrice,
				category: productCategory,
				status: productStatus,
			}),
		});

		if (res.ok) {
			router.push('/product');
		}
	};

	return (
		<Layout>
			<div className='container sm:w-sm md:w-md mx-auto p-4'>
				<h1 className='text-2xl font-bold mb-4'>Actualizar Producto</h1>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Nombre{' '}
						</label>
						<input
							type='text'
							value={productName}
							onChange={(e) => setProductName(e.target.value)}
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
							Precio{' '}
						</label>
						<input
							type='text'
							value={productPrice}
							onChange={(e) => setProductPrice(e.target.value)}
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
							Categoría{' '}
						</label>
						<select
							value={productCategory}
							onChange={(e) => setProductCategory(e.target.value)}
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
					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Estado{' '}
						</label>
						<select
							value={productStatus}
							onChange={(e) => setProductStatus(e.target.value)}
							className={`mt-1 block w-full px-3 py-2 border ${
								errors.status ? 'border-red-500' : 'border-gray-300'
							} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
						>
							<option value=''>Seleccione un estado</option>
							<option value='enabled'>Habilitado</option>
							<option value='disabled'>Desahabilitado</option>
						</select>
						{errors.status && (
							<p className='text-red-500 text-sm mt-1'>{errors.status}</p>
						)}
					</div>
					<div className='flex justify-center'>
						<button
							type='submit'
							className='bg-blue-500 text-white px-4 py-2 rounded'
						>
							Actualizar
						</button>
					</div>
				</form>
			</div>
		</Layout>
	);
}
