import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const  TransactionTable=(props)=>{


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: props.dashboard?"100%":650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="left">name</TableCell>
            <TableCell align="left">imported_quantity</TableCell>
            <TableCell align="left">left_quantity</TableCell>
            <TableCell align="left">expery</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rowsData.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.date.split('T')[0]}
              </TableCell>
              <TableCell align="left">{row.med_id}</TableCell>
              <TableCell align="center">{row.imported_quantity}</TableCell>
              <TableCell align="center">{row.left_quantity}</TableCell>
              <TableCell align="left">{row.expery.split('T')[0]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default TransactionTable;