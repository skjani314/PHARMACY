 import Stock from "../modals/Stock.js";
import fs from 'fs';
import xlsx from 'xlsx';
import { promise } from 'bcrypt/promises.js';
import Medicine from "../modals/Medicine.js";


 export const addStock = async (req, res, next) => {


    try {
  
      if (req.files.length>0) {
        const workbook = xlsx.readFile(req.files[0].path, { cellDates: true });
  
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        fs.unlinkSync(req.files[0].path);
      
        const st_data=await Promise.all(
          data.map(async (each)=>{
  
            const med_data=await Medicine.findOne({name:each.med_id})
            
  
            const total_quantity = parseInt(each.imported_quantity, 10) + med_data.available;
            console.log(total_quantity);
      
            const up_result = await Medicine.findByIdAndUpdate(med_data._id, { available: total_quantity }, { new: true });
  
            return {...each,left_quantity:each.imported_quantity}
  
  
          })
        )
  
        const response = await Stock.insertMany(st_data);
        res.json(response);
  
      }
      else {
        const { med_id, imported_quantity, expery } = req.body;
        console.log(req.body);
  
        const date = new Date(expery);
        date.setDate(date.getDate()+1);
        const result = await Stock.create({ med_id, imported_quantity, left_quantity: imported_quantity, expery: date.toLocaleDateString() });
  
  
        const med_data = await Medicine.findOne({name:med_id});
        const total_quantity = parseInt(imported_quantity, 10) + med_data.available;
        console.log(total_quantity);
  
        const up_result = await Medicine.findOneAndUpdate({name:med_id}, { available: total_quantity }, { new: true });
        res.json(up_result);
      }
  
    }
    catch (err) {
      next(err);
    }
  
  }


 export const getStock= async (req, res, next) => {

    try {
      const { med_id, start, end, flag } = req.query;
      if (flag == 'true') {
        const result = await Stock.find({ med_id }).sort({ date: 1 });
        res.json(result);
      }
      else if(start!=null){
        const startDate = new Date(start);
        const endDate = new Date(end + 'T23:59:59.999Z');
        console.log(endDate);
        const result = await Stock.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 })
        res.json(result);
      }
      else{
        const result=await Stock.find({med_id:{ $regex: new RegExp("", 'i') }}).sort({date:-1}).limit(30);
        res.json(result);
        console.log(result)
  
      }
  
  
    }
    catch (err) {
      next(err);
    }
  
  }