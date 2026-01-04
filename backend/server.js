import express from 'express';
import cors from 'cors';
// Firebase config is now loaded in config/firebase.js but not explicitly needed here unless we use 'admin' directly.
// The routes use the middleware which uses the config.

import authRoutes from './routes/authRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import connectDB from './config/db.js';

const app = express();
const port = 5000;

connectDB();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/analyze', analyzeRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.get("/health",(req,res)=>{
    return res.status(200).json({status:"200 OK"});
});

app.listen(port, () => {
    console.log(`server live`);
});
