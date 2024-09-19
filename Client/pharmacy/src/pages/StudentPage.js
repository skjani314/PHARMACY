import React from 'react';
import { useContext } from "react"
import { Spin } from "antd";
import Context from '../context/Context';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import Student from '../components/Student/Student';


const StudentPage = props => {

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
                    <Student/>
                </div>
            </div>

        </div>
        </Spin>
        </>
    );
};



export default StudentPage;