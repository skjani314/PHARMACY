import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home/Home';
import Context from './context/Context';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { message,Spin } from 'antd';
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
import NotFoundPage from './components/NotFound/NotFound';

const App = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Medicine_data, setMedData] = useState([]);
  const [search_result, setSerachResult] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  let flag = false;
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

  useEffect(() => {

    const getUser = async () => {
      try {

        const result = await axios.post(process.env.REACT_APP_API_URL+'/get-user',{},{ withCredentials: true, });
        console.log(result);
        setUser(result.data);
        flag = true;
      }
      catch (err) {
        console.log(err)
        return null;
      }

    }

    const med_fun = async () => {
      setLoading(true);
      try {

        const med_data = await axios.get(process.env.REACT_APP_API_URL+'/medicine', {
          name: "", 
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        setMedData([...med_data.data]);
        console.log(med_data);
      }
      catch (err) {
        console.log(err);
        error("something went wrong")
      }
      setLoading(false);

    }

    if (!flag) {
      getUser();
      med_fun();
    }
    return () => { flag = true; }
  }, [])



  const changeActiveTab = (tabId) => {
    setActiveTab(tabId);
  }

  const context_data = {
    activeTab,
    changeActiveTab: changeActiveTab,
    success,
    error,
    contextHolder,
    user,
    setUser,
    loading,
    setLoading,
    Medicine_data,
    setMedData,
    search_result,
    setSerachResult,

  }



  return (
    <Spin tip="Loading...." size='large' spinning={loading}>
    <Context.Provider value={context_data}>

      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/dashboard' component={user ? DashBoardPage : NotFoundPage} />
          <Route path='/forgot/:token' component={Forgotpass} />
          <Route exact path='/medicinepage' component={user ? MedicinePage :NotFoundPage} />
          <Route exact path='/studentpage' component={user ? StudentPage : NotFoundPage} />
          <Route exact path='/transactionpage' component={user ? TransactionsPage : NotFoundPage} />
          <Route exact path='/stockpage' component={user ? StockPage : NotFoundPage} />
          <Route path="*" component={NotFoundPage} />
          <Route />
        </Switch>

      </BrowserRouter>

    </Context.Provider>
    </Spin>
  );
}

export default App;
