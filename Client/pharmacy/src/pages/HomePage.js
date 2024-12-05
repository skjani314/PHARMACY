import React, { useState } from 'react';
import { useContext } from "react"
import { Carousel, Spin } from "antd"; import Context from '../context/Context';
import Medicine from '../components/Medicine/Medicine';
import { useParams, Link, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import { MdArrowForwardIos, MdArrowBackIso, MdArrowBackIos } from "react-icons/md";
import c1 from "./images/c1.jpg"
import c2 from "./images/c2.jpg"
import c5 from "./images/c5.jpg"
import c4 from "./images/c4.avif"




const HomePage = props => {

    const { loading, setLoading, success, error, contextHolder } = useContext(Context);
    const [search_value, setSearchValue] = useState("");
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);


    return (
        <>
            {contextHolder}
            <Spin tip="Loading...." size='large' spinning={loading}>

                <Header
                    search_value={search_value}
                    setSearchValue={setSearchValue}

                />
                {(searchParams.get('name')=='') || !searchParams.get('name')?
                <Carousel infinite autoplay arrows className='my-5' centerMode={true} dots={false} nextArrow={<MdArrowForwardIos color='red' size='large' />} prevArrow={<MdArrowBackIos color='red' size={30} />} >

                    <div className='home-carousel px-2'>
                        <img src={c1} className='mx-3' />
                    </div>
                    <div className='home-carousel px-2'>
                        <img src={c2} className='mx-3' />
                    </div>
                    <div className='home-carousel px-2'>
                        <img src={c4} className='mx-3' />
                    </div>
                    <div className='home-carousel px-2'>
                        <img src={c5} className='mx-3' />
                    </div>
                </Carousel>:null
}
                <Medicine param={searchParams.get('name')} />
            </Spin>
        </>
    );
};



export default HomePage;