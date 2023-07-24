const mongoose = require('mongoose');
const { response } = require('../app');

async function connect() {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`);
        //await mongoose.connect(process.env.MONGO_URL);
        console.log("connect succesfully")
    } catch (error) {
        return error
    }
}

module.exports = connect