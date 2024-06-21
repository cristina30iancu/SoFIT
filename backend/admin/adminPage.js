import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/mongoose';
import { Bookingmodel } from '../models/bookingModel.js';
import { ReviewModel } from '../models/reviewModel.js';
import { Signupmodel } from '../models/signupModel.js';
import { TrainerModel } from '../models/trainer.model.js';
import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SubscriptionModel } from '../models/subscriptionModel.js';

// Obținerea __dirname în modul ES
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const componentLoader = new ComponentLoader();
const dashboardPath = path.resolve(_dirname, 'Dashboard.jsx');

AdminJS.registerAdapter({
    Database,
    Resource
});

const locale = {
    language: 'ro',
    translations: {
        labels: {
            loginWelcome: 'Bine ai venit!',
        },
        messages: {
            loginWelcome: 'Aplicația ta SoFIT',
        },
    },
};

export const adminJs = new AdminJS({
    resources: [
        Bookingmodel, ReviewModel, TrainerModel, SubscriptionModel,
        {
            resource: Signupmodel,
            options: {
                properties: {
                    password: {
                        isVisible: false
                    }
                }
            }
        }
    ],
    rootPath: '/admin',
    locale,
    branding: {
        companyName: 'SoFIT',
        withMadeWithLove: false,
        softwareBrothers: false
    },
    componentLoader,
    dashboard: {
        component: componentLoader.add('Dashboard', dashboardPath)
    }
});

adminJs.watch();

export const router = AdminJSExpress.buildRouter(adminJs);