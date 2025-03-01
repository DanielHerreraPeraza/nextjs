import '../../app/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Order() {
	const [orders, setOrders] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const fetchOrders = async () => {
			const res = await fetch('/api/orders');
			const data = await res.json();
			setOrders(data);
		};

		fetchOrders();
	}, []);

	const handleFinishClick = async (orderId) => {
		const res = await fetch('/api/orders', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id: orderId, status: 'closed' }),
		});

		if (res.ok) {
			window.location.reload();
		}
	};

	const handleCreateOrderClick = () => {
		router.push('/order/create');
	};

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold'>Ordenes</h1>
				<button
					className='bg-blue-500 text-white px-4 py-2 rounded'
					onClick={handleCreateOrderClick}
				>
					Crear Orden
				</button>
			</div>
			<div className='grid grid-cols-1 gap-4'>
				{orders.map((order) => (
					<div key={order._id} className='bg-white p-4 rounded shadow'>
						<h2 className='text-xl font-bold mb-2'>{order.clientName}</h2>
						<p className='text-gray-700 mb-2'>
							Date: {new Date(order.creationDate).toLocaleString()}
						</p>
						<ul className='mb-2'>
							{order.products.map((product, index) => (
								<li key={index} className='text-gray-700 flex justify-between'>
									<span>{product.name}</span>
									<span>{product.quantity}</span>
								</li>
							))}
						</ul>
						<div className='flex justify-between items-center'>
							<span className='text-gray-700 font-bold'>
								Total: ₡{order.total}
							</span>
							{order.status === 'open' && (
								<button
									className='bg-blue-500 text-white px-4 py-2 rounded'
									onClick={() => handleFinishClick(order._id)}
								>
									Finalizar
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
