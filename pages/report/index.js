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
			// Define the timezone
			const timezone = 'America/Costa_Rica';

			// Get the current date in the specified timezone
			const now = new Date();
			const formatter = new Intl.DateTimeFormat('en-GB', {
				timeZone: timezone,
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			});

			// Extract the date part in DD/MM/YYYY format
			const currentDate = formatter.format(now); // Example: "01/06/2025"

			// Fetch data from the new API with the current date as a query parameter
			const res = await fetch(`/api/reports?date=${currentDate}`);
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
			<div className='container mx-auto p-4'>
				<h1 className='text-2xl font-bold mb-4'>Reportes</h1>
				<div className='flex justify-center items-center'>
					<PieChart width={600} height={500}>
						<Pie
							data={paymentData}
							dataKey='total'
							nameKey='paymentMethod'
							cx='50%'
							cy='50%'
							outerRadius={150}
							fill='#8884d8'
							label={({ name, value }) => `₡${value}`} // Custom label with ₡ symbol
						>
							{paymentData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip formatter={(value) => `₡${value}`} />{' '}
						{/* Add ₡ to tooltip values */}
						<Legend />
					</PieChart>
				</div>
				<div className='mb-8'>
					<h2 className='text-xl font-bold mb-4'>
						Detalles de Órdenes por Método de Pago
					</h2>
					<table className='min-w-full bg-white'>
						<thead>
							<tr>
								<th className='py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-700 uppercase tracking-wider'>
									Método de Pago
								</th>
								<th className='py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-700 uppercase tracking-wider'>
									Número de Órdenes
								</th>
								<th className='py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 font-medium text-gray-700 uppercase tracking-wider'>
									Total
								</th>
							</tr>
						</thead>
						<tbody>
							{paymentData.map((entry, index) => (
								<tr key={index}>
									<td className='py-2 px-4 border-b border-gray-200'>
										{entry.paymentMethod}
									</td>
									<td className='py-2 px-4 border-b border-gray-200'>
										{entry.count}
									</td>
									<td className='py-2 px-4 border-b border-gray-200'>
										₡{entry.total}
									</td>
								</tr>
							))}
							{/* Add a row for the total sum and total number of orders */}
							<tr>
								<td className='py-2 px-4 border-t border-gray-300 font-bold'>
									Total General
								</td>
								<td className='py-2 px-4 border-t border-gray-300 font-bold'>
									{paymentData.reduce((sum, entry) => sum + entry.count, 0)}
								</td>
								<td className='py-2 px-4 border-t border-gray-300 font-bold'>
									₡{paymentData.reduce((sum, entry) => sum + entry.total, 0)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				{/* <div>
                    <h2 className='text-xl font-bold mb-4'>Productos por Nombre</h2>
                    <BarChart width={600} height={300} data={productData}>
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey='quantity' fill='#8884d8' />
                    </BarChart>
                </div> */}
			</div>
		</Layout>
	);
}
