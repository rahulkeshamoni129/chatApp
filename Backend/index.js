// index.js
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js';
import messageRoute from './routes/message.route.js'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { app, server } from './SockedIo/server.js';
import path from "path";

dotenv.config();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 4000;
const URI = process.env.MONGODB_URI;

// Connect to MongoDB without blocking server startup
mongoose.connect(URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("MongoDB connection error:", err.message);
  console.log("Server will continue without database connection");
});

app.use("/api/users", userRoute);
app.use("/api/message", messageRoute);

console.log("NODE_ENV:", process.env.NODE_ENV);

if(process.env.NODE_ENV === "production"){
  console.log("Running in production mode");
  const dirPath = path.resolve();
  console.log("Serving static files from:", path.join(dirPath, "Frontend/dist"));
  app.use(express.static(path.join(dirPath, "Frontend/dist")));
  app.get("*",(req,res)=>{
    res.sendFile(path.join(dirPath, "Frontend/dist", "index.html"));
  })
} else {
  console.log("Running in development mode");
}

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
  
 