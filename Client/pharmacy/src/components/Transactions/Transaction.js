import {useEffect,useContext} from 'react';

import Context from '../../context/Context';import React from 'react';


const Transaction = props => {
    const {changeActiveTab}=useContext(Context);
    useEffect(()=>{
        changeActiveTab('TRANSACTIONS');
    })
    return (
        <div>
            <h1>transactionpage</h1>
        </div>
    );
};


export default Transaction;