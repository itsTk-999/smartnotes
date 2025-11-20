const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Required for serving static files
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
app.use(express.json()); // Allows server to accept JSON data (for POST/PUT requests)
app.use(cors()); // Allows frontend to communicate with backend

// --- 2. MOUNT API ROUTES ---
// All data requests start with /api/
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tasks', taskRoutes);

// --- 3. PRODUCTION STATIC ASSET SETUP ---
// This block ensures the frontend is served correctly when deployed
if (process.env.NODE_ENV === 'production') {
    // 3a. Serve the static 'dist' folder from the built frontend
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // 3b. Handle all other GET requests (e.g., /dashboard, /notes) by serving index.html
    // This allows React Router to take over client-side routing.
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'))
    );
} else {
    // Development route check (only used when NODE_ENV is not 'production')
    app.get('/', (req, res) => {
        res.send('API is running in development mode.');
    });
}
// --- END PRODUCTION SETUP ---

// Error Handling Middleware (Must be last to catch all errors and 404s)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));