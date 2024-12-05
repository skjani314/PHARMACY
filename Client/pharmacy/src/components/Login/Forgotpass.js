import { Row,Col, Spin, Button } from 'antd';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import React, { useEffect, useState ,useContext} from 'react';
import { useParams,Link } from 'react-router-dom';
import sucimg from './passchange.png'
import Context from '../../context/Context';
import './LogIn.css'
const Forgotpass = props => {
const [FormData,setFormData]=useState({password:'',cpassword:''});
const [psicon,setPsicon]=useState(false);
const [ValData,setValData]=useState({password:true,cpassword:true});
const [plen,setPlen]=useState(false);
const [lcase,setLcase]=useState(false);
const [ucase,setUcase]=useState(false);
const [dig,setDig]=useState(false);
const [spc,setSpc]=useState(false);
const {token}=useParams();
const {success,error,loading,setLoading,contextHolder}=useContext(Context);
let ismount=true;
const [verified,setverified]=useState(false);
const [isChanged,setIsChanged]=useState(false);


useEffect(()=>{

const fun= async ()=>{
try{

setLoading(true);  
const result= await axios.post('/forget/verify',{token:token})
setLoading(false);
success("Link Verified SuccessFully");
setverified(true);
}
catch(err)
{

setLoading(false);
error("Link Expired");
setverified(false);
}
}

if(ismount){
  fun();
}

return ()=>{ismount=false;}


},[]);




const handleFormData = (e) => {
  const { name, value } = e.target;

  setFormData(prev => ({ ...prev, [name]: value }));

  if (value!='') {
    switch (name) {

      case 'password':
        setValData(prev => ({ ...prev, password: false }));
        setPlen(/^.{8,20}$/.test(value));
        setUcase(/[A-Z]/.test(value));
        setLcase(/[a-z]/.test(value));
        setDig(/[0-9]/.test(value));
        setSpc(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value));
        setValData(prev => ({ ...prev, password: /^.{8,20}$/.test(value) && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)}));
        break;
      case 'cpassword':
        setValData(prev => ({ ...prev, cpassword: value === FormData.password }));
        break;
     default:
        break;
    }
  } else {
    setValData(prev => ({ ...prev, [name]: true }));
  }

};


const handleRegSubmit = async (e) => {
  e.preventDefault();

if(ValData.password && ValData.cpassword)
  {
 
    setLoading(true);

    try{
      await axios.post('/passchange',{token:token,data:FormData},{withCredentials:true})
      success("password changed successfully");
      setLoading(false);
      setFormData((prev)=>({password:'',cpassword:''}));
      setIsChanged(true);
      setverified(false);

    }
    catch(err)
    {
     error("something went Wrong");
     setLoading(false);
     setFormData((prev)=>({password:'',cpassword:''}));

    }

  }
  else{

    error("Fill required Fields");

  }



};



  return (
  <Spin tip="Loading...." size='large' spinning={loading}>
    {contextHolder}
    
  <Row align='bottom'>

    <Col xs={{span:20,offset:2}} sm={{span:18,offset:3}} md={{span:10,offset:7}}  >
    {
      (verified)?
    <div className='fcontainer'>
      <form method='POST' onSubmit={handleRegSubmit}>
        <div >
          <h1>Reset Password</h1>
        </div>

        <div style={{position:'relative'}}> <input  type={!psicon?'password':'text'} name='password' placeholder="Your password*" required value={FormData.password} onChange={handleFormData}/>{' '}{psicon?<FaEyeSlash className='passicon'  onClick={()=>{setPsicon(!psicon);}} />:<FaEye className='passicon'  onClick={()=>{setPsicon(!psicon)}} />}</div>
       {!ValData.password && !plen ?<p>Password must be between 8 and 20 characters long.</p>:null}
       {!ValData.password && !lcase ?<p>"Password must include at least one lowercase letter."</p>:null}

       {!ValData.password && !ucase ?<p>Password must include at least one uppercase letter.</p>:null}
       {!ValData.password && !dig ?<p>"Password must include at least one digit."</p>:null}
       {!ValData.password && !spc ?<p>"Password must include at least one special character."</p>:null}
       
       <input type={!psicon?'password':'text'} name='cpassword' placeholder="confirm password*" required  value={FormData.cpassword} onChange={handleFormData}/>
       {!ValData.cpassword?<p>Password And Confirm Password Should be same</p>:null}
      

        <button id="log-in-submit">Reset</button><br></br>
      </form>
    </div>
    :
    !isChanged?
   <div className='fcontainer'>
      <h1>
      Link Expired
      </h1>
      <img src='https://ih1.redbubble.net/image.1937257523.0326/st,small,507x507-pad,600x600,f8f8f8.jpg' width="100%" className='img-fluid'/>
   </div>
   :  <div className='fcontainer'>
   <h1>
   Password Changed successfully
   </h1>
   <img src={sucimg} className='img-fluid'/>
   <Button><Link to='/' className="Link">Login Now</Link></Button>
</div>
    }
    </Col>
  </Row>  
  </Spin>
  );
};



export default Forgotpass;