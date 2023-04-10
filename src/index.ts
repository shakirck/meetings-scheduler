import app from './app';
 import dotenv from 'dotenv';

import router from './routes/routes';
import swaggerDocs from './config/swagger';
import mongoose from 'mongoose';
dotenv.config();
app.use(router);
app.listen(8080, async ()=>{

    try {
        await mongoose.connect(process.env.MONGODB_URI|| "")

    } catch (error) {   
        console.log("Error connecting to mongo",error);
        console.log(process.env.MONGODB_URI)
        
    }
    // swaggerDocs(app);
    console.log("Server is running on port 8080");
}
)