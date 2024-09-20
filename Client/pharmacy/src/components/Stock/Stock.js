import React from 'react';
import {useEffect,useContext} from 'react';
import {withRouter} from 'react-router-dom'
import Context from '../../context/Context';

const Stock = props => {
    const {changeActiveTab}=useContext(Context);

    useEffect(()=>{
            changeActiveTab('STOCK');
        
    },[])
    return (
        <div>
            <h1>stockpage</h1>
        </div>
    );
};


export default withRouter(Stock);