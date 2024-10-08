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
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">name</TableCell>
            <TableCell align="right">imported_quantity</TableCell>
            <TableCell align="right">left_quantity</TableCell>
            <TableCell align="right">expery</TableCell>
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
              <TableCell align="right">{row.med_id}</TableCell>
              <TableCell align="right">{row.imported_quantity}</TableCell>
              <TableCell align="right">{row.left_quantity}</TableCell>
              <TableCell align="right">{row.expery.split('T')[0]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default TransactionTable;