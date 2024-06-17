import express from 'express';
import cors from 'cors';
import { connection } from './config/db.js';
import { trainerRouter } from './Routes/trainer.route.js';
import { bookingRoutes } from './Routes/bookingRoutes.js';
import { signupRoute } from './Routes/signupRoute.js';
import { reviewRoutes } from './Routes/reviewRoutes.js';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.use('/user', signupRoute);
app.use('/trainer', trainerRouter);
app.use('/booking', bookingRoutes);
app.use('/reviews', reviewRoutes);

import {  adminJs,  router } from './admin/adminPage.js';
app.use(adminJs.options.rootPath, router);
adminJs.watch()

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log('connected to DB');
    } catch (error) {
        console.log(error);
    }
    console.log(`server is running at ${process.env.port}`);
});
