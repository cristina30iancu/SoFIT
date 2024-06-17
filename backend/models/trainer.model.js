import mongoose from 'mongoose';

const trainerSchema = mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    image: String,
    price: Number,
    specialization: String,
    timeslot: Array(Object)
});

const TrainerModel = mongoose.model('trainer', trainerSchema);

export { TrainerModel };