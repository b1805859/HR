const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const geocoder = require("../../utils/geocoder")

const TimekeepPosition = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    longitude: { type: 'string', string: 'Kinh độ' },
    latitude: { type: 'string', string: 'Vĩ độ' },
    address: { type: 'string', string: 'Địa chỉ' },
    scope: { type: Number, string: 'Phạm vi' },
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
    this.location = {
        type: 'Point',
        coordinates: [this.longitude, this.latitude],
        formattedAddress: this.formattedAddress
    };
    next();
});

module.exports = mongoose.model('TimekeepPosition', TimekeepPosition);