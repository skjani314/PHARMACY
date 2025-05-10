import React from 'react';
import { useContext, useEffect,useState } from "react"
import Context from "../../context/Context"
import { Button, Row, Flex, Modal, Upload, Spin,Card,Dropdown,Typography,Space } from 'antd';
import { FaPlus, FaUpload } from 'react-icons/fa';
import MedicineCard from '../Cards/MedicineCard';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import xldemo from './images/medicine.png'
import { MdOutlineClear } from "react-icons/md";
import { DownOutlined,  } from '@ant-design/icons';



const {Text}=Typography;
const Medicine = props => {

    const { loading, setLoading, success, error, contextHolder, changeActiveTab ,Medicine_data,setMedData,user,setUser} = useContext(Context);

    const [med_form, setMedForm] = useState({ bulk: false, single: false });
    const [fileList, setFileList] = useState([]);
    const [formdata, setFormData] = useState({ name: '', usage: '',category:'Select a category' });
    const [Med_dummy_data,setMedDummyData]=useState([]);
  const [filter,setFilter]=useState("Select a category")

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList.reverse());
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
    }, [Medicine_data,props.param,user])



const handleCategoryChange=(key)=>{

const filterdata=Medicine_data.filter(each=>each.category==key)
setFilter(key)
setMedDummyData(filterdata);
}


    const handleFormUpload = async () => {



if((formdata.name && formdata.usage && formdata.category!="Select a category") || med_form.bulk){


        setLoading(true);
        const form_Data = new FormData();
        fileList.forEach(file => {
            form_Data.append('img', file.originFileObj);
        });

        if(!med_form.bulk){
        form_Data.append('name', formdata.name);
        form_Data.append('useage', formdata.usage);
        form_Data.append('category',formdata.category);
    }

        try {
            const result = await axios.post(process.env.REACT_APP_API_URL+'/api/medicine/add-medicine', form_Data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 
          "Content-Type": "application/json",
        }});
            console.log(result);
            setLoading(false);
               if(!med_form.bulk){
            setMedForm((prev) => ({ ...prev, single: false }));
               }else{
                setMedForm((prev) => ({ ...prev, bulk: false }));

               }
            success("Medicine Added Succesfully");
            setUser(prev=>({...prev}));
            setFileList([]);
            
            setLoading(true);
            const med_data = await axios.get(process.env.REACT_APP_API_URL+'/api/medicine/get-medicine', { name: "" });
      
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
            <Card style={{width:"100%",minHeight:"100vh",background:'whitesmoke'}}>
                <h1 className='p-3'>Medicines</h1>
                {user?
                <Flex gap={10} justify='end' className='mb-2' wrap>
                    <Button className='m' onClick={() => { setMedForm((prev) => ({ ...prev, single: true })) }} ><FaPlus /> Add Medicine</Button>
                    <Button className='m' onClick={() => { setMedForm((prev) => ({ ...prev, bulk: true })) }}><FaUpload /> Upload</Button>
                </Flex>:null
}
                <>
                
                <h3 className='p-2'>{!props.param?"Recent Medicines":"search result for "+props.param }</h3><br></br>
                {!props.param?<>
                <Text style={{fontSize:15}}><b>Filter:</b>   </Text>
                <Dropdown menu={{ items: [{ key: "Tablets", label: "Tablets" }, { key: "Syrups", label: "Syrups" }, { key: "Injections", label: "Injections" },{key:"Ointments",label:"Ointments"}, { key: "Others", label: "Others" }], onClick: ({ key }) => { handleCategoryChange(key) } }}>
                            <Button>
                                <Space>
                                    {
                                        filter == "Select a category" ?
                                            <Text >{filter}
                                                <DownOutlined /></Text>
                                            :
                                            <Text >{filter}
                                                <MdOutlineClear className="mx-2" onClick={() => {setFilter("Select a category"); setMedDummyData(Medicine_data)}} />
                                            </Text>
                                    }
                                </Space>
                            </Button>
                        </Dropdown>
                        </>
                        :null
}
                
                <Row>
                    {!loading ?
                        <Flex gap="small" justify='space-evenly'  wrap>
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
                        <Flex justify='space-evenly' vertical gap={10} align="start" >
                            <TextField label="name" variant="outlined" value={formdata.name} onChange={(e) => { setFormData((prev) => ({ ...prev, name: e.target.value })) }} />
                            <TextField label="usage" variant="outlined" value={formdata.usage} onChange={(e) => { setFormData((prev) => ({ ...prev, usage: e.target.value })) }} />
                            <Dropdown menu={{ items: [{ key: "Tablets", label: "Tablets" }, { key: "Syrups", label: "Syrups" }, { key: "Injections", label: "Injections" },{key:"Ointments",label:"Ointments"}, { key: "Others", label: "Others" }], onClick: ({ key }) => { setFormData(prev => ({ ...prev, category: key })) } }}>
                            <Button>
                                <Space>
                                    {
                                        formdata.category == "Select a category" ?
                                            <Text disabled>{formdata.category}
                                                <DownOutlined /></Text>
                                            :
                                            <Text >{formdata.category}
                                                <MdOutlineClear className="mx-2" onClick={() => setFormData(prev => ({ ...prev, category: "Select a category" }))} />
                                            </Text>
                                    }
                                </Space>
                            </Button>
                        </Dropdown>

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
                    <h3>xlsheet Structure</h3>
                    <img className='img-fluid' alt='xlsheet structure' src={xldemo}></img>
                    <p> first upload xlsheet then upload images of medicines in order entered in xlsheet</p>
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


            </Card>
        </>
    );
};


export default Medicine;