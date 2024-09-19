import React from 'react';
import { useContext } from "react"
import { Spin } from "antd";
import Context from '../context/Context';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import Transactions from '../components/Transactions/Transaction';

const TransactionsPage = props => {

    const {loading,setLoading,success,error,contextHolder}=useContext(Context);



    return (
        <>
        {contextHolder}
        <Spin tip="Loading...." size='large' spinning={loading}>
        <div className="home-container">
            <div className="home-header-sidebar"><Header /></div>

            <div className="header-down">
                <div className="sidebar-container">
                    <Sidebar />
                </div>
                <div className="main-content">
                 <Transactions/>
                </div>
            </div>

        </div>
        </Spin>
        </>
    );
};



export default TransactionsPage;