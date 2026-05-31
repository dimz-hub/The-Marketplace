import 'dotenv/config';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dns from 'dns';
import businessRoutes from './routes/business';
import authRoutes from './routes/authRoute';
import passport from './config/passport';


// FORCED NETWORK FIX: Bypasses local ISP DNS blocks
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

app.use(passport.initialize());



// Routes
app.use('/business', businessRoutes);
// This allows http://localhost:4000/uploads/xyz.jpg to work
app.use('/uploads', express.static('uploads'));



app.use('/auth', authRoutes);

// Basic Test Route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: "API is running" });
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ Error: MONGO_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(MONGO_URI, {
    family: 4 // Forces IPv4 to avoid ECONNREFUSED on Windows/Local Wi-Fi
})
.then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
    });
})
.catch((err: unknown) => {
    console.error('❌ Database connection error:');
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error(err);
    }
});