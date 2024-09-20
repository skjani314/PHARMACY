import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home/Home';
import Context from './context/Context';
import {Switch,Route,BrowserRouter} from 'react-router-dom';
import {useState,useEffect} from 'react';
import {message} from 'antd';
import Forgotpass from './components/Login/Forgotpass';
import axios from 'axios';
import 'bootstrap';
import './App.css';
import DashBoardPage from './pages/DashBoardPage';
import HomePage from './pages/HomePage';
import MedicinePage from './pages/MedicinePage';
import StockPage from './pages/StockPage';
import StudentPage from './pages/StudentPage';
import TransactionsPage from './pages/TransactionsPage';

const App=()=> {
const [activeTab,setActiveTab]=useState('DASHBOARD');
const [user,setUser]=useState(null);
const [loading,setLoading]=useState(false);


const [messageApi, contextHolder] = message.useMessage();
let flag=false;
const success = (msg) => {
  messageApi.open({
    type: 'success',
    content: msg,
  });
};
const error = (msg) => {
  messageApi.open({
    type: 'error',
    content: msg,
  });
};

useEffect(()=>{
  
  const getUser=async ()=>
    {
    try{

         const result= await axios.post('/get-user');
             setUser(result.data);
             flag=true;
      }
      catch(err)
      {
        return null;
      }

    }
if(!flag){
getUser();}
return ()=>{flag=true;}
},[])



const changeActiveTab=(tabId)=>{
      setActiveTab(tabId);
}

const context_data={
    activeTab,
    changeActiveTab:changeActiveTab,
    success,
    error,
    contextHolder,
    user,
    setUser,
    loading,
    setLoading

}



return (
<Context.Provider value={context_data}>

  <BrowserRouter>
  <Switch>
    <Route exact path='/' component={HomePage}/>
    <Route exact path='/dashboard' component={DashBoardPage}/>
    <Route path='/forgot/:token' component={Forgotpass} />
    <Route exact path='/medicinepage' component={MedicinePage}/>
    <Route exact path='/studentpage' component={StudentPage}/>
    <Route exact path='/transactionpage' component={TransactionsPage}/>
    <Route exact path='/stockpage' component={StockPage}/>

    <Route/>
  </Switch>
 
  </BrowserRouter>
  
</Context.Provider>
 );
}

export default App;
