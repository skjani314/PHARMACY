import { MdDashboard } from "react-icons/md";
import Context from "../../context/Context";
import pharmacyImage from './pharmacy.jpeg'
import { GiMedicines } from "react-icons/gi";
import { AiFillMedicineBox } from "react-icons/ai";
import { PiStudentBold } from "react-icons/pi";

import { GrTransaction } from "react-icons/gr";

import './Sidebar.css'
import { Link } from "react-router-dom/cjs/react-router-dom.min";
const sidebarItems=[
    {
        id:"DASHBOARD",
        displayText:"Dashboard",
        icon:<MdDashboard />,
        path:'/dashboard'
    },
    {
        id:'MEDICINE',
        displayText:'Medicine',
        icon:<GiMedicines className="mb-2"/>,
        path:'/medicinepage',
    },
    
    {
        id:"STOCK",
        displayText:'Stock',
        icon:<AiFillMedicineBox className="mb-2"/>,
        path:'/stockpage',
    },
    {
        id:"STUDENT",
        displayText:'Student',
        icon:<PiStudentBold className="mb-2"/>,
        path:'/studentpage',
    },
    {
        id:"TRANSACTIONS",
        displayText:'Transactions',
        icon:<GrTransaction className="mb-2"/>,
        path:'/transactionpage',
    }
]

const Sidebar=()=>{
   return <Context.Consumer>
    {
        value=>{
            const {changeActiveTab,activeTab}=value;
            return( 
                <>
                <div className='sidebar-container-md' >
                   <div style={{borderBottom:'1px solid black'}}>
                        <h1 className="main-heading">PHARMACY</h1>
                        <img src={pharmacyImage} alt="pharmacy" className="pharmacy-image img-fluid"/>
                    </div>
                <ul className="unordered-list">
                    {sidebarItems.map((eachItem)=>(
                        <li key={eachItem.id}>
                           <Link to={eachItem.path} className="Link"><div className={`sidebar-icon-container ${eachItem.id===activeTab?'active-tab-color':''}`} onClick={()=>{changeActiveTab(eachItem.id)}} >
                                {eachItem.icon}
                                <p className="mt-3">{eachItem.displayText}</p>   
                            </div></Link> 
                        </li>
                    ))}
                </ul>
                </div>
                <ul className='sidebar-container-mobile' style={{zIndex:100}}>
                {sidebarItems.map((eachItem)=>(
                        <li key={eachItem.id}>
                          <Link to={eachItem.path} className="Link">  <div  className={`icon-container-mobile ${eachItem.id===activeTab?'active-tab-color':''}`} onClick={()=>{changeActiveTab(eachItem.id)}}>
                                 {eachItem.icon}
                                 </div></Link>
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