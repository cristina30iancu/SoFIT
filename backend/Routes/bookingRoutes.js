import express from 'express';
import { Bookingmodel } from '../models/bookingModel.js';
import { authenticate } from '../middlewares/authenticateMiddleware.js';
import nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
import { TrainerModel } from '../models/trainer.model.js';
import { SubscriptionModel } from '../models/subscriptionModel.js';

dotenvConfig();

const bookingRoutes = express.Router();

bookingRoutes.get('/', async (req, res) => {
    try {
        const reqData = await Bookingmodel.find();
        res.json({ msg: 'All booking data', bookingData: reqData });
    } catch (error) {
        console.log('error from getting all booking data', error.message);
        res.json({ msg: 'error in getting all booking data', errorMsg: error.message });
    }
});

bookingRoutes.get('/userId', authenticate, async (req, res) => {
    let userId = req.body.userId;
    try {
        const reqData = await Bookingmodel.find({ userId }).populate('trainerId');
        let toReturn = []
        for(let book of reqData){
            const trainer = await TrainerModel.find({_id: book.trainerId})
            toReturn.push({...book, trainer: trainer})
        }
        res.json({ msg: `All booking data of userId ${userId}`, Data: toReturn });
    } catch (error) {
        console.log('error from getting particular user booking data', error.message);
        res.json({ msg: 'error in getting particular user booking data', errorMsg: error.message });
    }
});

bookingRoutes.get('/:trainerId', async (req, res) => {
    let trainerId = req.params.trainerId;
    try {
        const reqData = await Bookingmodel.find({ trainerId });
        res.json({ msg: `All booking data of trainerId ${trainerId}`, Data: reqData });
    } catch (error) {
        console.log('error from getting particular trainer booking data', error.message);
        res.json({ msg: 'error in getting particular trainer booking data', errorMsg: error.message });
    }
});

bookingRoutes.post('/create', authenticate, async (req, res) => {
    const data = {...req.body, userId: req.body.userId, userEmail:  req.body.userEmail};
    console.log(data)
    try {
        const subscriptions = await Bookingmodel.find({ userId: req.body.userId });
        if(subscriptions.length >= 7){
            return res.status(403).json({msg: "Deja ți-ai atins limita!"})
        }
        const addData = new Bookingmodel(data);
        await addData.save();
        return res.status(200).json({msg: "rezervare nouă creată cu succes"})
    } catch (error) {
        console.log('error from adding new booking data', error.message);
        res.json({ msg: 'error in adding new booking data', errorMsg: error.message });
    }
});

bookingRoutes.patch('/edit/:id', async (req, res) => {
    const ID = req.params.id;
    const data = req.body;
    try {
        await Bookingmodel.findByIdAndUpdate({ _id: ID }, data);
        res.json({ msg: `booking id of ${ID} is updated successfully` });
    } catch (error) {
        console.log('error from editing booking data', error.message);
        res.json({ msg: 'error in edit of booking data', errorMsg: error.message });
    }
});

bookingRoutes.delete('/remove/:id', authenticate, async (req, res) => {
    const ID = req.params.id;
    try {
        await Bookingmodel.findByIdAndDelete({ _id: ID });
        res.json({ msg: `booking id of ${ID} is deleted successfully` });
    } catch (error) {
        console.log('error from deleting booking data', error.message);
        res.json({ msg: 'error in deleting of booking data', errorMsg: error.message });
    }
});

export { bookingRoutes };