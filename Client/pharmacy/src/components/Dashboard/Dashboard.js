import Header from "../Header/Header"
import Sidebar from "../Sidebar/Sidebar"

import './Dashboard.css'

const Dashboard = () => {
    return (
        <div className="dashboard-container">
        <div className="dashboard-header-sidebar"><Header/>
        <div className="sidebar-container"><Sidebar/></div>
        </div>
        
        </div>
    );
};


export default Dashboard;