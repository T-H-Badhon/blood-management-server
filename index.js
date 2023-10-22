const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.3qumfwu.mongodb.net/?retryWrites=true&w=majority`;

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

    const donorsInfo = client.db("DonorsInfo");
    const donorInfo = donorsInfo.collection("donorInfo");
    
    app.get('/:email', async (req, res) => {
        const email=req.params.email
        const query = { email: email };
        const cursor = donorInfo.find(query);
        const result= await cursor.toArray()
        res.send(result)
      })
    
    
    app.post('/profile', async (req,res)=>{ 
        const newDonor=req.body 
        const result = await donorInfo.insertOne(newDonor);
        res.send(result)
        
    })

    app.put('/update', async (req,res) =>{
        
        const updateDonor=req.body 
        const email=updateDonor.email
        const query = { email: email };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              userName: updateDonor.userName,
              bloodGroup: updateDonor.bloodGroup,
              address: updateDonor.address,
              email: updateDonor.email,
              phone: updateDonor.phone
            },
          };

        const result = await donorInfo.updateOne(query, updateDoc, options);
        res.send(result)

    })

    app.delete('/:email',async (req,res)=>{
        const email=req.params.email
        const query = { email: email };
        const result = await donorInfo.deleteOne(query);
        res.send(result)

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
  })

  


 app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
