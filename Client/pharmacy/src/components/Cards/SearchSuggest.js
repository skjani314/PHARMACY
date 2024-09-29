import { Avatar, Flex,Typography } from 'antd';
import React from 'react';
import './SearchSuggest.css';
import {Link} from 'react-router-dom'

const {Text}=Typography;
const SearchSuggest = props => {


const handleMed=()=>{

props.setSerachResult([]);
props.setSearchValue("");
}

    return (
     <Link to={'medicinepage?name='+props.data.name} className="Link" >  <div  className='search-suggestion' onClick={handleMed}>
    <Flex justify='start' className='mt-1' gap={5}>
 <Avatar className='mt-2' shape="square" size={30} icon={<img src={`data:${props.data.img.contentType};base64,${props.data.img.data}`} />} />
 <Flex vertical gap={0} >
 <Text className='mt-1'>{props.data.name} </Text>
 <Text style={{fontSize:10}}>{props.data.useage}</Text>
 </Flex>
 </Flex>
</div></Link> 
    );
};


export default SearchSuggest;