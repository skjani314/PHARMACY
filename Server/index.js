import { scheduleJob } from 'node-schedule';
import path from 'path';
import 'dotenv/config'
import ConnectDb from './config/ConnectDb.js';
import app from './app.js';
import AuthRoutes from './routes/AuthRoutes.js';
import { authenticate } from './middlewares/AdminVerify.js';
import MedicineRoutes from './routes/MedicineRoutes.js';
import StockRoutes from './routes/StockRoutes.js';
import TransactionRoutes from './routes/TransactionRoutes.js';
import StudentRoutes from './routes/StudentRoutes.js';

ConnectDb();

app.use("/api/auth",AuthRoutes); 
app.use('/api/medicine', MedicineRoutes);
app.use("/api/stock",authenticate, StockRoutes);
app.use("/api/student",authenticate, StudentRoutes);
app.use("/api/transaction", authenticate, TransactionRoutes);


app.get('/', (req, res) => {

res.send("server is running");

});

async function updateMedicineStock() {
  const currentDate = new Date();

  try {
      const expiredMedicines = await Stock.find({ expery: { $lt: currentDate } });
      for (const expiredMedicine of expiredMedicines) {
          const medicine = await Medicine.findOne( {name:expiredMedicine.med_id} );
          console.log(medicine)
          if (medicine) {
              medicine.available -= expiredMedicine.left_quantity;
              if(medicine.available<0)medicine.available=0;
             let x = await medicine.save();
             console.log(x);
          }
      }
  } catch (error) {
      console.error('Error updating medicine stock:', error);
  }
}


setInterval(updateMedicineStock, 86400000);


app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({ error: err });
});



app.listen(process.env.PORT, () => { console.log("server is running") });

