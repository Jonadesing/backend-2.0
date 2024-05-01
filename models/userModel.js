const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'premium'],
        default: 'user'
    },
    documents: [{
        name: String,
        reference: String,
        type: {
            type: String,
            enum: ['ID', 'ProofOfAddress', 'BankStatement']
        }
    }],
    last_connection: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
