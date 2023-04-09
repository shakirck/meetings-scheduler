import express from 'express';
 import dotenv from 'dotenv';

import cors from 'cors'
import helmet from 'helmet';
import morgan = require('morgan');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin:"*"
}))
app.use(helmet());
app.use(morgan("common"))
 

export default app;