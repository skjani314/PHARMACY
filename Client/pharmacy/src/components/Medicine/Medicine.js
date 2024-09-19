import React from 'react';
import { useContext } from "react"
import Context from "../../context/Context"
import { Button, Card, Row,Flex } from 'antd';
import { FaPlus, FaUpload } from 'react-icons/fa';
import MedicineCard from '../Cards/MedicineCard';

const Medicine = props => {

    const { loading, setLoading, success, error, contextHolder } = useContext(Context);



    return (
        <>
            <div>
              <h1 className='p-3'>Medicines</h1>
             <Flex gap={10} justify='end' className='mb-2' wrap>
                <Button ><FaPlus/> Add Medicine</Button>
                <Button className='bg-warning' style={{color:'black'}}><FaUpload /> Upload</Button>
             </Flex>
              <Row>
               <h3 className='p-2'>Recent Medicines </h3>
                <Flex gap="small"  justify='space-evenly' wrap>
                    <MedicineCard />
                    <MedicineCard />
                    <MedicineCard />
                    <MedicineCard />
                    <MedicineCard />
                    <MedicineCard /><MedicineCard />
                    <MedicineCard />
                    <MedicineCard />
                </Flex>
              </Row>
            </div>
        </>
    );
};


export default Medicine;