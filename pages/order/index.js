import Layout from '../layout';
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

	const toggleCheckbox = (orderIndex, productIndex) => {
		const newOrders = [...orders];
		newOrders[orderIndex].products[productIndex].checked =
			!newOrders[orderIndex].products[productIndex].checked;
		setOrders(newOrders);
	};

	const allChecked = (products) => {
		return products.every((product) => product.checked);
	};

	function mapPayment(paymentMethod) {
		if (paymentMethod === null) return;

		return paymentMethod === 'cash' ? 'Efectivo' : 'Sinpe';
	}

	return (
		<Layout>
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
				<div className='grid sm:grid-cols-1 md:grid-cols-2 gap-4'>
					{orders.map((order, orderIndex) => (
						<div
							key={order._id}
							className='bg-white p-4 m-2 rounded shadow flex flex-col justify-between'
						>
							<div>
								<div className='flex justify-between items-center mb-4'>
									<h2 className='text-xl font-bold mb-2'>{order.clientName}</h2>
									<p className='text-gray-700 mb-2'>
										{new Date(order.creationDate).toLocaleString()}
									</p>
								</div>
								<hr className='border-t border-gray-200 mb-4' />
								<ul className='mb-2'>
									{order.products.map((product, productIndex) => (
										<li key={productIndex} className='text-gray-700 flex m-1'>
											<span className='w-5/12'>{product.name}</span>
											<span className='w-5/12'>{product.quantity}</span>
											<input
												className='w-2/12'
												type='checkbox'
												checked={product.checked || false}
												onChange={() =>
													toggleCheckbox(orderIndex, productIndex)
												}
											/>
										</li>
									))}
								</ul>
								<hr className='border-t border-gray-200 mb-4' />
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-gray-700 font-bold'>
									Total: ₡{order.total}
								</span>
								<span className='text-gray-700 font-bold'>
									{mapPayment(order.paymentMethod)}
								</span>
								<button
									className={`bg-blue-500 text-white px-4 py-2 rounded ${
										!allChecked(order.products)
											? 'opacity-50 cursor-not-allowed'
											: ''
									}`}
									onClick={() => handleFinishClick(order._id)}
									disabled={!allChecked(order.products)}
								>
									Finalizar
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</Layout>
	);
}
