// SignInPage.js
import { Modal, Button as AntButton ,Spin} from 'antd';
import axios from 'axios';
import React, {  useState,useContext } from 'react';
import './LogIn.css';
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import Context from '../../context/Context';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function LogIn() { 
const [isVisible, setIsVisible] = useState(false);  
const [LogData,setLogdata]=useState({email:'',password:''});
const [psicon,setPsicon]=useState(false);
const [forgetpass,setForgetPass]=useState({email:'',flag:false});
const {loading,setLoading,success,error,contextHolder,user,setUser}=useContext(Context);
const history=useHistory();

const showModal = () => {
  
    setIsVisible(true);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setForgetPass((prev)=>({...prev,flag:false}))
  };


  const handleForgetSubmit=async (e)=>{
    e.preventDefault();
    setLoading(true);
  
   try{
  const result=await axios.post(process.env.REACT_APP_API_URL+'/api/auth/forget',{email:forgetpass.email})
  console.log(result);
  success("Reset Link sent to Mail Successfully");
  setLoading(false);
  handleCancel()
  setForgetPass({email:'',flag:false});
   }catch{
    error("User not found");
    setLoading(false);
  
   }
   
  
    }  



const handleLogData=(e)=>
  {
   const {name,value}=e.target;
   setLogdata({...LogData,[name]:value})

  }

  const handleLogSubmit=async (e)=>
    {
      e.preventDefault();
      setLoading(true);
       try{
        const form_data=new FormData();
        form_data.append('email',LogData.email);
        form_data.append('password',LogData.password);
        
        const accessResult= await axios.post(process.env.REACT_APP_API_URL+'/api/auth/login',form_data,{headers: {"Content-Type": "application/json",}})
        console.log(accessResult);
       localStorage.setItem('accessToken',accessResult.data);

        setLogdata({email:'',password:''});
        handleCancel();
        const result= await axios.post(process.env.REACT_APP_API_URL+'/api/auth/get-user',{}, {
        headers: {
          Authorization: `Bearer ${accessResult.data}`, 
          "Content-Type": "application/json",
        }});
        setUser(result.data);
        setLoading(false);
        success("Logged In successfully");
history.push('/dashboard')

       }catch(err)
       {
         error("Invalid Credentials");
         setLoading(false);

       }

    }

 
const handleLogout=async ()=>{
  setLoading(true);
  try{
  
    // await axios.post(process.env.REACT_APP_API_URL+'/api/auth/logout',{}, {
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 
        //   "Content-Type": "application/json",
        // }})
    localStorage.removeItem('accessToken');
    success("logged out successfully");
     setUser(null);
     setLoading(false);
     history.push('/');
  
  }
  catch{
  error("something went wrong")
  setLoading(false);
  }
  
  }
     

  return (
    <>
    {contextHolder}
    {!user?
     <AntButton type="primary"  onClick={showModal}>
   Sign in
    </AntButton>
    :<>
   <Link className='Link' style={{color:'black'}} to="/dashboard"><FaUser size={14} className="styling-icon"/></Link>
    <AntButton type='primary'  onClick={handleLogout}>
     <Link className="Link" to="/">Log Out</Link> 
    </AntButton>
    </>
}
    <Modal 
      title="" 
      open={isVisible} 
      onCancel={handleCancel}
      footer={[]}
    >
    <Spin tip="Loading...." size='large' spinning={loading}>
    {
      !forgetpass.flag?
    <div className="fcontainer"> 
      
    <form id="log-in-form" onSubmit={handleLogSubmit} method='POST'>
      <div className="header">
        <h1>Welcome back!</h1>
        <b>email:skskjani7@gmail.com</b><br></br>
        <b>password:skjani314@A</b>
      </div>
      <input className="email" name='email' type="email" placeholder="Email Address*" required value={LogData.email} onChange={handleLogData}/>
     <div style={{position:'relative'}}> <input  type={!psicon?'password':'text'} name='password' placeholder="Your password*" required value={LogData.password} onChange={handleLogData}/>{' '}{psicon?<FaEyeSlash className='passicon' onClick={()=>{setPsicon(!psicon);}} />:<FaEye className='passicon' onClick={()=>{setPsicon(!psicon)}} />}</div>
     
      <div className="password" onClick={(e)=>{setForgetPass((prev)=>({...prev,flag:true}))}}>
        Forgot Password?
      </div>
      <button id="log-in-submit mb-6">Log in</button><br></br>
      <center>Only Institution Pharmacy Staff Authorized</center><br></br>
    </form>

  </div>:
  <div className='fcontainer'>
  <form  method='POST' onSubmit={handleForgetSubmit}>
   <div className="header">
     <h1>Reset Password</h1>
   </div>
   <input className="email" name='email' type="email" placeholder="Email Address*" value={forgetpass.email} onChange={(e)=>{setForgetPass((prev)=>({...prev,email:e.target.value}))}} required/>
   <button id="log-in-submit mb-6">Send Reset Link</button><br></br>
 </form>
     </div>
  
  
  }
</Spin>
  </Modal>
  </>
   );
}

export default LogIn;
