import Header from "../Header/Header"
import Sidebar from "../Sidebar/Sidebar"
import './Home.css'
const Home=()=>{
    return(
        <div className="home-container">
        <div className="home-header-sidebar"><Header/>
        <div className="sidebar-container"><Sidebar/></div>
        </div>
        
        </div>
    )
 }
export default Home