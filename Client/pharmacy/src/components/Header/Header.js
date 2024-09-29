import React from 'react';
import logorgukt from './logo-rgukt.png';
import { IoIosNotifications } from "react-icons/io";
import './Header.css'
import LogIn from '../Login/LogIn';
import { useContext } from "react"
import Context from "../../context/Context"
import { Spin, Input, Flex } from 'antd';
import { withRouter } from 'react-router-dom'
import { IoSearchSharp } from "react-icons/io5";
import { useState } from 'react'
import HeaderDup from './HeaderDup';
import SearchSuggest from '../Cards/SearchSuggest';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const { Search } = Input;


const Header = (props) => {
    const [showSearch, setSearch] = useState(false);
    const { location } = props;
    const { pathname } = location;
    const {search_value,setSearchValue}=props;  
    const {    Medicine_data,search_result,setSerachResult, setMedSearchParam  }=useContext(Context);
    const history=useHistory();
    let placeHolder = '';
    if (pathname === '/medicinepage' || pathname === '/medicinepage/') {
        placeHolder = 'Search Medicine';
    }
    else if (pathname === '/studentpage' || pathname === '/studentpage/') {
        placeHolder = 'Search Student';
    }
    const searchBar = placeHolder === '' && 'remove-search';
    const onClickSearchIcon = () => {
        setSearch((prevState) => (!prevState));
    }



    const handleSearch = async (e) => {
        setSearchValue(e.target.value)
       if(e.target.value!=""){
        const result=Medicine_data.filter((each)=>(
            each.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            each.useage.toLowerCase().includes(e.target.value.toLowerCase())
        )
        )
        setSerachResult([...result]);
    }
    else{
        setSerachResult([]);
    }
    }

const handleSearchSubmit=()=>
{
history.push('/medicinepage?name='+search_value);
setSerachResult([]);
setSearchValue("");

}




    return (
        <>
            <HeaderDup isSearchActive={showSearch} />
            <div className='header-main-container' style={{ zIndex: 1000 }}>
                <div className='header-container'  >
                    <div>
                        <img src={logorgukt} className="styling-logo" alt="logo" />
                    </div>
                    <div className="logout-container">
                        <div className={`search-container ${searchBar}`} >
                            <Search
                                placeholder={placeHolder}
                                allowClear
                                enterButton
                                size={"large"}
                                onChange={handleSearch}
                                value={search_value}
                                onSearch={handleSearchSubmit}
                            />

                            <div className='mt-2' style={{ position: 'fixed', top: '55px', background: 'whitesmoke', }}>
                                {
                                    search_result.map((each)=>(
                                        <SearchSuggest data={each} setSerachResult={setSerachResult}  setSearchValue={ setSearchValue}/>
                                    ))
                                }

                            </div>
                        </div>
                        <IoSearchSharp className='styling-search-icon' onClick={onClickSearchIcon} />
                        <IoIosNotifications className="styling-icon" />
                        <LogIn />
                    </div>
                </div>
                <div className={`search-container-bottom  ${showSearch ? 'show-search' : 'remove-search'}`} >
                    <Flex vertical justify='start'>
                        <Search
                            placeholder={placeHolder}
                            allowClear
                            enterButton="Search"
                            size="large"
                            onChange={handleSearch}
                            onSearch={handleSearchSubmit}
                        />
                        <div className='mt-2' style={{ position: 'fixed', top: '115px', background: 'whitesmoke', }}>
                        {
                                    search_result.map((each)=>(
                                        <SearchSuggest data={each} setSerachResult={setSerachResult}   setSearchValue={ setSearchValue} />
                                    ))
                                }

                        </div>

                    </Flex>
                </div>

            </div>
        </>
    );
};
export default withRouter(Header);