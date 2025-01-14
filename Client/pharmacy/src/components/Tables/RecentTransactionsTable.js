import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Modal ,Typography,Flex} from 'antd';


const {Text}=Typography;
const RecentTransactionsTable = props => {

  const [Des, setDes] = React.useState({})
  const [isOpen, setModel] = React.useState(false)

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">name</TableCell>
              <TableCell align="center">Reason</TableCell>
              <TableCell align='center'>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rowsData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row._doc.date.split('T')[0]}
                </TableCell>
                <TableCell align="center">{row._doc.stu_id}</TableCell>
                <TableCell align="center">{row.stu_data.name}</TableCell>
                <TableCell align="center">{row._doc.reason}</TableCell>
                <TableCell align='center'><Button type='primary' onClick={()=>{setDes(row);setModel(true)}}>View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Modal open={isOpen} title="Transaction Details"  footer={null} onCancel={()=>setModel(false)}>
       <Flex vertical gap={10} >
{Des.stu_data?
<>
<h3>Stdent details</h3>

<Text><b>ID:</b> {Des.stu_data.stu_id} </Text>
<Text><b>Name:</b> {Des.stu_data.name} </Text>
<Text><b>Class:</b> {Des.stu_data.class_name} </Text>
<Text><b>Dorm:</b> {Des.stu_data.dorm} </Text>
</>
:<h1>No Stdent Data Found</h1>
}<br></br>
{
Des._doc?<>
<h3>Details</h3>
<Text><b>Date & Time:</b> {new Date(Des._doc.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} </Text>
<Text><b>Reason:</b> {Des._doc.reason}</Text>
<h4>Medicines</h4>
{

Des._doc.med_id.map((each)=>(

  <Text><b>{each.med_id} </b>: {each.quantity}</Text>
))

}




</>
:<h1>Something went wrong</h1>




}


       </Flex>
       
      </Modal>

    </>
  );
};



export default RecentTransactionsTable;