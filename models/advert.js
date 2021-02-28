const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const advertSchema = mongoose.Schema({

    _id: mongoose.Types.ObjectId,
    cabin: { type: mongoose.Types.ObjectId, ref: 'Cabin', required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    owner: { type: String },
    email: { type: String }
});
advertSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Advert', advertSchema);