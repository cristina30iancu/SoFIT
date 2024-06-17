import mongoose from 'mongoose';

const signupSchema = mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String, require: true },
    address: { type: String, require: true },
    password: { type: String, require: true }
});

const Signupmodel = mongoose.model('user', signupSchema);

export { Signupmodel };