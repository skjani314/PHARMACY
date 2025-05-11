import React from 'react';
import { useEffect, useContext, useState } from 'react';
import Context from '../../context/Context';
import { Button, Row, Flex, Modal, Upload, Spin, DatePicker, Avatar, Typography } from 'antd';
import { FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Issuetable from '../Tables/Issuetable';
import xlDemo from './student.png';

const Student = props => {
    const [student_form, setStudentForm] = useState({ bulk: false, single: false });
    const { loading, setLoading, success, error, contextHolder, changeActiveTab, Medicine_data } = useContext(Context);
    const [fileList, setFileList] = useState([]);
    const [formdata, setFormData] = useState({ stu_id: '', name: '', class_name: '', dorm: '' });
    const [deleteForm,setDeleteForm]=useState({batch:'',flag:false});


    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };
    useEffect(() => {
        changeActiveTab('STUDENT');
    }, [])

    const handleFormUpload = async () => {

        setLoading(true);

        const form_Data = new FormData();
        fileList.forEach(file => {
            form_Data.append('img', file.originFileObj);
        });

        if (!student_form.bulk) {
            form_Data.append('stu_id', formdata.stu_id);
            form_Data.append('name', formdata.name);
            form_Data.append('class_name', formdata.class_name);
            form_Data.append('dorm', formdata.dorm);
        }
        try {


            const result = await axios.post(process.env.REACT_APP_API_URL+'/api/student/add-student', form_Data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 
          "Content-Type": "multipart/form-data",
        }});
            console.log(result);
            success("Student Added Successfully");
            setFormData((prev) => ({ stu_id: '', name: '', class_name: '', dorm: '' }))
            setFileList([]);
            setStudentForm((prev) => ({ bulk: false, single: false }))
        }
        catch (err) {
            error("something went wrong");
        }
        setLoading(false)





    }
const handleDelete=async ()=>{

 setLoading(true);
 try{   
    

const response=await axios.delete(process.env.REACT_APP_API_URL+'/api/student/delete-student?flag=false&batch='+deleteForm.batch, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 
          "Content-Type": "application/json",
        }});
console.log(response);
success("Batch Details are Deleted successfully");
 }catch(err)
 {
error("something went wrong");
console.log(err);
 }
 setLoading(false);
}


    return (
        <div className='p-2'>
            <h1 className="p-3">Students</h1>
            <Flex gap={10} justify='end' className='mb-2' wrap>
                <Button  onClick={() => { setStudentForm((prev) => ({ ...prev, single: true })) }} ><FaPlus /> Add Student</Button>
                <Button  onClick={() => { setStudentForm((prev) => ({ ...prev, bulk: true })) }}><FaUpload /> Upload</Button>
                <Button onClick={()=>{setDeleteForm((prev)=>({...prev,flag:true}))}}><FaTrash></FaTrash> Delete</Button>
            </Flex>

{props.search_result && props.search_result.length>0 && props.student?<><h2>Search Result for {props.student.name}({props.student.stu_id})</h2>

<Issuetable rowsData={props.search_result} student={props.student}/>


</>:<Flex justify='center'><img className='p-2 m-2 img-fluid' src="https://thumbs.dreamstime.com/b/no-found-symbol-unsuccessful-search-vecotr-upset-magnifying-glass-cute-not-zoom-icon-suitable-results-oops-page-failure-122786031.jpg"></img></Flex>}
           
            <Modal open={student_form.single} footer={null} onCancel={() => { setStudentForm((prev) => ({ ...prev, single: false })) }}>
                <Spin tip="Loading...." size='large' spinning={loading}>
                    <h1 className='mt-3'>Add New Student</h1>
                    <TextField className='w-100 m-1' label="Student Id" variant='outlined' value={formdata.stu_id} onChange={(e) => { setFormData((prev) => ({ ...prev, stu_id: e.target.value })) }} />
                    <TextField className='w-100 m-1' label="Name" variant='outlined' value={formdata.name} onChange={(e) => { setFormData((prev) => ({ ...prev, name: e.target.value })) }} />
                    <TextField className='w-100 m-1' label="Class Name" variant='outlined' value={formdata.class_name} onChange={(e) => { setFormData((prev) => ({ ...prev, class_name: e.target.value })) }} />
                    <TextField className='w-100 m-1' label="Dorm" variant='outlined' value={formdata.dorm} onChange={(e) => { setFormData((prev) => ({ ...prev, dorm: e.target.value })) }} />

                    <Flex justify='end'>
                        <Button onClick={handleFormUpload} type='primary'>Submit</Button>

                    </Flex>

                </Spin>
            </Modal>

            <Modal open={student_form.bulk} footer={null} onCancel={() => { setStudentForm((prev) => ({ ...prev, bulk: false })) }}>
                <Spin tip="Loading...." size='large' spinning={loading}>
                    <h1>Add Student In Bulk</h1>
                    <h3>xlsheet Structure</h3>
                    <img className='img-fluid' alt='xlsheet structure' src={xlDemo}></img>

                    <Upload
                        multiple
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={handleUploadChange}
                    >

                        <Button className='mt-1 p-4'><FaUpload /> Upload Data</Button>
                    </Upload>
                    <Flex justify='end'>
                        <Button className='mt-1' type='primary' onClick={handleFormUpload}>Submit</Button>
                    </Flex>
                </Spin>
            </Modal>
            <Modal open={deleteForm.flag} footer={null} onCancel={() => { setDeleteForm((prev) => ({ ...prev, flag: false })) }}>
            <Spin tip="Loading...." size='large' spinning={loading}>
                <TextField label="Batch" className='w-100 m-1 mt-5' placeholder='Enter Batch' variant='outlined' value={deleteForm.batch}  onChange={(e)=>{setDeleteForm((prev)=>({...prev,batch:e.target.value}))}}></TextField>
                <Flex justify='end'>
                        <Button className='mt-1' type='primary' onClick={handleDelete}>Submit</Button>
                    </Flex>
</Spin>
            </Modal>
        </div>
    );
};



export default Student;