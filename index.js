const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 9000;

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.lwjqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const jobsCollection = client.db('jobPortal').collection('jobs');
    const bidsCollection = client.db('jobPortal').collection('bids');

    // get all jobs data from db
    app.get('/jobs', async (req, res) => {
      const result = await jobsCollection.find().toArray();

      res.send(result);
    });

    // get a single job data from db using job id
    app.get('/job/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollection.findOne(query);
      res.send(result);
    });

    // save a bid data in db
    app.post('/bid', async (req, res) => {
      const bidData = req.body;
      const result = await bidsCollection.insertOne(bidData);
      res.send(result);
    });
    
    // save a job data in db
    app.post('/job', async (req, res) => {
      const jobData = req.body;
      const result = await jobsCollection.insertOne(jobData);
      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello form job portal....');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
