import React, { Component } from "react";
class Signotp extends Component {
  state = {};
  render() {
    return (
      <div>
        <span className="signupotpcontainer" style={{}}>
          <div className="verifytitle">Verify your sign-up</div>
          <div className="verifyheader">
            Enter the one-time password sent to your mobile number.
          </div>
          <div className="otpmobile">
            <span id="mobileotp">1234567891</span>{" "}
            <span className="change" onclick="gobacktosignuptemp()">
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
            <span onclick="resendOTP()" className="resendotp">
              Resend OTP
            </span>{" "}
          </span>{" "}
          <span className="za-submitbtn-otp">
            <input
              type="button"
              tabIndex="1"
              className="signupbtn changeloadbtn"
              value="VERIFY"
              onclick="validateOTP()"
              name="otpfield"
              placeholder=""
            />
            <div className="loadingImg"></div>
          </span>
        </span>
      </div>
    );
  }
}

export default Signotp;
