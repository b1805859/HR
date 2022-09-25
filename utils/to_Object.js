
module.exports = {

    multipleToObject: function (mongooses) {
        return mongooses.map(mongoose => mongoose.toObject());
    },
    sigleToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }
}