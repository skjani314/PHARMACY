import React from 'react';
import logorgukt from './logo-rgukt.png';
import { IoIosNotifications } from "react-icons/io";
import './Header.css'
import LogIn from '../Login/LogIn';
import { useContext } from "react"
import Context from "../../context/Context"
import { Spin } from 'antd';


const Header = () => {




    return (
        <>
        <div className='header-container' style={{zIndex:100}} >
            <div className='header'>
                <div>
                    <img src={logorgukt} className="styling-logo" alt="logo" />
                </div>

            </div>
            <div className="logout-container">
                <IoIosNotifications className="styling-icon" />
                <LogIn/>
                </div>
        </div>
        </>
    );
};
export default Header;