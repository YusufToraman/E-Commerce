const express = require('express');
const dotenv = require('dotenv');
const routers = require('./routers');
const connectDatabase = require('./helpers/database/connectDatabase');
const customErrorHandler = require('./middlewares/errors/customErrorHandler');
const path = require("path")

//Environment Variables
dotenv.config({
    path: "./config/env/config.env"
});

//MongoDb Connection
connectDatabase();

const app = express();

const PORT = process.env.PORT;

//Express Body Middleware
app.use(express.json());

//router middleware
app.use('/api',routers);

// Custom Error Handler Middleware
app.use(customErrorHandler);

// Static Files
app.use(express.static(path.join(__dirname, "public")));


app.listen(PORT, () =>{
    console.log(`App Started on ${PORT}: ${process.env.NODE_ENV}`);
});
