import fs from 'fs';
import xlsx from 'xlsx';
import Student from '../modals/Student.js';
import { promise } from 'bcrypt/promises.js';


export const AddStudent = async (req, res, next) => {


  try {


    const files = req.files;
    const { stu_id, name, class_name, dorm } = req.body;

    if (files.length<=0) {

      if (stu_id) {
        const result = await Student.create({ stu_id, name, class_name, dorm });
        return res.json(result);
      }
      else {
        next(new Error("no file or data found to upload"));
      }
    } else {
      const workbook = xlsx.readFile(files[0].path);

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      fs.unlinkSync(files[0].path);
      const response = await Student.insertMany(data);
      res.json(response);
    }
  }
  catch (err) {
    next(err);
  }



}


export const GetStudent = async (req, res, next) => {

  try {
    const { stu_id } = req.query;

    const response = await Student.find({ stu_id: { $regex: new RegExp(stu_id, 'i') } });
    res.json(response);
  }
  catch (err) {
    next(err);
  }
}

export const DeleteStudent = async (req, res, next) => {

  try {

    const { batch, stu_id, flag } = req.query;
    if (flag == 'true') {

      const result = await Student.deleteOne({ stu_id });
      await Transactions.deleteMany({ stu_id });

      res.json(result);

    }
    else {
      if (!batch || batch.length < 4 || batch[0] != 'r' || batch[1] != 'o') next(new Error("batch is empty"));
      else {

        const studentsToDelete = await Student.find({ stu_id: { $regex: new RegExp(`^.*${batch}.*$`, 'i') } });
        console.log(batch)

        const studentIds = studentsToDelete.map(student => student._id);
        const stu_ro_ids = studentsToDelete.map(student => student.stu_id);
        const trans_res = await Transactions.deleteMany({ stu_id: { $in: stu_ro_ids } });

        const stu_res = await Student.deleteMany({ _id: { $in: studentIds } });
        res.json({ stu_res, trans_res });
      }
    }
  }
  catch (err) {
    next(err);
  }

}