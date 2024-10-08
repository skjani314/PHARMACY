import React from 'react';
import { Flex, Typography, Avatar } from 'antd';
const Text = Typography;
const StockSearchSuggest = props => {

const handleClick=()=>{

props.handlesuggestionClick(props.data.name);
}


    return (
        <div style={{ background: 'white' }} className='my-1' onClick={handleClick}>
            <Flex justify='start' className='mt-1' gap={5} >
                <Avatar className='mt-2' shape="square" size={30} icon={<img src={`data:${props.data.img.contentType};base64,${props.data.img.data}`} />} />

                <Flex vertical gap={0} >
                    <Text className='mt-1'>{props.data.name} </Text>
                    <Text style={{ fontSize: 10 }}>{props.data.useage}</Text>
                </Flex>
            </Flex>
        </div>
    );
};



export default StockSearchSuggest;