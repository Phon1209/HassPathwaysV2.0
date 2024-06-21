import { MongoClient } from 'mongodb';

async function handler(req, res) {
    const { method } = req;

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        if (method === 'GET') {
            await client.connect();
            const database = client.db();
            const collection = database.collection('pathways');
            const pathways = await collection.find({}).toArray();
            res.status(200).json(pathways);
        } else if (method === 'POST') {
            await client.connect();
            const database = client.db();
            const collection = database.collection('pathways');
            const { name, year } = req.body;
            const result = await collection.insertOne({ name, year });
            res.status(201).json(result.ops[0]);
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.error('Error handling request:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
}

export default handler;
