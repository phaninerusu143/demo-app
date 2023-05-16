// import logo from './logo.svg';
import './App.css';
import Logout from './components/Logout/Logout';

import Adminreg from './components/adminReg';
import Forgotpassword from './components/forgotPassword';
import Sign from './components/sign';
import { Redirect, Route, Routes } from 'react-router-dom';


function App() {
  return (
   
    <Routes>
          <Route path='/' element={<Adminreg/>}/>
          <Route path='/login' element={<Sign/>}/>
          <Route path='/logout'  element={<Logout></Logout>}></Route>
          <Route  path='/forgotpassword' element={<Forgotpassword></Forgotpassword>}></Route>
          
    </Routes>
    

 


   
     );
}

export default App;
