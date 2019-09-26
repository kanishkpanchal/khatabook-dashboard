import mongoose from "mongoose";
require('dotenv').config();

const connectionString = process.env.MONGO_DB_URI;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    autoIndex: false,
    useFindAndModify: false
}).then(() => {
    console.log("Connected to DB!!");
}).catch((err) => {
    console.log("Error: " + err.message);
});

export default mongoose.connection;