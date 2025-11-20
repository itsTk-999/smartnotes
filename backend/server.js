const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Node.js built-in module for paths
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// --- 1. IMPORT ROUTE FILES ---
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Allows server to accept JSON data
app.use(cors()); // Allows frontend to talk to backend

// --- 2. MOUNT API ROUTES ---
// These handle all data requests starting with /api/
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);

// --- 3. PRODUCTION STATIC ASSET SETUP ---
// Only runs if the environment is set to 'production' (e.g., when deployed)
if (process.env.NODE_ENV === 'production') {
    // 3a. Serve the static 'dist' folder from the built frontend
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // 3b. Handle all other GET requests by serving index.html
    // This allows React Router to handle client-side navigation (e.g., /dashboard, /notes)
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'))
    );
} else {
    // Development route check
    app.get('/', (req, res) => {
        res.send('API is running in development mode.');
    });
}
// --- END PRODUCTION SETUP ---

// Error Handling Middleware (Must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));