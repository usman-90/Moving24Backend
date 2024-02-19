import { MongoClient, ServerApiVersion } from "mongodb";

const url = process.env.DATABASE_URL ?? "";
console.log(url)
const client = new MongoClient("mongodb+srv://salman:4lanHyMRdCrtXDJ7@startbikes.nglnioh.mongodb.net/", {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
  },
});

export async function database_connection(moving24_collections: any[]) : Promise<any[] | undefined>{
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
    return
  }
}
