    import mongoose from 'mongoose';


    const StudentSchema=new mongoose.Schema({
        name:{type:String,required:true},
        stu_id:{type:String,required:true,unique:true},
        class_name:{type:String,required:true},
        dorm:String,
    });
    
    const Student=new mongoose.model("students",StudentSchema);

    export default Student;