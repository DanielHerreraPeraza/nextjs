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
			const { date } = req.query;

			if (!date) {
				return res
					.status(400)
					.json({ error: 'Date query parameter is required' });
			}

			// Parse the date and construct the start and end of the day strings
			if (typeof date !== 'string') {
				return res
					.status(400)
					.json({ error: 'Date must be a single string in DD/MM/YYYY format' });
			}
			const [day, month, year] = date.split('/'); // Assuming date is in DD/MM/YYYY format
			const startOfDay = `${day}/${month}/${year}T00:00:00`;
			const endOfDay = `${day}/${month}/${year}T23:59:59`;

			console.log('Start of Day:', startOfDay);
			console.log('End of Day:', endOfDay);

			// Query for records within the specified day using string comparisons
			const orders = await collection
				.find({
					creationDate: { $gte: startOfDay, $lte: endOfDay },
				})
				.toArray();

			res.status(200).json(orders);
		} else {
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${req.method} Not Allowed`);
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Unable to fetch data' });
	}
}
