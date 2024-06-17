import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    name: String,
    occupation: String,
    review: String,
    rating: Number
});

const ReviewModel = mongoose.model('review', reviewSchema);

export { ReviewModel };