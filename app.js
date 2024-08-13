import express from 'express';
import bodyParser from 'body-parser';
import { router } from './routs/user.js';

const server = express();
server.use(bodyParser());
server.set('view engin', 'ejs');

app.use('/', router);

mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

server.listen(8080);
