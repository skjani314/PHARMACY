
import { Flex, Card, Typography, Col, Row, Modal } from 'antd';
import { IoIosArrowDroprightCircle } from "react-icons/io";
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
import Column from 'antd/es/table/Column';
import Search from 'antd/es/transfer/search';

const { Text } = Typography;

const Dashboard = () => {





  const { Medicine_data } = useContext(Context);
  const [see_all, setSeeAll] = useState(null);
  const [data, setData] = useState({ total_students: 0, benfited_students: 0, stock: 0, graph_data: [], shortage_list: [], expiring_list: [], daily_count: 0 ,inventory:[{_id:'null',totalAvailable:0},{_id:'null',totalAvailable:0},{_id:'null',totalAvailable:0},{_id:'null',totalAvailable:0},{_id:'null',totalAvailable:0},]}
  )

  useEffect(() => {

    const getDta = async () => {

      try {

        const result = await axios.get(process.env.REACT_APP_API_URL+'/api/auth/dashboarddata',{ withCredentials: true, });
        console.log(result)

        setData({ ...result.data})

      }
      catch (err) {
        console.log(err);
      }


    }
    getDta()



  }, [])








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
              <Text style={{ fontSize: 20 }}> {data.daily_count}  <Text style={{ fontSize: 12 }}>(Today)</Text>
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

        <Col md={{ span: 11 }} className='mx-2 my-3'>
          <Flex justify='space-between'>
            <h2 >Expiring List</h2>
            <IoIosArrowDroprightCircle size={25} color='blue' onClick={() => setSeeAll("expery")} />

          </Flex>
          <TransactionTable dashboard rowsData={data.expiring_list.slice(0, 5)} />
          {
            !data.expiring_list.length > 0 ?
              <div style={{ minHeight: 300, width: "100%" }} className='mt-5' >
                <h1 className='text-center'>
                  No Expiring Items are There
                </h1>
              </div>

              : null
          }
        </Col>
        <Col md={{ span: 11 }} className='mx-2 my-3 '>
          <Flex justify='space-between'>
            <h2>Shortage List</h2>
            <IoIosArrowDroprightCircle size={25} color='blue' onClick={() => setSeeAll("shortage")} />

          </Flex>
          <ShortageTable rowsdata={data.shortage_list.slice(0, 5)} />
          {
            !data.shortage_list.length > 0 ?
              <div style={{ minHeight: 300, width: "100%" }} className='mt-5' >
                <h1 className='text-center'>
                  No medicines are in Shortage
                </h1>
              </div>

              : null
          }
        </Col>

      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
          <h2>Total Transactions</h2>

          <BarGraph data={data.graph_data} />
        </Col>
        <Col md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
          <h2>Inventory</h2>

          <Flex vertical gap={10}  >
            <InventoryChart data={data.inventory} />
            <Flex wrap gap={10}>
              <Text><FaSquareFull color='#FF5733' /> <b>{data.inventory[0]._id}</b></Text>
              <Text><FaSquareFull color='#33C1FF' /> <b>{data.inventory[1]._id}</b></Text>
              <Text><FaSquareFull color='#FFC733' /> <b>{data.inventory[2]._id}</b></Text>
              <Text><FaSquareFull color='#33FF57' /> <b>{data.inventory[3]._id}</b></Text>
              <Text><FaSquareFull color='#A833FF' /> <b>{data.inventory[4]._id}</b></Text>

            </Flex>
          </Flex>
        </Col>
      </Row>
      <Modal open={see_all} footer={null} onCancel={() => setSeeAll(null)} >
        <div className='p-2 mt-4'>
          {
            see_all == 'expery' ? <>
              <h1>Expiring List</h1>
              <TransactionTable dashboard rowsData={data.expiring_list} /></>
              : <> <h1>Shortage List</h1><ShortageTable rowsdata={data.shortage_list} /></>

          }
        </div>
      </Modal>
    </div>
  );
};


export default Dashboard;