import mongoose from 'mongoose';


const MedicineSchema = new mongoose.Schema(
    {
        name: {type:String,required:true}, 
        available:{type:Number}, 
        category:{type:String,required:true},
        useage: String, 
        img: {
            data: Buffer,
            contentType: String,
        },
    });

MedicineSchema.index({name:'text',useage:'text'});

const Medicine = new mongoose.model("medicine", MedicineSchema);

export default Medicine;