import React from 'react';
import { useContext,useState } from "react"
import { Spin } from "antd";
import Context from '../context/Context';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import Student from '../components/Student/Student';


const StudentPage = props => {

    const { loading, setLoading, success, error, contextHolder } = useContext(Context);
    const [search_value, setSearchValue] = useState("");
    const [search_result,setSearachResult]=useState([]);

    return (
        <>
            {contextHolder}
            <Spin tip="Loading...." size='large' spinning={loading}>
                <div className="home-container">
                    <div className="home-header-sidebar">
                        <Header
                            search_value={search_value}
                            setSearchValue={setSearchValue}
                            page={true}
                            setSearachResult={setSearachResult}
                        />
                    </div>

                    <div className="header-down">
                        <div className="sidebar-container">
                            <Sidebar />
                        </div>
                        <div className="main-content">
                            <Student   search_result={search_result.transactions} student={search_result.student} />
                        </div>
                    </div>

                </div>
            </Spin>
        </>
    );
};



export default StudentPage;