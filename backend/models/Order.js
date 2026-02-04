import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            required: true,
        },
        customer: {
            name: {
                type: String,
                required: [true, 'Customer name is required'],
            },
            email: {
                type: String,
                required: [true, 'Customer email is required'],
            },
            phone: {
                type: String,
                required: [true, 'Customer phone is required'],
            },
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: String,
                image: String,
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        shippingAddress: {
            fullName: String,
            phone: String,
            addressLine1: {
                type: String,
                required: [true, 'Address is required'],
            },
            addressLine2: String,
            city: {
                type: String,
                required: [true, 'City is required'],
            },
            state: String,
            postalCode: String,
            country: {
                type: String,
                default: 'Algeria',
            },
        },
        paymentMethod: {
            type: String,
            enum: ['COD'],
            default: 'COD',
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        taxPrice: {
            type: Number,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        notes: {
            type: String,
            maxlength: 500,
        },
        trackingNumber: String,
        deliveredAt: Date,
        cancelledAt: Date,
        cancellationReason: String,
    },
    {
        timestamps: true,
    }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `AS${year}${month}${(count + 1).toString().padStart(5, '0')}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
