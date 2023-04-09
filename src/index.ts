import express from 'express';
import routes from './routes/routes';
import {connect} from  './config/db';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(routes);


 
app.listen(8080, async ()=>{
    await connect();
    console.log("Server is running on port 8080");
}
)