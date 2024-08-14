import customENV from 'custom-env';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';
import videosRouter from './routes/video.js';
import cors from 'cors';

// Load environment variables based on the current environment
customENV.env(process.env.NODE_ENV, "./config");

const server = express();
server.use(cors());


// Body Parser Middleware
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.set('view engine', 'ejs');

// Routes
server.use('/', userRouter);
server.use('/api/videos', videosRouter);

// Connect to MongoDB

mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        // Start the server
        const PORT = process.env.PORT || 8080;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });




