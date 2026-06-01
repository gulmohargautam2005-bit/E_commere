const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [
        {
            productId: { type: String, required: true },
            title: { type: String, required: true },
            image: { type: String },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            subtotal: { type: Number, required: true },
            rating: { type: Number }
        }
    ],
    billingDetails: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        country: { type: String, default: 'India' },
        streetAddress1: { type: String, required: true },
        streetAddress2: { type: String },
        city: { type: String, required: true },
        postcode: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        createAccount: { type: Boolean, default: false },
        shipDifferentAddress: { type: Boolean, default: false },
        orderNotes: { type: String }
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    products: [
        {
            productId: { type: String, required: true },
            title: { type: String, required: true },
            image: { type: String },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            subtotal: { type: Number, required: true },
            rating: { type: Number }
        }
    ],
    date: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set("toJSON", {
    virtuals: true,
});

exports.Order = mongoose.model("Order", orderSchema);
exports.orderSchema = orderSchema;
