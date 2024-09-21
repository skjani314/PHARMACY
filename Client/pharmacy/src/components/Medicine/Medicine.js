import React, { useEffect, useState } from 'react';
import { useContext } from "react"
import Context from "../../context/Context"
import { Button, Row, Flex, Modal, Upload ,Form} from 'antd';
import { FaPlus, FaUpload } from 'react-icons/fa';
import MedicineCard from '../Cards/MedicineCard';
import axios from 'axios';
import TextField from '@mui/material/TextField';


const Medicine = props => {

    const { loading, setLoading, success, error, contextHolder } = useContext(Context);

    const [data, setData] = useState([]);
    const [med_form, setMedForm] = useState({ bulk: false, single: false });
    const [fileList, setFileList] = useState([]);
    const [formdata,setFormData]=useState({name:'',usage:''});

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };


    useEffect(() => {


        const med_fun = async () => {
            try {
                const med_data = await axios.get('/medicine', { name: "" });

                setData([...med_data.data]);

            }
            catch (err) {
                console.log(err);
            }

        }


        med_fun();


    }, [])


const handleFormUpload=async ()=>{


    const form_Data = new FormData();
    fileList.forEach(file => {
      form_Data.append('img', file.originFileObj);
    });

    // Add extra data from form
    form_Data.append('name', formdata.name);
    form_Data.append('useage', formdata.usage);

    try{
const result=await axios.post('/medicine',form_Data);
console.log(result);
  
    }
catch(err)
{
    console.log(err);
}






}



    return (
        <>
            <div>
                <h1 className='p-3'>Medicines</h1>
                <Flex gap={10} justify='end' className='mb-2' wrap>
                    <Button className='m' onClick={() => { setMedForm((prev) => ({ ...prev, single: true })) }} ><FaPlus /> Add Medicine</Button>
                    <Button className='m' onClick={() => { setMedForm((prev) => ({ ...prev, bulk: true })) }}><FaUpload /> Upload</Button>
                </Flex>
                <Row>
                    <h3 className='p-2'>Recent Medicines </h3>
                    <Flex gap="small" justify='space-evenly' wrap>
                        {
                            data.map((each) => {
                                return <MedicineCard data={each} />
                            })
                        }
                    </Flex>
                </Row>

                <Modal visible={med_form.single} footer={null} onCancel={() => { setMedForm((prev) => ({ ...prev, single: false })) }}>
                    <h1 className='mt-3'>Add New Medicine</h1>
                    <Flex justify='space-evenly' gap={10} align="end" >
                        <TextField label="name" variant="outlined" value={formdata.name} onChange={(e)=>{setFormData((prev)=>({...prev,name:e.target.value}))}} />
                        <TextField label="usage" variant="outlined"  value={formdata.usage} onChange={(e)=>{setFormData((prev)=>({...prev,usage:e.target.value}))}} />
                    </Flex>
                    <Upload
                            multiple
                            listType="picture"
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={handleUploadChange}
                        >                
                        
                         <Button className='mt-1 p-4'><FaUpload /> Upload</Button>
                        </Upload>
                        <Flex justify='end'>
                        <Button type='primary' className='mt-3' onClick={handleFormUpload}>Submit</Button>
                        </Flex>
                </Modal>
            </div>
        </>
    );
};


export default Medicine;