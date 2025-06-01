import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db('test');
		const collection = db.collection('orders');

		if (req.method === 'GET') {
			const orders = await collection
				.find({ status: 'open' })
				.sort({ creationDate: 1 })
				.limit(10)
				.toArray();
			res.status(200).json(orders);
		} else if (req.method === 'POST') {
			const {
				tableNumber,
				products,
				creationDate,
				status,
				total,
				paymentMethod,
			} = req.body;
			const result = await collection.insertOne({
				tableNumber,
				products,
				creationDate,
				status,
				total,
				paymentMethod,
			});
			res.status(201).json({ message: 'Order created' });
		} else if (req.method === 'PUT') {
			const { id, status } = req.body;
			await collection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { status } }
			);
			res.status(200).json({ message: 'Order updated' });
		} else {
			res.setHeader('Allow', ['GET', 'POST', 'PUT']);
			res.status(405).end(`Method ${req.method} Not Allowed`);
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Unable to fetch data' });
	}
}
