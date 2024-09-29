import React, { useEffect, useState, useContext } from 'react';
import { Avatar, Button, Card, Flex, Typography, Grid, Modal ,Spin,Upload} from 'antd';
import { FaEdit, FaTrash,FaUpload } from 'react-icons/fa';
import './MedicineCard.css'
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import Context from '../../context/Context';
import TextField from '@mui/material/TextField';



const { useBreakpoint } = Grid;

const MedicineCard = props => {

    const { loading, setLoading, success, error, contextHolder, changeActiveTab } = useContext(Context);

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

    if (isLargeScreen) {
        card_gap = 50;
    }
    else if (isMediumScreen) {
        card_gap = 200
    }
    else if (isSmallScreen) {
        card_gap = 30;
    }
    else {
        card_gap = 120;
    }


    const { Text, Link } = Typography;

    const handleDelete = async () => {
        setLoading(true);
        console.log(props.data.name);
        try {
            const result = await axios.delete(`/medicine?id=${props.data.name}`);
            console.log(result);
            success("deleted succesfully");
            setLoading(true);
            const med_data = await axios.get('/medicine', { name: "" });

            props.setData([...med_data.data]);
            props.search_result(false);


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
    try{
    const form_Data = new FormData();
    console.log(fileList_card);
    fileList_card.forEach(file => {
        form_Data.append('img', file.originFileObj);
    });
    form_Data.append('useage', usage);
    form_Data.append('name', props.data.name);
    
   
      setLoading(true);
      const result=await axios.put(`/medicine`,form_Data)
      console.log(result);
      success("updated successfully");
      setIsEdit(false);
      setFileListCard([]);
      const med_data = await axios.get('/medicine', { name: "" });

            props.setData([...med_data.data]);
            props.search_result(false);
            setLoading(false);

    }
catch(err)
{
error("something went wrong")
setLoading(false);
}

}

    return (
        <>
        <div >
            {!props.loading ?
                <Card hoverable >
                    <Flex gap={card_gap} justify='space-between'>
                        <Flex gap={15} justify='space-around'>
                            <Avatar shape="square" size={100} icon={<img src={`data:${props.data.img.contentType};base64,${props.data.img.data}`}
                            />} />
                            <Flex vertical justify='center'>
                                <Text className='fs-3'> {props.data.name}</Text>
                                <Text><b>Available:</b>{" " + props.data.available}</Text>
                                <Text> <b>Usage:</b>{" " + props.data.useage}</Text>
                            </Flex>
                        </Flex>
                        <Flex justify='center' vertical gap={10} className='med-card'>
                            <Button className='bg-warning' style={{ color: 'black' }} onClick={handleEdit}><FaEdit />Edit</Button>
                            <Button className='bg-danger' style={{ color: 'white' }} onClick={handleDelete}><FaTrash />Delete</Button>
                        </Flex>
                    </Flex>

                    <Flex justify='space-around' gap={10} className='mt-3 opt-down'>
                        <Button className='bg-warning' onClick={handleEdit}><FaEdit />Edit</Button>
                        <Button className='bg-danger' onClick={handleDelete}><FaTrash />Delete</Button>
                    </Flex>

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