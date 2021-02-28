const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bookingSchema = mongoose.Schema({

    _id: mongoose.Types.ObjectId,
    cabin: { type: mongoose.Types.ObjectId, ref: 'Cabin', required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    email: { type: String }
});
bookingSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Booking', bookingSchema);