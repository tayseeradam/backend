const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB configuration
const uri = "mongodb+srv://mern-book-store:Sstt1996@cluster0.5iy9b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const bookCollections = client.db('BookInventory').collection('books');

    // Routes
    app.get('/', (req, res) => res.send('Hello World'));

    // Insert a book
    app.post('/upload-book', async (req, res) => {
      const data = req.body;
      const result = await bookCollections.insertOne(data);
      res.send(result);
    });

    // Get all books
    app.get('/all-books', async (req, res) => {
      const books = bookCollections.find();
      const result = await books.toArray();
      res.send(result);
    });

    // Get books by category
    app.get('/books-by-category', async (req, res) => {
      let query = {};
      if (req.query?.Category) {
        query = { Category: req.query.Category };
      }
      const result = await bookCollections.find(query).toArray();
      res.send(result);
    });

    // Get single book by ID
    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollections.findOne(filter);
      res.send(result);
    });

    // Update book
    app.patch('/book/:id', async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { ...updateBookData } };
      const options = { upsert: true };
      const result = await bookCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Delete book
    app.delete('/book/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollections.deleteOne(filter);
      res.send(result);
    });

    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
