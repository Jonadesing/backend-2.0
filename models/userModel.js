const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    last_connection: { type: Date },
    documents: [
        {
            name: { type: String },
            link: { type: String }
        }
    ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
