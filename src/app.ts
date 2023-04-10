import express from 'express';

import cors from 'cors'
import helmet from 'helmet';
import morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(cors({
    origin:"*"
}))
app.use(helmet());
app.use(morgan("common"))
 

export default app;