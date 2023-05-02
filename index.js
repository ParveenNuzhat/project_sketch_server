const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.a9onrgn.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("sketchArchea");
    const messagesCollection = database.collection("messages");

    //   GET API
    app.get("/messages", async (req, res) => {
      const cursor = messagesCollection.find({});
      const messages = await cursor.toArray();
      res.send(messages);
    });

    // POST API
    app.post("/messages", async (req, res) => {
      const message = req.body;
      console.log("hit the post API", message);

      const result = await messagesCollection.insertOne(message);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("sending data from backend");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
