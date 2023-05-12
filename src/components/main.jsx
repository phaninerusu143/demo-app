import React, { Component } from "react";
import {Link} from 'react-router-dom'
import joi from "joi-browser";
import Form from "./form";
import Signotp from "./signOtp";
import Joi from 'joi';
class Main extends Component {
  state = {
    data: { firstname: "", email: "", password: "", rmobile: "" },
    errors: {},
    otppage:false,
    check:""
    
  };
  // schema = {
  //   firstname: joi.string().required().label("Username"),
  //   email: joi.string()
  //   .email({ tlds: { allow: false } })
  //   .min(5)
  //   .max(250)
  //   .required(),
  //   password:joi.string()
  //   .min(8)
  //     .max(25)
  //     .regex(
  //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //       "password"
  //     ).label('password'),
    
  //   rmobile: joi.string().regex(/^[0-9]{10}$/).required().label("Mobile"),
  //    };
validationRoles={
  firstname:Joi.string().min(2).max(55).required().label('Firstname'),
  email:Joi.string().email({ tlds: { allow: false } }),
  password:Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  .required()
  .label('Password')
  .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  }),
  rmobile:Joi.string()
  .pattern(/^[6-9][0-9]{9}$/) // Pattern for a 10-digit mobile number
  .required()
  .label('Mobile Number')
  .messages({
    'string.pattern.base': 'Enter valid Mobile number must be a valid 10-digit number',
  })

}

schema=Joi.object(this.validationRoles)

  
  validate = () => {
    const { error } = this.schema.validate(this.state.data, {
      abortEarly: false,
    });
    
    if (!error) return null;
    console.log("------>" +error);
    const errors = {};
    for (let t of error.details) {
      

      errors[t.path[0]] = t.message;

      console.log("------>" + errors);
    }
    console.log('data',errors);
    return errors;
  };

  handleCheck = (e) => {
    alert('checked')
    console.log("hi", e.currentTarget.className);
    if (e.currentTarget.className === "") {
      console.log("this condition");


      this.setState({ check: "checked" });
    } else {
      this.setState({ check: "" });
    }
  };
  
    

  validateProperty = ({ name, value }) => {
    console.log('validate property calling');
    const passworderror=new Error('this not pattern')
    

    let dmSchema =Joi.object({
      [name]:this.validationRoles[name],
    });

    const data = {
      [name]: value,
    };
console.log('handle property checking schema',{[name]:this.validationRoles[name]});
const { error } = dmSchema.validate(data);

    console.log('handleError to this handleProperty ..........',error);
    return error ? error.details[0].message :null ;
  };

  handleChange = ({ currentTarget: input }) => {
    let errors = { ...this.state.errors };
    console.log('handle cureent filed in handlechange',input.name)
    const errorMessage = this.validateProperty(input);
    console.log('handleChange in main jsx',errorMessage)
    if (errorMessage){
      console.log('this is errorMessage',errorMessage)
       errors[input.name] = errorMessage;}
    else {delete errors[input.name];}
      
    const data = { ...this.state.data };
    console.log('handlechange in errors object',errors)
    data[input.name] = input.value;
    this.setState({ data, errors });
  };
  handleSubmit =(e)=>
  {
    e.preventDefault();
    alert('hi this main');
    console.log('hii this........................')
    if(!this.state.otppage)
  {
         this.setState({otppage:true})
  }
    
  }
  handleChangemobile=()=>{
    console.log('this is handleChangemobile',this.state.otppage);
    if(this.state.otppage){
      this.setState({otppage:false})
    }
  }
 
  render() {
    // console.log('this is main component state',this.state)
    // console.log('this is main component props',this.props)
    // console.log('this is main component Joi',joi)
console.log('this is render method',this.state.errors);
    return (
      <React.Fragment>
        <main>
          <div className="zw-template-inner">
            <div className="z-signup-page-wrap ">
              <div className="header-part zohodark-bg">
                <a className="logo" href="/" style={{ opacity: " 1;" }}>  
                  ZOHO{" "}
                </a>
                <span className="login-text">
                  Have a Codegene Account?{" "}
                  <Link
                    className="login zgh-login"
                    to='/login'
                  >
                    SIGN IN
                  </Link>
                </span>
              </div>

              <div className="signup-form">
                <div className="z-product">
                  <a href="/people/">
                    <img
                      className="img-responsive"
                      typeof="foaf:Image"
                      src="//www.zohowebstatic.com/sites/zweb/images/producticon/people.svg"
                      width="44"
                      height="44"
                      alt=""
                    />
                    <span>Codegene</span>
                  </a>
                </div>

                <div
                  className="loggedin-userinfo"
                  style={{ display: "none;" }}
                ></div>
                {/* <h3>Start your 30-day free trial</h3> */}
                <div className="region-wrap">
                  <div
                    className="za-region-container"
                    style={{ display: "none;" }}
                  ></div>
                </div>

                <div
                  className="signup-box"
                  style={{ opacity: "1", visibility: "visible" }}
                >
                  <div id="czone-signup" className="czone-dc">

{this.state.otppage?<Signotp mobile={this.state.data.rmobile} handleChangemobile={this.handleChangemobile}></Signotp>:
               <Form onSubmit={this.handleSubmit} onChange={this.handleChange}
                value={this.state} onClick={this.handleDisble} validate={this.validate} handleCheck={this.handleCheck}/> } 



                  </div>
                </div>

                <div className="zw-only-copyright">
                  <p>
                    © 2023, Codegene Corporation Pvt. Ltd. All Rights Reserved.
                  </p>
                </div>
              </div>

              <div className="signup-testimonial-wrap">
                <div
                  className="testimonial-content"
                  style={{ margintop: "201.5px" }}
                >
                  <span>
                    <img
                      typeof="foaf:Image"
                      className="img-responsive"
                      src="//www.zohowebstatic.com/sites/zweb/images/people/people-customer-image.png"
                      width="64"
                      height="64"
                      alt=""
                    />
                  </span>
                  <p>
                    "Our employees all work from home, and they are able to
                    check-in/check out instead of a time-card. We can just pull
                    reports and payday is much easier."
                  </p>
                  <p className="customer-detail">WENDY BALDWIN OF ER4 LOVE.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default Main;
