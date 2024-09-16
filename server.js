import customENV from 'custom-env';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import videosRouter from './routes/video.js';
import commentsRouter from './routes/comment.js';
import userRouter from './routes/user.js';
import tokensRouter from './routes/token.js';
import { initializeDatabase } from './initializeDatabase.js';

// Set the environment explicitly if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

// Load environment variables
customENV.env(process.env.NODE_ENV, "./config");

// Print the connection string to ensure it's loaded correctly
console.log('Connection String:', process.env.CONNECTION_STRING);
console.log('Port:', process.env.PORT);

const server = express();
server.use(cors());

// Body Parser Middleware
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.set('view engine', 'ejs');

// Routes
server.use("/api/users", userRouter);
server.use("/api/tokens", tokensRouter);
server.use('/api/videos', videosRouter);
server.use('/api/comments', commentsRouter);

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Initialize the database with initial data if necessary
        await initializeDatabase();

        // Start the server
        const PORT = process.env.PORT || 8080;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
