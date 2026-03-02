import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { MongoClient } from 'mongodb';

async function check() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("No URL");

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db();
    const reviews = await db.collection('reviews').find({}).toArray();
    console.log(JSON.stringify(reviews, null, 2));

    await client.close();
    process.exit(0);
}

check();
