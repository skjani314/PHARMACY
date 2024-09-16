import { IoMdHome } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { MdLocalPharmacy } from "react-icons/md";
import { FaHandHoldingMedical } from "react-icons/fa";
import Context from "../../context/Context";
import pharmacyImage from './pharmacy.jpeg'

import './Sidebar.css'
const sidebarItems=[
    {
        id:"DASHBOARD",
        displayText:"Dashboard",
        icon:<MdDashboard/>
    },
    {
        id:'RECENT',
        displayText:'Recent',
        icon:<IoMdHome/>
    },
    
    {
        id:"STOCK_ISSUE",
        displayText:'Stock Issue',
        icon:<MdLocalPharmacy/>
    },
    {
        id:"STOCK_ENTRY",
        displayText:'Stock Entry',
        icon:<FaHandHoldingMedical/>
    }
]
const Sidebar=()=>{
   return <Context.Consumer>
    {
        value=>{
            const {changeActiveTab,activeTab}=value;
            return(
                <>
                <div className='sidebar-container-md'>
                   <div>
                        <h1 className="main-heading">PHARMACY</h1>
                        <img src={pharmacyImage} alt="pharmacy" className="pharmacy-image"/>
                        <hr className="hr-line"/>
                    </div>
                <ul className="unordered-list">
                    {sidebarItems.map((eachItem)=>(
                        <li key={eachItem.id}>
                            <div className={`sidebar-icon-container ${eachItem.id===activeTab?'active-tab-color':''}`} onClick={()=>{changeActiveTab(eachItem.id)}} >
                                {eachItem.icon}
                                <p>{eachItem.displayText}</p>   
                            </div>
                        </li>
                    ))}
                </ul>
                </div>
                <ul className='sidebar-container-mobile'>
                {sidebarItems.map((eachItem)=>(
                        <li key={eachItem.id}>
                            <div  className={`icon-container-mobile ${eachItem.id===activeTab?'active-tab-color':''}`} onClick={()=>{changeActiveTab(eachItem.id)}}>
                                 {eachItem.icon}
                                 </div>
                        </li>
                ))}
               
                </ul>
                </>
                
            )
        }
    }
    </Context.Consumer>
   
}
export default Sidebar