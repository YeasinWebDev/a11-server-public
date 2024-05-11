const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config();
const PORT = process.env.PORT || 8000

const app = express()

app.use(cors())
app.use(express.json())

app.listen(PORT)


const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

app.get('/', (req, res) => {
  res.send('CRUD IS RUNNER')
})




const uri = `mongodb+srv://${username}:${password}@cluster0.be4xnde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
