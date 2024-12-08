
import { Flex, Card, Typography, Col, Row } from 'antd';
import MedicineCard from '../Cards/MedicineCard';
import './Dashboard.css'
import { IoIosPeople } from 'react-icons/io';
import { GrTransaction } from 'react-icons/gr';
import { FaPills, FaSquareFull } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import TransactionTable from '../Tables/TransactionTable';
import ShortageTable from '../Tables/ShortageTable';
import { useContext, useEffect, useState } from 'react';
import Context from '../../context/Context';
import BarGraph from '../Graphs/BarGraph';
import InventoryChart from '../Graphs/InventoryChart';
import axios from 'axios';

const { Text } = Typography;

const Dashboard = () => {



 

  const { Medicine_data } = useContext(Context);
const [data,setData]=useState({total_students:0,benfited_students:0,stock:0,graph_data:[],shortage_list:[],expiring_list:[]}
)

  useEffect(()=>{

const getDta=async ()=>{

try{

const result=await axios.get('/dashboarddata');

setData(result.data)
console.log(result.data)

}
catch(err){
  console.log(err);
}


}


getDta()


  },[])








  return (
    <div className="dashboard-container pt-3">
      <h1>Dashboard</h1>
      <Flex gap={10} wrap justify='space-evenly'>
        <Card hoverable className='p-0'>
          <Flex gap={15}>
            <IoIosPeople size={50} color='blue' />
            <Flex vertical justify='center' gap={5}>
              <Text>
                <b>Benfited Students</b>
              </Text>
              <Text style={{ fontSize: 18 }}>{data.benfited_students}/{data.total_students}</Text>
            </Flex>
          </Flex>
        </Card>
        <Card hoverable className='p-0'>
          <Flex gap={15}>
            <GrTransaction size={50} color='red' />
            <Flex vertical justify='center' gap={5}>
              <Text>
                <b>Transactions</b>
              </Text>
              <Text style={{ fontSize: 20 }}>314 <Text style={{ fontSize: 12 }}>(For This Month)</Text>
              </Text>
            </Flex>
          </Flex>
        </Card>
        <Card hoverable className='p-0'>
          <Flex gap={15}>
            <FaPills size={50} color='green' />
            <Flex vertical justify='center' gap={5}>
              <Text>
                <b>Medicines Available</b>
              </Text>
              <Text style={{ fontSize: 20 }}>{Medicine_data.length} <Text style={{ fontSize: 12 }}>(Varieties)</Text>
              </Text>
            </Flex>
          </Flex>
        </Card>
        <Card hoverable className='px-3'>
          <Flex gap={15}>
            <MdOutlineInventory2 size={50} color='brown' />
            <Flex vertical justify='center' gap={5}>
              <Text>
                <b>Stock Available</b>
              </Text>
              <Text style={{ fontSize: 20 }}>{Number(data.stock.toFixed(2))}%
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>
      <Row className='my-3 '>

        <Col md={{ span: 11 }} className='mx-2'>
          <h2 >Expiring List</h2>
          <TransactionTable dashboard rowsData={data.expiring_list.slice(0,5)} />

        </Col>
        <Col md={{ span: 11 }} className='mx-2 my-3 '>
          <h2>Shortage List</h2>
          <ShortageTable rowsdata={data.shortage_list.slice(0,5)} />
        </Col>

      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col md={{span:12}} sm={{span:24}} xs={{span:24}}>
            <h2>Total Transactions</h2>
            <BarGraph  data={data.graph_data}/>
          </Col>
          <Col md={{span:12}} sm={{span:24}} xs={{span:24}}>
            <h2>Inventory</h2>
            <Flex vertical gap={10}>
            <InventoryChart />
            <Flex wrap gap={10}>
              <Text><FaSquareFull color='#0088FE'/> <b>out of Stock</b></Text>
              <Text><FaSquareFull color='#00C49F'/> <b>Total Product</b></Text>
              <Text><FaSquareFull color='#FFBB28'/> <b>Stock</b></Text>
              <Text><FaSquareFull color='#FF8042'/> <b>Expire</b></Text>
            </Flex>
            </Flex>
          </Col>
      </Row>

    </div>
  );
};


export default Dashboard;