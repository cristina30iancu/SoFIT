import express from 'express';
import { SubscriptionModel } from '../models/subscriptionModel.js';
import { authenticate } from '../middlewares/authenticateMiddleware.js';

const subscriptionRoutes = express.Router();

// Creare abonament nou
subscriptionRoutes.post('/create', authenticate, async (req, res) => {
    const { type } = req.body;
    const userId = req.body.userId;

    if (!type || !userId) {
        return res.status(400).json({ msg: 'Type and userId are required' });
    }

    const price = type === 'Basic Plan' ? 150 : 700;

    try {
        const newSubscription = new SubscriptionModel({ userId, type, price });
        await newSubscription.save();
        res.status(201).json({ msg: 'Abonament creat cu succes', subscription: newSubscription });
    } catch (error) {
        console.log('error from creating subscription', error.message);
        res.status(500).json({ msg: 'Server error', errorMsg: error.message });
    }
});

// Obține toate abonamentele unui utilizator
subscriptionRoutes.get('/user', authenticate, async (req, res) => {
    const  userId  = req.body.userId; 
    try {
        const subscriptions = await SubscriptionModel.find({ userId });
        res.status(200).json({ msg: `Toate abonamentele pentru utilizatorul ${userId}`, subscriptions });
    } catch (error) {
        console.log('error from getting user subscriptions', error.message);
        res.status(500).json({ msg: 'Server error', errorMsg: error.message });
    }
});

// Șterge un abonament
subscriptionRoutes.delete('/remove/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        await SubscriptionModel.findByIdAndDelete(id);
        res.status(200).json({ msg: `Abonamentul a fost șters cu succes` });
    } catch (error) {
        console.log('error from deleting subscription', error.message);
        res.status(500).json({ msg: 'Server error', errorMsg: error.message });
    }
});

export { subscriptionRoutes };