import React, { Component, createRef } from "react";
import timer from "../test_file/timer";
class Signotp extends Component {
  state = {
    sec:20,
    disable:'disble'
  };
  timer=createRef();
  validateOTP=()=>
  {
    alert('hi');
  }

componentDidMount() { 
  const intervel=setInterval(()=>{
    let sec=this.state.sec-1;
    if(sec===0)
    {
clearInterval(intervel);
this.setState({disable:''})
    }
    this.setState({sec})

  },1000)
 }
// setInterval(this.handleTimer, 1000);
  render() {
    const {mobile, handleChangemobile}=this.props;
    return (
      <div>
        <span className="signupotpcontainer" style={{}}>
          <div className="verifytitle">Verify your sign-up</div>
          <div className="verifyheader">
            Enter the one-time password sent to your mobile number.
          </div>
          <div className="otpmobile">
            <span id="mobileotp">{mobile}</span>{" "}
            <span className="change" onClick={handleChangemobile}>
              Change
            </span>
          </div>
          <span className="za-otp-container field-error" style={{}}>
            <input
              type="text"
              className="form-input"
              tabindex="1"
              name="otp"
              id="otpfield"
              placeholder=""
              style={{ width: "100%", height: "50px" }}
            />
            <span onclick="resendOTP()" className="resendotp" style={this.state.disable?{display:'none'}:{opacity:'block'}}>
              Resend OTP
            </span>{" "}
            <span style={{float:'right',marginTop:'8px'}}>00:{this.state.sec}'s</span>
          </span>{" "}
          <span className="za-submitbtn-otp">
            <input
              type="button"
              tabIndex="1"
              className="signupbtn changeloadbtn"
              value="VERIFY"
              onClick={this.validateOTP}
              name="otpfield"
              placeholder=""
              style={this.state.disable?{opacity:'1'}:{opacity:'0.4'}}
              disabled={this.state.disable?'':'disbilbe'}
            />
            <div className="loadingImg"></div>
          </span>
        </span>
      </div>
    );
  }
}

export default Signotp;
