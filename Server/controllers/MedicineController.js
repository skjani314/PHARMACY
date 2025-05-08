import Medicine from '../models/Medicine.js';


export const getMedicines = async (req, res, next) => {

    try {
      const { name } = req.query;
  
      const result = await Medicine.find({ name: { $regex: new RegExp(name, 'i') } });
  
      const data=result.map((each)=>({
        name:each.name,
        available:each.available,
        useage:each.useage,
        img:{
          data: each.img.data.toString('base64'),
          contentType: each.img.contentType,
        },
        id:each._id,
        category:each.category
      }))
      if(result.length>0){
  res.set('Content-Type', result[0].img.contentType);}
      res.json(data);
    }
    catch (err) {
      next(err);
    }
  
  
  }


export const AddMedicine =  async (req, res, next) => {


    try {
  
      const { name, useage,category } = req.body;
  
  if(name && useage && category!="Select a category"){
      await Medicine.create({ name, available: 0, useage, category,img: { data: fs.readFileSync(req.files[0].path), contentType: req.files[0].mimetype } })
      console.log("medicine added");
      res.status(200).send("medicine added succesfully");
      fs.unlinkSync(req.files[0].path);
    }
  else{
    const workbook = xlsx.readFile(req.files[0].path);
  
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    let i=1;
    data.forEach((each)=>{
      each.available=0;
      each.img={ data: fs.readFileSync(req.files[i].path), contentType: req.files[i].mimetype }
      i++;
    })
  
  
    for(i=0;i<req.files.length;i++){ 
      if(req.files[i])
      fs.unlinkSync(req.files[i].path);
    
    }
  
  const bulk_response=await Medicine.insertMany(data);
  console.log(bulk_response);
  
  res.json(bulk_response);
  
  }
    }
    catch (err) {
      next(err);
    }
  
  
  
  } 


export const deleteMedicine = async (req, res, next) => {

    try {
  
      const { id } = req.query;
      console.log(req.query)
      const data=await Medicine.findOne({name:id});
      console.log(data);
      if(data.available===0){
      const result = await Medicine.deleteOne({name:id});
  
      if (result) {
        res.status(200).json({ message: 'Record deleted successfully', data: result });
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    }
      else{
        next(new Error('Available should be 0'))
      }
    }
    catch (err) {
      next(err);
    }
  
  
  }  


  export const updateMedicine = async (req,res,next)=>{

    const {useage,name}=req.body;
    
    if(req.files.length>0 && useage!=null){
    await Medicine.findOneAndUpdate({name},{useage, img: { data: fs.readFileSync(req.files[0].path), contentType: req.files[0].mimetype } })
    fs.unlinkSync(req.files[0].path);
    
    }
    else if(useage!=null){
      await Medicine.findOneAndUpdate({name},{useage})
    
    }
    else if(req.files.length>0){
      await Medicine.findOneAndUpdate({name},{ img: { data: fs.readFileSync(req.files[0].path), contentType: req.files[0].mimetype } })
      fs.unlinkSync(req.files[0].path);
    
    }
    
    console.log("medicine updated");
    res.status(200).send("medicine updated succesfully");
    
    
    }