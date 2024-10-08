import React ,{useState}from 'react';
import { useContext } from "react"
import { Spin } from "antd";
import Context from '../context/Context';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import Medicine from '../components/Medicine/Medicine';
import { useParams,Link,useLocation } from 'react-router-dom';



const MedicinePage = props => {


    const {loading,setLoading,success,error,contextHolder}=useContext(Context);
   const [search_value,setSearchValue]=useState("");  
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
   


    return (
        <>
        {contextHolder}
        <Spin tip="Loading...." size='large' spinning={loading}>
        <div className="home-container">
            <div className="home-header-sidebar">
             <Header 
                     search_value={search_value}
                     setSearchValue={setSearchValue}
            
            /></div>

            <div className="header-down">
                <div className="sidebar-container">
                    <Sidebar />
                </div>
                <div className="main-content">
                  <Medicine param={searchParams.get('name')}/>
                </div>
            </div>

        </div>
        </Spin>
        </>
    );
};



export default MedicinePage;