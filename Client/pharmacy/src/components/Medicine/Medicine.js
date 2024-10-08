import React from 'react';
import { useContext, useEffect,useState } from "react"
import Context from "../../context/Context"
import { Button, Row, Flex, Modal, Upload, Spin } from 'antd';
import { FaPlus, FaUpload } from 'react-icons/fa';
import MedicineCard from '../Cards/MedicineCard';
import axios from 'axios';
import TextField from '@mui/material/TextField';


const Medicine = props => {

    const { loading, setLoading, success, error, contextHolder, changeActiveTab ,Medicine_data,setMedData} = useContext(Context);

    const [med_form, setMedForm] = useState({ bulk: false, single: false });
    const [fileList, setFileList] = useState([]);
    const [formdata, setFormData] = useState({ name: '', usage: '' });
    const [Med_dummy_data,setMedDummyData]=useState([]);
  

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };




    useEffect(() => {

        if(props.param==null){
            setMedDummyData(Medicine_data);
        }
        else{
            const result=Medicine_data.filter((each)=>(
                each.name.toLowerCase().includes(props.param.toLowerCase()) ||
                each.useage.toLowerCase().includes(props.param.toLowerCase())
            )
            )
            setMedDummyData(result);
        }
    
        changeActiveTab('MEDICINE');
    }, [Medicine_data,props.param])



    const handleFormUpload = async () => {



if(formdata.name && formdata.usage){


        setLoading(true);
        const form_Data = new FormData();
        fileList.forEach(file => {
            form_Data.append('img', file.originFileObj);
        });

        if(!med_form.bulk){
        form_Data.append('name', formdata.name);
        form_Data.append('useage', formdata.usage);
    }

        try {
            console.log(form_Data);
            const result = await axios.post('/medicine', form_Data);
            console.log(result);
            setLoading(false);
               if(!med_form.bulk){
            setMedForm((prev) => ({ ...prev, single: false }));
               }else{
                setMedForm((prev) => ({ ...prev, bulk: false }));

               }
            success("Medicine Added Succesfully");
            setFileList([]);
            setLoading(true);
            const med_data = await axios.get('/medicine', { name: "" });
      
                  setMedData([...med_data.data]);
                  setLoading(false);

        }
        catch (err) {
            console.log(err);
            error("something went wrong");
            setLoading(false);
        }
    }
    else{
        error("fill Required Fields");
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
                <>
                <h3 className='p-2'>{!props.param?"Recent Medicines":"search result for "+props.param }</h3><br></br>
                <Row>
                    {!loading ?
                        <Flex gap="small" justify='space-evenly' wrap>
                            {
                                Med_dummy_data.map((each) => {
                                    return <MedicineCard key={each.id} data={each} setData={setMedData} />
                                })
                            }
                        </Flex> : null

                    }
                </Row>
                </>
            
                <Modal open={med_form.single} footer={null} onCancel={() => { setMedForm((prev) => ({ ...prev, single: false })) }}>
                    <Spin tip="Loading...." size='large' spinning={loading}>
                        <h1 className='mt-3'>Add New Medicine</h1>
                        <Flex justify='space-evenly' gap={10} align="end" >
                            <TextField label="name" variant="outlined" value={formdata.name} onChange={(e) => { setFormData((prev) => ({ ...prev, name: e.target.value })) }} />
                            <TextField label="usage" variant="outlined" value={formdata.usage} onChange={(e) => { setFormData((prev) => ({ ...prev, usage: e.target.value })) }} />
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
                    </Spin>
                </Modal>

                <Modal open={med_form.bulk} footer={null} onCancel={() => { setMedForm((prev) => ({ ...prev, bulk: false })) }}>
                <Spin tip="Loading...." size='large' spinning={loading}>

                    <h1>Add Medicines In Bulk</h1>
                    <Upload
                        multiple
                        listType="picture"
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={handleUploadChange}
                    >

                        <Button className='mt-1 p-4'><FaUpload /> Upload Data</Button>
                    </Upload>
                   <Flex justify='end'>
                    <Button className='mt-1 p-4' onClick={handleFormUpload}>Submit</Button>
                    </Flex>
                    </Spin>
                </Modal>


            </div>
        </>
    );
};


export default Medicine;