import React from 'react';
import { useContext,useEffect } from 'react';
import Context from '../../context/Context';
import { withRouter } from 'react-router-dom';

const TransactionTable = props => {
    const {changeActiveTab}=useContext(Context);
  

    useEffect(()=>{
            changeActiveTab('TRANSACTIONS');
    },[])
    return (
        <div>
            <h1>transactionpage</h1>
        </div>
    );
};



export default withRouter(TransactionTable);