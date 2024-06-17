import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
    userId: { type: String, require: true },
    trainerId: { type: String, require: true },
    userEmail: { type: String, require: true },
    bookingDate: { type: String, require: true }, //mm/dd/yyyy
    bookingSlot: { type: String, require: true }
}, { timestamps: true });

const Bookingmodel = mongoose.model('booking', bookingSchema);

export { Bookingmodel };