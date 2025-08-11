import express from 'express';
import cors from 'cors';
import urlRoute from './routes/urlShortnerRoute.js'
import dotenv from 'dotenv';
import connectToDB from './db/connectToDB.js';
dotenv.config();

const PORT=process.env.PORT ||4000;
const app=express();

app.use(
  cors({
    origin: process.env.BASE_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
  })
);
app.use(express.json());

app.use("/",urlRoute);


app.listen(PORT,()=>{
     console.log("server is running at "+PORT);
     connectToDB();
})