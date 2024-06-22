import { MongoClient, MongoError } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        console.log('a');
        await client.connect();
        const database = client.db('pathways');
        const collection = database.collection('2020');
        const newDocument = {
            name: 'New Pathway',
            description: 'Description of the new pathway',
            createdAt: new Date(),
        };
        await collection.insertOne(newDocument);

        return NextResponse.json({status: "ok"});
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong!' });
    } finally {
        await client.close();
    }
}

