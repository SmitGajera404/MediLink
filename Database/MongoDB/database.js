import mongoose from "mongoose";

 
const Connection = async(url) => {
    try {
        const conn = mongoose.connect(url).then(
            () => console.log("Connected to MongoDB Atlas")
        ).catch(
            (err) => console.log(err)
        )
        return conn;
    }catch(error){
        console.log(error);
    }
}

export default Connection