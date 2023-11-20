const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount_total: {
        type: Number,
        required: true
    },
    created: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true,
    },
    customer_details: {
        address: {
            city: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            line1: {
                type: String,
                required: true
            },
            line2: {
                type: String,
                required: false
            },
            postal_code: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            }
        },
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    payment_status: {
        type: String,
        required: true
    }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order