const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const cabinSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    beds: Number,
    sauna: Boolean,
    beach: Boolean,
    email: { type: String }


});
cabinSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Cabin', cabinSchema);