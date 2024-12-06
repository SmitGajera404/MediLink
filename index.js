import express from 'express';
import bp from 'body-parser';
import cors from 'cors';
import Router from './Routes/routes.js';
import dotenv from 'dotenv';
import Connection from './Database/MongoDB/database.js';
dotenv.config();
const app = express();


app.use(bp.json({ limit: '10mb' }));
app.use(bp.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use('/api',Router);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
})

Connection(process.env.MONGODB_URL);






