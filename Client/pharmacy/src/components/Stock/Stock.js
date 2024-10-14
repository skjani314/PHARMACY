import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { withRouter } from 'react-router-dom'
import Context from '../../context/Context';
import { Button, Row, Flex, Modal, Upload, Spin, DatePicker, Avatar, Typography } from 'antd';
import { FaPlus, FaUpload } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import StockSearchSuggest from '../Cards/StockSearchSuggest';
import axios from 'axios';
import Transactiontable from '../Tables/TransactionTable';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const Stock = props => {
    const { loading, setLoading, success, error, contextHolder, changeActiveTab, Medicine_data } = useContext(Context);
    const [stock_form, setStockForm] = useState({ bulk: false, single: false });
    const [fileList, setFileList] = useState([]);
    const [formdata, setFormData] = useState({ imported_quantity: '', expery: '', med_id: '' });
    const [search_result, setSerachResult] = useState([]);
    const [rowsData, setRows] = useState([]);
    const [dates, setDates] = useState([]);
    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };
    useEffect(() => {
        changeActiveTab('STOCK');


        const rowsData = async () => {
            setLoading(true);
            try {
                const today = new Date();

                const start = new Date();
                start.setDate(start.getDate() - 5);
                const result = await axios.get('/stock');
                //  console.log(result);
                setRows(prev => ([...prev, ...result.data]));
            } catch (err) {
                error("something went wrong");
            }
            setLoading(false);
        }


        rowsData()

    }, []);

    const onDatesChange = async (values, dateStrings) => {

        setDates(values);
        console.log(dateStrings);
    }

    const handleFormUpload = async () => {
        setLoading(true);

        const form_Data = new FormData();
        fileList.forEach(file => {
            form_Data.append('img', file.originFileObj);
        });


        if (!stock_form.bulk) {
            form_Data.append('imported_quantity', formdata.imported_quantity);
            form_Data.append('expery', formdata.expery);
            form_Data.append('med_id', formdata.med_id);
        }
        try {


            const result = await axios.post('/stock', form_Data, { withCredentials: true });
            console.log(result);
            success("Stock Added Successfully");
            setFormData((prev) => ({ imported_quantity: '', expery: '', med_id: '' }))
            setFileList([]);
            setStockForm((prev) => ({ bulk: false, single: false }))
        }
        catch (err) {
            error("something went wrong");
        }
        setLoading(false)




    }

    const handleMedIdChange = (e) => {
        setFormData((prev) => ({ ...prev, med_id: e.target.value }));
        if (e.target.value != "") {
            const result = Medicine_data.filter((each) => (
                each.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                each.useage.toLowerCase().includes(e.target.value.toLowerCase())
            )
            )
            setSerachResult([...result]);
        }
        else {
            setSerachResult([]);
        }
    }

    const handlesuggestionClick = (e) => {
        setFormData((prev) => ({ ...prev, med_id: e }));
        setSerachResult([])
    }


    const handleDatesChange =async () => {

        setLoading(true);
        try {

            
            const result = await axios.get('/stock?flag=false&start=' + dates[0].toISOString().split('T')[0] + '&end=' + dates[1].toISOString().split('T')[0]);

            setRows(prev => ([...result.data]));
        } catch (err) {
            error("something went wrong");
        }
        setLoading(false);



    }

    return (
        <div>
            <h1>Stock</h1>
            <Flex gap={10} justify='end' className='mb-2' wrap>
                <Button className='m' onClick={() => { setStockForm((prev) => ({ ...prev, single: true })) }} ><FaPlus /> Add Stock</Button>
                <Button className='m' onClick={() => { setStockForm((prev) => ({ ...prev, bulk: true })) }}><FaUpload /> Upload</Button>
            </Flex>

            <h1>Recent Imports</h1>

            <Flex  className='mb-3' gap={10} wrap>
                <RangePicker onChange={onDatesChange} />
                <Button type='primary' onClick={handleDatesChange}>Submit</Button>
            </Flex>

            <Transactiontable rowsData={rowsData} />






            <Modal open={stock_form.single} footer={null} onCancel={() => { setStockForm((prev) => ({ ...prev, single: false })) }}>
                <Spin tip="Loading...." size='large' spinning={loading}>
                    <h1 className='mt-3'>Add New Stock</h1>
                    <TextField className='w-100' label="Medicine" variant='outlined' value={formdata.med_id} onChange={handleMedIdChange} />
                    <div className='my-2 p-2' style={{ background: 'whitesmoke' }}>
                        {
                            search_result.map((each) => (
                                <StockSearchSuggest key={each.id} data={each} handlesuggestionClick={handlesuggestionClick} />
                            ))
                        }
                    </div>
                    <Flex gap={10} align="end" wrap >
                        <TextField label="Quantity" variant="outlined" value={formdata.imported_quantity} onChange={(e) => { setFormData((prev) => ({ ...prev, imported_quantity: e.target.value })) }} />
                        <TextField label="expery" variant="outlined" value={formdata.expery} onChange={(e) => { setFormData((prev) => ({ ...prev, expery: e.target.value })) }} />
                    </Flex>

                    <Flex justify='end'>
                        <Button type='primary' className='mt-3' onClick={handleFormUpload}>Submit</Button>
                    </Flex>
                </Spin>
            </Modal>


            <Modal open={stock_form.bulk} footer={null} onCancel={() => { setStockForm((prev) => ({ ...prev, bulk: false })) }}>
                <Spin tip="Loading...." size='large' spinning={loading}>

                    <h1>Add Stock In Bulk</h1>
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

        </div>
    );
}


export default withRouter(Stock);