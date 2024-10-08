import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const RecentTransactionsTable = props => {


    return (
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">name</TableCell>
            <TableCell align="center">medicine</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Reason</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rowsData.map((row) => (
            <TableRow
              key={row._doc._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row._doc.date.split('T')[0]}
              </TableCell>
              <TableCell align="center">{row._doc.stu_id}</TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row._doc.med_id}</TableCell>
              <TableCell align="center">{row._doc.quantity}</TableCell>
              <TableCell align="center">{row._doc.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    );
};



export default RecentTransactionsTable;