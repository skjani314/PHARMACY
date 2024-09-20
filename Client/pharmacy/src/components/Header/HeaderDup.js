import React from 'react';
import logorgukt from './logo-rgukt.png';
import { IoIosNotifications } from "react-icons/io";
import './Header.css'
import LogIn from '../Login/LogIn';
import { useContext } from "react"
import Context from "../../context/Context"
import { Spin,Input } from 'antd';
import {withRouter} from 'react-router-dom'
import { IoSearchSharp } from "react-icons/io5";
import {useState} from 'react'

const {Search}=Input;


const Header = (props) => {
    const {isSearchActive}=props;
    const [showSearch,setSearch]=useState(false);
    const {location}=props;
    const {pathname}=location;
    let placeHolder='';
    if(pathname==='/medicinepage' || pathname==='/medicinepage/'){
        placeHolder='Enter medicine name to search';
    }
    else if(pathname==='/studentpage' || pathname==='/studentpage/'){
        placeHolder='Enter student name to search';
    }
    const searchBar=placeHolder===''&&'remove-search';
    const onClickSearchIcon=()=>{
        setSearch((prevState)=>(!prevState));
    }
    return (
        <div className='header-main-container' style={{position:'static'}}>
        <div className='header-container' style={{zIndex:-1}} >
                <div>
                    <img src={logorgukt} className="styling-logo" alt="logo" />
                </div>
            <div className="logout-container">
            <div className={`search-container ${searchBar}`}>
                    <Search placeholder={placeHolder} allowClear  style={{width: 250,}}/>
            </div>
                <IoSearchSharp className='styling-search-icon'  onClick={onClickSearchIcon}/>
                <IoIosNotifications className="styling-icon" />
                <LogIn/>
                </div>
        </div>
        <div className={`search-container-bottom ${isSearchActive?'show-search':'remove-search'}`}>
            <Search placeholder={placeHolder} allowClear  style={{width: 200,}}/>
        </div>
        
        </div>
    );
};
export default withRouter(Header);