import mongoose, { mongo } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'others'],
        required: [true, 'Category field is required']
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,

    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        // required: true,
        validate: {
            validator: function(value) { return value > this.startDate },
            message: 'Renew date must after start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }

}, { timestamps: true })


//Auto-calculate renewal date if missing
subscriptionSchema.pre('save', function(next) {
    if (!this.renewalDate) {
        const renewalDate = new Date(this.startDate);

        switch (this.frequency) {
            case 'daily':
                renewalDate.setDate(renewalDate.getDate() + 1);
                break;
            case 'weekly':
                renewalDate.setDate(renewalDate.getDate() + 7);
                break;
            case 'monthly':
                renewalDate.setMonth(renewalDate.getMonth() + 1);
                break;
            case 'yearly':
                renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                break;
        }

        this.renewalDate = renewalDate;
    }

    // Mark expired if renewal date already passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});



const Subscription = mongoose.model("Subscription", subscriptionSchema)
export default Subscription