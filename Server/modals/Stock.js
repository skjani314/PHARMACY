import mongoose from 'mongoose';


const StockSchema = new mongoose.Schema(
    {
        date: { type: Date, default: Date.now},
        med_id: { type: String, required: true },
        imported_quantity: { type: Number, required: true },
        left_quantity: { type: Number, required: true },
        expery: { type: Date, required: true }

    });


const Stock = new mongoose.model("stock", StockSchema);

export default Stock;