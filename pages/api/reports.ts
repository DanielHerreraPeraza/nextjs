import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const client = await clientPromise;
		const db = client.db('test');
		const collection = db.collection('orders');

		if (req.method === 'GET') {
			const orders = await collection.find({ status: 'closed' }).toArray();
			res.status(200).json(orders);
		} else {
			res.setHeader('Allow', ['GET', 'POST', 'PUT']);
			res.status(405).end(`Method ${req.method} Not Allowed`);
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Unable to fetch data' });
	}
}
