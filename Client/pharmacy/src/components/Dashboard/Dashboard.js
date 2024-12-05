
import { Flex, Card ,Typography,Col,Row} from 'antd';
import MedicineCard from '../Cards/MedicineCard';
import './Dashboard.css'
import { IoIosPeople } from 'react-icons/io';
import { GrTransaction } from 'react-icons/gr';
import { FaPills } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import TransactionTable from '../Tables/TransactionTable';
import ShortageTable from '../Tables/ShortageTable';
import { useContext } from 'react';
import Context from '../../context/Context';

const {Text} =Typography;

const Dashboard = () => {



const rowsData=[
    {
        _id: ('670d560c903c9f1417ce4882'),
        date: "2024-10-14T16:16:50.637Z",
        med_id: 'Aspirin',
        imported_quantity: 20,
        left_quantity: 20,
        expery: "2026-10-10T18:29:50.000Z",
        __v: 0
      },
      {
        _id: ('670d560c903c9f1417ce4883'),
        date: "2024-10-14T16:16:50.637Z",
        med_id: 'Cetirizine',
        imported_quantity: 15,
        left_quantity: 0,
        expery: "2027-10-18T18:29:50.000Z",
        __v: 0
      },
      {
        _id: ('670d560c903c9f1417ce4884'),
        date: "2024-10-14T16:16:50.637Z",
        med_id: 'Omeprazole',
        imported_quantity: 18,
        left_quantity: 18,
        expery: "2025-10-19T18:29:50.000Z",
        __v: 0
      },
      {
        _id: ('670d560c903c9f1417ce4885'),
        date: "2024-10-14T16:16:50.637Z",
        med_id: 'Furosemide',
        imported_quantity: 19,
        left_quantity: 19,
        expery: "2028-10-11T18:29:50.000Z",
        __v: 0
      },
      {
        _id: ('670d5b6d903c9f1417ce4938'),
        date: "2024-10-14T16:16:50.637Z",
        med_id: 'Paracetamol ',
        imported_quantity: 10,
        left_quantity: 4,
        expery: "2025-12-12T18:30:00.000Z",
        __v: 0
      },
      {
        _id: ('670d5c15903c9f1417ce4954'),
        date: "2024-10-14T16:16:50.637Z",
        med_id: 'Paracetamol ',
        imported_quantity: 10,
        left_quantity: 0,
        expery: "2024-12-10T18:30:00.000Z",
        __v: 0
      }
]

const {Medicine_data}=useContext(Context);


    return (
        <div className="dashboard-container pt-3">
            <h1>Dashboard</h1>
            <Flex gap={10} wrap justify='space-evenly'>
            <Card hoverable  className='p-0'>
                <Flex gap={15}>
                    <IoIosPeople size={50} color='blue' />
                    <Flex vertical justify='center' gap={5}>
                    <Text>
                      <b>Benfited Students</b>
                    </Text>
                    <Text style={{fontSize:18}}>500/6000</Text>
                    </Flex>
                </Flex>
            </Card>
            <Card hoverable   className='p-0'>
                <Flex gap={15}>
                    <GrTransaction size={50} color='red' />
                    <Flex vertical justify='center' gap={5}>
                    <Text>
                      <b>Transactions</b>
                    </Text>
                    <Text style={{fontSize:20}}>314 <Text style={{fontSize:12}}>(For This Month)</Text>
                    </Text>
                    </Flex>
                </Flex>
            </Card>
            <Card hoverable   className='p-0'>
                <Flex gap={15}>
                    <FaPills size={50} color='green' />
                    <Flex vertical justify='center' gap={5}>
                    <Text>
                      <b>Medicines Available</b>
                    </Text>
                    <Text style={{fontSize:20}}>56 <Text style={{fontSize:12}}>(Varieties)</Text>
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
                    <Text style={{fontSize:20}}>86%  
                    </Text>
                    </Flex>
                </Flex>
            </Card>
            </Flex>
<Row className='my-3 '>

<Col md={{span:11}} className='mx-2'>
<h2 >Expiring List</h2>
<TransactionTable  dashboard rowsData={rowsData} />

</Col>
<Col md={{span:11}} className='mx-2'>
<h2>Shortage List</h2>
<ShortageTable dashboard rowsdata={Medicine_data}/>
</Col>

</Row>



        </div>
    );
};


export default Dashboard;