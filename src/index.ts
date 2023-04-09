import app from './app';
import {connect} from  './config/db';
import router from './routes/routes';
import swaggerDocs from './config/swagger';
app.use(router);
app.listen(8080, async ()=>{
    await connect();
    swaggerDocs(app);
    console.log("Server is running on port 8080");
}
)