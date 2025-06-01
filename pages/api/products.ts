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
		const collection = db.collection('products');

		if (req.method === 'GET') {
			const { status } = req.query;

			let filter = {};
			if (status === 'enabled') {
				filter = { status: 'enabled' };
			}

			const products = await collection.find(filter).toArray();
			res.status(200).json(products);
		} else if (req.method === 'POST') {
			const { name, price, category, status } = req.body;
			const result = await collection.insertOne({
				name,
				price,
				category,
				status,
			});
			res.status(201).json({ message: 'Product created' });
		} else if (req.method === 'PUT') {
			const { id, name, price, category, status } = req.body;
			await collection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { name, price, category, status } }
			);
			res.status(200).json({ message: 'Product updated' });
		} else if (req.method === 'DELETE') {
			const { id } = req.body;
			await collection.deleteOne({ _id: new ObjectId(id) });
			res.status(200).json({ message: 'Product deleted' });
		} else {
			res.setHeader('Allow', ['GET', 'PUT']);
			res.status(405).end(`Method ${req.method} Not Allowed`);
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Unable to fetch data' });
	}
}
