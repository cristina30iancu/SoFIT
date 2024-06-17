import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    name: String,
    occupation: String,
    review: String,
    image: String,
    rating: Number
});

const ReviewModel = mongoose.model('review', reviewSchema);

export { ReviewModel };