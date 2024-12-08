import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const BarGraph = props => {


const data=props.data.map((each)=>{

  const mon=["null","JAN","FEB","MAR","APR","MAY",'JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const {_id,count,totalQuantity}=each;

  return {month:mon[_id],Transactions:count,Medicine:totalQuantity}

})



console.log(data);





    return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Transactions" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            <Bar dataKey="Medicine" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          </BarChart>
          </ResponsiveContainer>
      );
};



export default BarGraph;