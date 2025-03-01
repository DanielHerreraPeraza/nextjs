import '../../app/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Product() {
	const [products, setProducts] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await fetch('/api/products');
			const data = await res.json();
			setProducts(data);
		};

		fetchProducts();
	}, []);

	const handleRowClick = (product) => {
		router.push(
			`/product/update?id=${product._id}&name=${product.name}&price=${product.price}`
		);
	};

	const handleCreateClick = () => {
		router.push('/product/create');
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Productos</h1>
			<button
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
				onClick={handleCreateClick}
			>
				Nuevo Producto
			</button>
			<table className='min-w-full bg-white border border-gray-200 mt-4'>
				<thead>
					<tr>
						<th className='py-2 px-4 border-b'>ID</th>
						<th className='py-2 px-4 border-b'>Nombre</th>
						<th className='py-2 px-4 border-b'>Precio</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr
							key={product._id}
							className='cursor-pointer hover:bg-gray-100'
							onClick={() => handleRowClick(product)}
						>
							<td className='py-2 px-4 border-b'>{product._id}</td>
							<td className='py-2 px-4 border-b'>{product.name}</td>
							<td className='py-2 px-4 border-b'>{product.price}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
