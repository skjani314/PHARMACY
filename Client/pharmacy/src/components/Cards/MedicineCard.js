import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Flex, Typography, Grid } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './MedicineCard.css'
import { useMediaQuery } from 'react-responsive';



const { useBreakpoint } = Grid;

const MedicineCard = props => {


    const screens = useBreakpoint();

    const isLargeScreen = useMediaQuery({ query: '(min-width: 1200px)' });
  const isMediumScreen = useMediaQuery({ query: '(min-width: 635px)' });
  const isSmallScreen = useMediaQuery({ query: '(max-width: 531px)' });

  let card_gap=50;

  if(isLargeScreen)
    {
        card_gap=50;
    }
   else if(isMediumScreen)
    {
        card_gap=200
    } 
    else if(isSmallScreen){
        card_gap=30;
    }
    else{
        card_gap=120;
    }
    
    const data = {
        imgurl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmoHOfPkhZ-JIvzQEU15PagLb69Sd5XNdmSA&s',
        name: "Citrizine",
        available: 30,
        useage: "cold,itching"
    }

    const { Text, Link } = Typography;


    return (
        <div >
            <Card hoverable >
                <Flex gap={card_gap} justify='space-between'>
                    <Flex gap={15} justify='space-around'>
                        <Avatar shape="square" size={100} icon={<img src={`data:${props.data.img.contentType};base64,${props.data.img.data}`}
                        />} />
                        <Flex vertical justify='center'>
                            <Text className='fs-3'> {props.data.name}</Text>
                            <Text><b>Available:</b>{" " + props.data.available}</Text>
                            <Text> <b>Useage:</b>{" " + props.data.useage}</Text>
                        </Flex>
                    </Flex>
                        <Flex justify='center' vertical gap={10} className='med-card'>
                            <Button className='bg-warning' style={{ color: 'black' }}><FaEdit />Edit</Button>
                            <Button className='bg-danger' style={{ color: 'white' }}><FaTrash />Delete</Button>
                        </Flex> 
                </Flex>
            
                    <Flex justify='space-around' gap={10} className='mt-3 opt-down'>
                        <Button className='bg-warning'><FaEdit />Edit</Button>
                        <Button className='bg-danger'><FaTrash />Delete</Button>
                    </Flex>
                 
            </Card>
        </div>
    );
};



export default MedicineCard;