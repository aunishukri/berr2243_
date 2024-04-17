const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');


app.use(express.json())

//new user registration
app.post('/user', async (req, res) => {
  // check if username already exist ??
  let existing = await client.db("testcollectionrun").collection("datauser").findOne({
    username: req.body.username
  })

  if (existing) {
    res.status(400).send("username already exist")
  } else {
    // insertOne the registration data to mongo
    //console.log(req.body.username)
    const hash = bcrypt.hashSync(req.body.password, 10);

    //store hash in your password DB
    let result = await client.db("testcollectionrun").collection("datauser").insertOne(
      {
        username: req.body.username,
        password: hash,
        name: req.body.name,
        email: req.body.email
      }
    )
    res.send(result)
  }
})

// user login api 
app.post('/login', async (req, res) => {
  // step #1: req.body.username ??
  if (req.body.username != null && req.body.password != null) {
    let result = await client.db("testcollectionrun").collection("datauser").findOne({
      username: req.body.username
    })

    if (result) {
      // step #2: if user exist, check if password is correct
      //console.log(req.body.password)
      //console.log(result.password)
      //to check a password
      //Load hash from your password DB

      if (bcrypt.compareSync(req.body.password, result.password) == true) {
        // password is correct
        res.send('login successful')
        res.send("Welcome back " + result.name)
      } else {
        // password is incorrect
        res.status(401).send('wrong password')
      }

    } else {
      // step #3: if user not found
      res.status(401).send("username is not found")
    }
  } else {
    res.status(400).send("missing username or password")
  }
})




// get user profile
app.get('/user/:siapadia/:emaildia', async (req, res) => {
  // findOne
  let result = await client.db('maybank2u').collection('users').findOne({
    username: req.params.siapadia,
    email: req.params.emaildia
  })
  res.send(result)
})


// update user account
app.patch('/user', (req, res) => {
  // updateOne
  console.log('update user profile')
})

// delete user account
app.delete('/user', (req, res) => {
  // deleteOne
  console.log('delete user account')
})


app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://auniathirah:Yohan081001@cluster0.ogolmyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

