import React from 'react';
import { useEffect,useContext } from 'react';
import Context from '../../context/Context';

const Student = props => {
    const {changeActiveTab}=useContext(Context);
  

    useEffect(()=>{
            changeActiveTab('STUDENT');
    },[])
    return (
        <div>
            <h1>studentpage</h1>
        </div>
    );
};



export default Student;