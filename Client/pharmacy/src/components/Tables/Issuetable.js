import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Flex,Card, Typography, Modal } from 'antd';


const { Text } = Typography;
const Issuetable = props => {

const [Des,setDes]=React.useState({})
const [isModel,setModel]=React.useState(false);

  return (
    <>
      <Card title='Stdent Details'>
        <Flex vertical gap={10}>
        <Text><b>ID:</b> {props.student.stu_id}</Text>
        <Text><b>Name:</b> {props.student.name}</Text>
        <Text><b>Class:</b> {props.student.class_name}</Text>
        <Text><b>Dorm:</b> {props.student.dorm}</Text>
        </Flex>
      </Card>
      <br></br>
           <br></br>
           <h1>Transactions</h1>
      <TableContainer component={Paper}   sx={{
    maxWidth: 500, 
  }}>
        <Table sx={{ maxWidth:500 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">Reason</TableCell>
              <TableCell align="center">View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rowsData.map((row,index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.date.split('T')[0]}
                </TableCell>
                <TableCell align="center">{row.reason}</TableCell>
                <TableCell align="center"><Button type='primary' onClick={()=>{setDes(row);setModel(true)}}  >View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal title="Transaction Details"  open={isModel} footer={null} onCancel={()=>setModel(false)}>
           <Flex vertical gap={10}>
           <Text><b>Date & Time:</b> {new Date(Des.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} </Text>
           <Text><b>Reason:</b> {Des.reason}</Text>
<h4>Medicines</h4>
{

Des.med_id &&Des.med_id.map((each)=>(

  <Text><b>{each.med_id} </b>: {each.quantity}</Text>
))

}

           </Flex>

      </Modal>
    </>
  );
};



export default Issuetable;