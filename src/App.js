// import logo from './logo.svg';
import './App.css';
import Adminreg from './components/adminReg';
import Sign from './components/sign';
import $ from 'jquery'

import { Redirect, Route,Switch } from 'react-router-dom'


function App() {
  return (
   <div className='contnent'>
    <Switch>
          <Route path='/login' component={Sign}></Route>
          <Route path='/' exact component={Adminreg}></Route>
    </Switch>

 


   </div>
     );
}

export default App;
