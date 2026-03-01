import http from 'http';
import dotenv from 'dotenv';
import connectDB from './src/db/index.js';
import { app } from './src/app.js';
import { initializeSocket } from './src/socket.js';

dotenv.config({
  path: './.env',
});

const port = process.env.PORT || 8000;

const httpServer = http.createServer(app);
initializeSocket(httpServer);

connectDB()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log('MONGO db connection failed !!! ', err);
  });
