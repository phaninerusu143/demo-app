// import styles from "./lougout.scss"
// import "../../App.css"
// export default class Logout {
//   state={
//     secCounter:20,
//   }
// handleSeccounter=()=>
// {
// console.log('calling handleSeccounter');
// }
// setInterval(this.handleSeccounter,1000)
//   return (
//     <>
//     <div className={styles}>
//                 <div className={styles.error}>text1</div>
//     </div>
//     <div className='btn'>
//         text2
//     </div>
//     </>
//   )
// }
import React, { Component } from 'react'
class Logout extends Component {
  state = { sec:20 } 
  // handleSecond=()=>
  // {
  //   let sec=--this.state.sec;
  //   if(sec===1)
  //   {
  //     clearInterval(this.handleIntervel)
  //   }
  //   this.setState({sec})
  //   //console.log(this.state.sec)

  // }
  handleIntervel=()=>
  {
    let int=setInterval(()=>
    {
      let sec=this.state.sec-1;
      if(this.state.sec===1)
      {
        // alert('calling')
        clearInterval(int)
      }
      this.setState({sec})
      //console.log(this.state.sec)
  
    },1000)
  }
  
 componentDidMount() { this.handleIntervel() }

  render() { 
    return (
      <h1>{this.state.sec}</h1>
    );
  }
}
export default Logout;
