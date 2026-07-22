require('dotenv').config();
const mongoose = require('mongoose');


async function conectToDb() {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('Successfully connected to MongoDB');
}


module.exports = conectToDb;