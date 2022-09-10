const mongoose = require('mongoose')
module.exports = {
    sigleToObject: function (doc) {
        return doc.toObject(doc)
    },
    multipleToObject: function (docs) {
        let result = docs.map(doc => {
            return doc.toObject();
        })
        return result;
    }
}