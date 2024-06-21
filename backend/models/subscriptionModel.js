import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema({
    userId: { type: String, require: true },
    type: { type: String, enum: ['Basic Plan', 'Premium Plan'], require: true },
    price: { type: Number, require: true }
}, { timestamps: true });

const SubscriptionModel = mongoose.model('subscription', subscriptionSchema);

export { SubscriptionModel };