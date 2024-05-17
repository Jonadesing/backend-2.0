const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    }
}, {
    timestamps: true // Habilita el registro automático de timestamps (createdAt, updatedAt)
});

const User = mongoose.model('User', userSchema);

module.exports = User;
