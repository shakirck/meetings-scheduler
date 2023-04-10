import mongoose from "mongoose";
 

export const connect = async ()=>{
    await mongoose.connect(process.env.MONGO_URI|| "")

    mongoose.connection.on('connected',()=>{
        console.log("Connected to mongo instance");
    }
    )
    mongoose.connection.on('error',(err)=>{
        console.log("Error connecting to mongo",err);
    }
    )
}
 