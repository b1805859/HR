const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const geocoder = require("../utils/geocoder")

const TimekeepPosition = new Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
    },
    longitude: { type: 'string', string: 'Kinh độ' },
    latitude: { type: 'string', string: 'Vĩ độ' },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Geocode & create location
TimekeepPosition.pre('save', async function (next) {
    // const loc = await geocoder.geocode(this.address);
    const res = await geocoder.reverse({ lat: this.latitude, lon: this.longitude });
    console.log('res', res)
    this.location = {
        type: 'Point',
        coordinates: [res[0].longitude, res[0].latitude],
        formattedAddress: res[0].formattedAddress
    };


    next();
});

module.exports = mongoose.model('TimekeepPosition', TimekeepPosition);