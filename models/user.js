const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user', userSchema);