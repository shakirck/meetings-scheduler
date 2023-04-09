import express from 'express';
import routes from './routes/routes';
import {connect} from  './config/db';
import dotenv from 'dotenv';
import swaggerDocs from './config/swagger';
import cors from 'cors'
import helmet from 'helmet';
import morgan = require('morgan');
dotenv.config();
const app = express();
app.use(express.json());
app.use(routes);
app.use(cors({
    origin:"*"
}))
app.use(helmet());
app.use(morgan("common"))
 
app.listen(8080, async ()=>{
    await connect();
    swaggerDocs(app);
    console.log("Server is running on port 8080");
}
)