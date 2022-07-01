const mongoose = require('mongoose');

const role = new mongoose.Schema({
    server: Number,
    roles: [
        {
            name: String,
            description: String
        }
    ]
})

module.exports = mongoose.model('testing-role', role)