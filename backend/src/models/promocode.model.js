import mongoose from "mongoose";

const promocodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountType: { 
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiryDate: {
        type: Date
    }
})

const Promocode = mongoose.model("Promocode", promocodeSchema);
export default Promocode;