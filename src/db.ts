import { MongoClient, ServerApiVersion } from "mongodb";

const url = process.env.DATABASE_URL ?? "";

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
  },
});

export async function database_connection(moving24_collections: any[]) {
  try {
    await client.connect();
    const db = client.db("Moving24");
    const collection = moving24_collections.map((element) => {
      return db.collection(element);
    });

    return collection;
  } catch (error) {
    console.error(
      "Error occurred while connecting to MongoDB Atlas...\n",
      error,
    );
  }
}
