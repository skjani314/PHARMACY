import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const InventoryChart = props => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (data, index) => {
    setHoveredIndex(index);
  };


  return (
    <ResponsiveContainer width="100%" height={300}>

      <PieChart width={500} height={500} >
      <Pie
        data={data}
        cx={120}
        cy={200}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
        onMouseEnter={(data, index) => handleMouseEnter(data, index)}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={hoveredIndex === index ? 'lightblue' : COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

    </PieChart>
    </ResponsiveContainer>
  );
};



export default InventoryChart;