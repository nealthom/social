require ('dotenv').config(); // import environment variables
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// config express
const app = express()
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// config DB
const db = process.env.mongoURI;

// connect to mongo DB
mongoose.connect(db,{useNewUrlParser: true})
    .then(()=> console.log('MongoDB connected'))
    .catch(err => console.log(err));





const port = process.env.Port || 5000;

app.get('/',(req,res)=>{
    res.send('Hello World');
});


app.listen(port,()=>console.log(`Server running on ${port}`));