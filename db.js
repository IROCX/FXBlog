const mongoose = require('mongoose');
const ENV = require('dotenv')
ENV.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log('Connected to DB Successfully');
    } catch (error) {
        console.log("Error: " + error);
    }
};

module.exports = { connectDB };
