import React, { useEffect, useState, useContext } from 'react';
import { Avatar, Button, Card, Flex, Typography, Grid, Modal ,Spin,Upload} from 'antd';
import { FaEdit, FaTrash,FaUpload } from 'react-icons/fa';
import './MedicineCard.css'
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import Context from '../../context/Context';
import TextField from '@mui/material/TextField';
import Title from 'antd/es/skeleton/Title';



const { useBreakpoint } = Grid;

const MedicineCard = props => {

    const { loading, setLoading, success, error, contextHolder, changeActiveTab ,user} = useContext(Context);

    const screens = useBreakpoint();

const [usage,setUsage]=useState(null)

     const [is_Edit,setIsEdit]=useState(false);
    const isLargeScreen = useMediaQuery({ query: '(min-width: 1200px)' });
    const isMediumScreen = useMediaQuery({ query: '(min-width: 635px)' });
    const isSmallScreen = useMediaQuery({ query: '(max-width: 531px)' });
    const [fileList_card, setFileListCard] = useState([]);

    const handleUploadChangeCard = ({ fileList }) => {
        setFileListCard(fileList);
    };
    let card_gap = 50;
    let card_width=500;
    let card_height=200;
    if (isLargeScreen) {
        card_gap = 50;
        card_width=500;
        card_height=200
    }
    else if (isMediumScreen) {
        card_gap = 150
        card_width=600;

    }
    else if (isSmallScreen) {
        card_gap = 30;
        card_width=300
        card_height=250

    }
    else {
        card_gap = 120;
    }


    const { Text, Title } = Typography;

    const handleDelete = async () => {
        setLoading(true);
        console.log(props.data.name);
        try {
            const result = await axios.delete(process.env.REACT_APP_API_URL+`/medicine?id=${props.data.name}`,{},{ withCredentials: true, });
            console.log(result);
            success("deleted succesfully");
            setLoading(true);
            const med_data = await axios.get(process.env.REACT_APP_API_URL+'/medicine', { name: "" });

            props.setData([...med_data.data]);


        }
        catch (err) {
            console.log(err);
            error("medicine availability is not 0");
        }
        setLoading(false);

    }
    const handleEdit = () => {
        setIsEdit(true);
        setUsage(props.data.useage);
    }
const handleEditUpload=async ()=>{
    setLoading(true);
    if(usage){
    try{
    const form_Data = new FormData();
    console.log(fileList_card);
    fileList_card.forEach(file => {
        form_Data.append('img', file.originFileObj);
    });
    form_Data.append('useage', usage);
    form_Data.append('name', props.data.name);
    
   
      setLoading(true);
      const result=await axios.put(process.env.REACT_APP_API_URL+`/medicine`,form_Data,{ withCredentials: true, })
      console.log(result);
      success("updated successfully");
      setIsEdit(false);
      setFileListCard([]);
      const med_data = await axios.get(process.env.REACT_APP_API_URL+'/medicine', { name: "" });

            props.setData([...med_data.data]);
            setLoading(false);

    }
catch(err)
{
error(err.message)
setLoading(false);
}
    }
    else{
        error("fill required fields");
        setLoading(false);
    }
}
console.log(props.data);

    return (
        <>
        <div >
            {!props.loading ?
                <Card hoverable  style={{height:card_height,width:card_width}}  >
                    <Flex gap={card_gap} justify='space-between' >
                        <Flex gap={15} justify='space-around' >
                            <Avatar shape="square" size={130} icon={<img src={`data:${props.data.img?props.data.img.contentType:null};base64,${props.data.img?props.data.img.data:null}`}
                            />} />
                            <Flex vertical justify='center' style={{maxWidth:200}}>
                                <Title level={3}> {props.data.name}</Title>
                                <Text><b>Available:</b>{" " + props.data.available}</Text>
                                <Text style={{overflowY:"hidden"}}> <b>Usage:</b>{" " + props.data.useage}</Text>
                            </Flex>
                        </Flex>
                        {user?
                        <Flex justify='center' vertical gap={10} className='med-card'>
                            <Button className='bg-warning' style={{ color: 'black' }} onClick={handleEdit}><FaEdit />Edit</Button>
                            <Button className='bg-danger' style={{ color: 'white' }} onClick={handleDelete}><FaTrash />Delete</Button>
                        </Flex>
                        :null
                        }
                    </Flex>
                      {user?
                    <Flex justify='space-around' gap={10} className='mt-3 opt-down'>
                        <Button className='bg-warning' onClick={handleEdit}><FaEdit />Edit</Button>
                        <Button className='bg-danger' onClick={handleDelete}><FaTrash />Delete</Button>
                    </Flex>:null
                    }

                </Card>
                : null
            }
        </div>
        <Modal open={is_Edit} footer={null} onCancel={() => { setIsEdit(false) }}>
                    <Spin tip="Loading...." size='large' spinning={loading}>
                        <h1 className='mt-3'>Update Medicine</h1>
                            <TextField label="usage" variant="outlined" value={usage} onChange={(e) => { setUsage(e.target.value)}} /><br></br><br></br>
                        <Upload
                            multiple
                            listType="picture"
                            beforeUpload={() => false}
                            fileList={fileList_card}
                            onChange={handleUploadChangeCard}
                        >

                            <Button className='mt-1 p-4'><FaUpload /> Upload</Button>
                        </Upload>
                        <Flex justify='end'>
                            <Button type='primary' className='mt-3' onClick={handleEditUpload}>Submit</Button>
                        </Flex>
                    </Spin>
                </Modal>
        </>
    );
};



export default MedicineCard;