import React, { Component } from "react";
import joi from "joi-browser";
import Form from "./form";
class Main extends Component {
  state = {
    data: { firstname: "", email: "", password: "", rmobile: "" },
    password: "password",
    check: "unchecked",
    disbleClass: "zpassword-show",
    errors: {},
  };
  schema = {
    firstname: joi.string().required().label("Username"),
    email: joi.string().required().label("Email"),
    password: joi.string().required().label("Password"),
    rmobile: joi.number().required().label("Mobile"),
  };

  validate = () => {
    const { error } = joi.validate(this.state.data, this.schema, {
      abortEarly: false,
    });
    if (!error) return null;
    const errors = {};
    for (let t of error.details) {
      console.log("------>" + t);

      errors[t.path[0]] = t.message;

      console.log("------>" + errors);
    }
    console.log(errors);
    return errors;
  };

  handleCheck = (e) => {
    console.log("hi", e.currentTarget.className);
    if (e.currentTarget.className === "unchecked") {
      console.log("this condition");

      this.setState({ check: "checked" });
    } else {
      this.setState({ check: "unchecked" });
    }
  };

  validateProperty = ({ name, value }) => {
    const schema = {
      firstname: joi.string().required().label("Name"),
      email: joi.string().email().label("email"),
      password: joi.string().min(8).max(8).label("Password"),
      rmobile: joi.number().min(10).required().label("Mobile Number"),
    };

    const dmSchema = {
      name: schema[name],
    };

    const data = {
      name: value,
    };

    const { error } = joi.validate(data, dmSchema);

    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleDisble = (e) => {
    alert("hi");
    console.log("hi", e.currentTarget.className);
    if (e.currentTarget.className === "zpassword-show") {
      console.log("disble eyee", e.currentTarget.className);
      this.setState({ disbleClass: "zpassword-show active", password: "text" });
    } else {
      this.setState({ disbleClass: "zpassword-show", password: "password" });
    }
  };
  render() {
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
                  <a
                    className="login zgh-login"
                    href="https://accounts.zoho.in/signin?servicename=zohopeople&amp;signupurl=https://www.zoho.com/people/signup.html"
                  >
                    SIGN IN
                  </a>
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
                    <Form
                      value={this.state}
                      handleChange={this.handleChange}
                      handleDisble={this.handleDisble}
                      handleCheck={this.handleCheck}
                    />
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
