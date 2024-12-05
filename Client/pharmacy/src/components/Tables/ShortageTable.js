import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar,Typography } from 'antd';


const { Text } = Typography;

const ShortageTable = props => {


    return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: props.dashboard?"100%":650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
              <TableCell >Image</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Available</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.rowsdata.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  
                  <TableCell align="left"> <Avatar shape="square" size={50} icon={<img src={`data:${row.img.contentType};base64,${row.img.data}`}
                            />} /></TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.available}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
};



export default ShortageTable;