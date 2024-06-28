import { MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI;

const options = {};

if (!URI) {
    throw new Error('Missing Mongo URI in .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
    client = new MongoClient(URI, options);
    global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
