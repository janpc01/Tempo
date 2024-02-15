import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import { Worker } from 'worker_threads';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Routes
app.use('/', router);

// Create a new Worker


// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // const myWorker = new Worker('./utils/worker.js');
    // myWorker.postMessage('Start Updating!'); // start
    // myWorker.onmessage = (e) => {
    //     result.textContent = e.data;
    //     console.log("Message received from worker");
    //   };
});
