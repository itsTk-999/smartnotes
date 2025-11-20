const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Required for serving static files
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db'); // Assuming this handles the DB connection logic

// --- 1. IMPORT ROUTE FILES ---
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();
connectDB();

const app = express();

// --- 2. MIDDLEWARE & SECURITY ---
// 2a. CORS Configuration (Allows frontend to communicate with backend)
const allowedOrigins = [
  // IMPORTANT: Replace this with your actual Vercel domain
  'https://smartnotes001.vercel.app/',
  'https://vercel.com/lil-tks-projects/smartnotes/HWqj3etcgVHymFZRi71uzvVCgVsx', 
  // Add other deployment domains as needed
  'http://localhost:3000', // Local dev access
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, postman, or curl)
    if (!origin) return callback(null, true); 
    
    // Allow the specific domains listed above
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // You should check this error in your Render logs if deployment fails
      callback(new Error('Not allowed by CORS'), false); 
    }
  },
  credentials: true, // Allow cookies/authorization headers
};

app.use(cors(corsOptions));
app.use(express.json()); // Allows server to accept JSON data

// --- 3. MOUNT API ROUTES ---
// These handle all data requests starting with /api/
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);

// --- 4. PRODUCTION STATIC ASSET SETUP ---
// This block ensures the React frontend is served correctly when deployed
if (process.env.NODE_ENV === 'production') {
    // 4a. Serve the static 'dist' folder from the built frontend
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // 4b. Handle all other GET requests (for React Router) by serving index.html
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'))
    );
} else {
    // Development route check (only visible when running locally)
    app.get('/', (req, res) => {
        res.send('API is running in development mode.');
    });
}

// --- 5. ERROR HANDLING (Must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));