import express from 'express';
import { ReviewModel } from '../models/reviewModel.js';

const reviewRoutes = express.Router();

// POST route to add a new review
reviewRoutes.post('/', async (req, res) => {
    try {
        const { name, occupation, review, rating } = req.body;
        const newReview = new ReviewModel({ name, occupation, review, rating });
        await newReview.save();
        console.log('Added');
        return res.status(200).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

// GET route to get all reviews
reviewRoutes.get('/', async (req, res) => {
    try {
        const reviews = await ReviewModel.find();
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { reviewRoutes };