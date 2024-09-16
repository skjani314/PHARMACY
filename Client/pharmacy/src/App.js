import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Context from './context/Context';
import {Switch,Route,BrowserRouter} from 'react-router-dom';
import {useState} from 'react';

import './App.css';

const App=()=> {
const [activeTab,setActiveTab]=useState('DASHBOARD');
const changeActiveTab=(tabId)=>{
      setActiveTab(tabId);
}
return (
<Context.Provider value={{
  activeTab,
  changeActiveTab:changeActiveTab,
}
}>

  <BrowserRouter>
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route exact path='/dashboard' component={Dashboard}/>
    <Route/>
  </Switch>
 
  </BrowserRouter>
  
</Context.Provider>
 );
}

export default App;
