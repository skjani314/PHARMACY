import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const Issuetable = props => {
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
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.date.split('T')[0]}
              </TableCell>
              <TableCell align="center">{props.student.stu_id}</TableCell>
              <TableCell align="center">{props.student.name}</TableCell>
              <TableCell align="center">{row.med_id}</TableCell>
              <TableCell align="center">{row.quantity}</TableCell>
              <TableCell align="center">{row.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    );
};



export default Issuetable;