import Layout from '../layout';
import { useEffect, useState } from 'react';
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
} from 'recharts';

export default function Report() {
	const [orders, setOrders] = useState([]);
	const [paymentData, setPaymentData] = useState([]);
	const [productData, setProductData] = useState([]);

	useEffect(() => {
		const fetchClosedOrders = async () => {
			const res = await fetch('/api/reports');
			const data = await res.json();
			setOrders(data);

			const paymentMethodMap = {};
			const productMap = {};

			data.forEach((order) => {
				// Group by payment method
				if (paymentMethodMap[order.paymentMethod]) {
					paymentMethodMap[order.paymentMethod].count += 1;
					paymentMethodMap[order.paymentMethod].total += order.total;
				} else {
					paymentMethodMap[order.paymentMethod] = {
						paymentMethod: order.paymentMethod,
						count: 1,
						total: order.total,
					};
				}

				// Group by product name
				order.products.forEach((product) => {
					if (productMap[product.name]) {
						productMap[product.name].quantity += product.quantity;
					} else {
						productMap[product.name] = {
							name: product.name,
							quantity: product.quantity,
						};
					}
				});
			});

			setPaymentData(Object.values(paymentMethodMap));
			setProductData(Object.values(productMap));
		};

		fetchClosedOrders();
	}, []);

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

	return (
		<Layout>
			<div className='container mx-auto p-4 sm:w-sm md:w-md'>
				<h1 className='text-2xl font-bold'>Reportes</h1>
				<div className='mt-14'>
					<PieChart width={400} height={400}>
						<Pie
							data={paymentData}
							dataKey='count'
							nameKey='paymentMethod'
							cx='50%'
							cy='50%'
							outerRadius={150}
							fill='#8884d8'
							label
						>
							{paymentData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
					<h2 className='text-xl font-bold mt-4 mb-4'>
						Ventas por método de pago
					</h2>
				</div>
				{/* <div className='mt-14'>
					<BarChart width={600} height={300} data={productData}>
						<XAxis dataKey='name' />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey='quantity' fill='#8884d8' />
					</BarChart>
					<h2 className='text-xl font-bold mb-4'>
						Cantidad de productos vendidos
					</h2>
				</div> */}
			</div>
		</Layout>
	);
}
