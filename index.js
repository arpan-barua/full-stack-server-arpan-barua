const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
ObjectID = require('mongodb').ObjectID
require('dotenv').config();
const port = 5055;

const app = express();
app.use(bodyParser.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pz7qy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("smartWatch").collection("products");
  const orderCollection = client.db("smartWatch").collection("orders"); 
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, products) => {
        res.send(products)
    })
})

app.post("/addOrders", (req, res) => {
  const newOrders = req.body;
  orderCollection.insertOne(newOrders)
  .then(result => {
    res.send(result.insertedCount > 0)
  })
 })

 app.get('/orders', (req, res) => {
  orderCollection.find()
  .toArray((err, orders) => {
    res.send(orders)
  })
})

app.delete('/deleteProduct/:id', (req, res) => {
  const id = ObjectID(req.params.id);
  productCollection.findOneAndDelete({_id:id})
  .then(documents => res.send(!!documents.value));
})
  
});

app.listen(process.env.PORT || port)