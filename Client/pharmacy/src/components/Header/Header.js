import React from 'react';
import logorgukt from './logo-rgukt.png';
import { IoIosNotifications } from "react-icons/io";
import './Header.css'

const Header = () => {
    return (
        <div className='header-container'>
            <div className='header'>
        <div>
         <img src={logorgukt} className="styling-logo" alt="logo"/>
         </div>
         <div>
            <input type="search" className="styling-input"/>
         </div>
         </div>
         <div className="logout-container">
            <IoIosNotifications className="styling-icon"/>
            <button className='logout-button'>Logout</button>
         </div>
        </div>
    );
};
export default Header;