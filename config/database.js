import mongoose from "mongoose";

export const connectDB= async ()=>{

    const {connection}=await mongoose.connect("mongodb+srv://vighneshhegde:passwordforviggy@cluster0.mbil8ch.mongodb.net/coursebundler?retryWrites=true");

    console.log(`MongoDB is connected on ${connection.host}`);
}