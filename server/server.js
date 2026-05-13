require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const businessRoutes = require('./routes/business')

const app = express()

app.use(express.json())
app.use( businessRoutes)

if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI,{
  family: 4
})
  .then(() => {
    console.log('connected to database')
    const port = process.env.PORT || 4000;  
    app.listen(port, () => {
      console.log('listening for requests on port', port)
    })
  })
   .catch((err) => {
    console.log(err)
  }) 