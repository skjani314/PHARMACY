import { useEffect, useContext, useState } from 'react';
import Context from '../../context/Context';
import React from 'react';
import { Modal, Flex, Button, Typography ,DatePicker} from 'antd';
import { FaDownload, FaPlus } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import SearchSuggest from '../Cards/SearchSuggest';
import RecentTransactionsTable from '../Tables/RecentTransactionsTable';

import * as XLSX from 'xlsx';

const downloadExcel = (jsonData, filename) => {
  try {
    const workbook = XLSX.utils.book_new();

    const data=jsonData.map(each=>{
        const {name,_doc}=each;
        const {date,med_id,quantity,reason,stu_id}=_doc;

        return {Date:date,ID:stu_id,name,medicine:med_id,quantity,reason}
    })

    const worksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets['Sheet1'] = worksheet;
    workbook.SheetNames[0]='Sheet1';
console.log(workbook)
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading Excel file:', error);
  }
};


const { Text } = Typography;
const Transaction = props => {

    const [Transactionform, setTransactionForm] = useState(false);
    const [formdata, setFormData] = useState({ stu_id: '', quantity: '', reason: '', med_id: '' });

    const { loading, setLoading, success, error, contextHolder, changeActiveTab, Medicine_data } = useContext(Context);

    const [search_result, setSerachResult] = useState([]);
    const [stuSearch_result, setstuSearch] = useState([]);
    const [datseRange, setdatesrange] = useState({ start: '', end: '' });
    const [tabledata, setTableData] = useState([]);
    useEffect(() => {
        changeActiveTab('TRANSACTIONS');


        const recenttransactions = async () => {

            setLoading(true);
            try {
                const result = await axios.get(process.env.REACT_APP_API_URL+'/transaction',{ withCredentials: true, });
                setTableData([...result.data]);
            }
            catch (err) {
                console.log(err);
                error("something went wrong");
            }
            setLoading(false);
        }

        recenttransactions();

    }, [])

    const handleSearch = async (e) => {
        setFormData((prev) => ({ ...prev, med_id: e.target.value }))
        if (e.target.value != "" && !props.page) {
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


    const handleFormUpload = async () => {


        setLoading(true);

        const form_Data = new FormData();
        form_Data.append('stu_id', formdata.stu_id);
        form_Data.append('quantity', formdata.quantity);
        form_Data.append('reason', formdata.reason);
        form_Data.append('med_id', formdata.med_id);
        try {

            const result =await axios.post(process.env.REACT_APP_API_URL+'/transaction', form_Data, { withCredentials: true });
            console.log(result);
            success("Medicine Issued Succesfully");

        } catch (err) {
            error("something went wrong");
        }
        setLoading(false);
        setFormData({ stu_id: '', quantity: '', reason: '', med_id: '' })
        setTransactionForm(false);

    }

    const handleSearchResultClick = (value) => {

        setFormData((prev) => ({ ...prev, stu_id: value }))
        setstuSearch([]);
    }

    const handleDatessubmit=async ()=>{


        setLoading(true);
        try {
            const result = await axios.get(process.env.REACT_APP_API_URL+`/transaction?start=${datseRange.start}&end=${datseRange.end}`,{ withCredentials: true, });
            setTableData([...result.data])
        }
        catch (err) {
            error("something went wrong");
        }
        setLoading(false);


    }
    const stuidsearch = async (e) => {
        setFormData((prev) => ({ ...prev, stu_id: e.target.value }))
        if (e.target.value != "") {
            try {

                const result = await axios.get(process.env.REACT_APP_API_URL+'/student?stu_id=' + e.target.value,{ withCredentials: true, });
                setstuSearch([...result.data]);
            } catch {
                error("something went wrong");
                setstuSearch([]);
            }
        } else {
            setstuSearch([]);
        }
    }

    return (
        <div>
            <h1>Transactions</h1>

            <Flex gap={10} justify='end' className='mb-2' wrap>
                <Button  onClick={() => { setTransactionForm(true) }} ><FaPlus /> Add Transaction</Button>
                <Button onClick={()=>{ downloadExcel(tabledata, 'Transactions.xlsx');}} ><FaDownload/> Download</Button>
            </Flex>
            <h1>Recent Transactions</h1>
            <Flex gap={10} justify='end' className='mb-2' wrap>
                <DatePicker placeholder="select Start Date"  onChange={(e,s)=>{setdatesrange((prev)=>({...prev,start:s}))}}/>
                <DatePicker placeholder="select End Date"  onChange={(e,s)=>{setdatesrange((prev)=>({...prev,end:s}))}}/>
                <Button onClick={handleDatessubmit} type='primary'>Submit</Button>

            </Flex>
            <RecentTransactionsTable rowsData={tabledata} />
            <Modal open={Transactionform} footer={null} onCancel={() => { setTransactionForm(false) }}>
                <Flex gap={10} align="end" wrap >
                    <br></br>
                    <TextField className='m-1  w-100' label="Student Id" variant="outlined" value={formdata.stu_id} onChange={stuidsearch} />
                    <div className='mt-2 w-100' style={{ background: 'whitesmoke', }}>
                        {
                            stuSearch_result.map((each) => (
                                <Flex key={each.stu_id} vertical className='m-1 p-2 search-suggestion' style={{ background: "white", width: "100%" }} onClick={() => handleSearchResultClick(each.stu_id)}>
                                    <Text>{each.stu_id}</Text>
                                    <Text style={{ fontSize: 11 }}>{each.name}</Text>
                                </Flex>
                            ))
                        }
                    </div>

                    <TextField className='m-1 w-100' label="Medicine" variant="outlined" value={formdata.med_id} onChange={handleSearch} />
                    <div className='mt-2 w-100' style={{ background: 'whitesmoke', }}>
                        {
                            search_result.map((each) => (
                                <SearchSuggest key={each.id} data={each} setSerachResult={setSerachResult} transaction={true} setFormData={setFormData} />

                            ))
                        }

                    </div>
                    <TextField className='m-1 w-100' label="Quantity" variant="outlined" value={formdata.quantity} onChange={(e) => { setFormData((prev) => ({ ...prev, quantity: e.target.value })) }} />
                    <TextField className='m-1 w-100' label="Reason" variant="outlined" value={formdata.reason} onChange={(e) => { setFormData((prev) => ({ ...prev, reason: e.target.value })) }} />

                    <Flex justify='end'>
                        <Button type='primary' className='mt-3' onClick={handleFormUpload}>Submit</Button>
                    </Flex>
                </Flex>
            </Modal>


        </div>
    );
};


export default Transaction;