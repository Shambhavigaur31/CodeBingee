const { MongoClient } = require("mongodb");

let uri =
  `mongodb+srv://Shavi:Shavi%4033@cluster0.wgujkkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    
  } finally {
    await client.close();
  }
}
run().catch(console.dir);