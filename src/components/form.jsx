import React, { Component } from "react";
class Form extends Component {
  state = {};
  render() {
    const { state, handleChange, handleDisble, handleCheck } = this.props;
    return (
      <form
        action="//accounts.zoho.in/webclient/v1/register/initiate"
        autocomplete="off"
        className="banner-signup"
        name="signupform"
        id="signupform"
        method="post"
        novalidate="novalidate"
      >
        <input type="hidden" className="langinput" name="language" value="" />

        <div className="signupcontainer">
          {/* //name input Box */}
          <div className="sgfrm za-name-container field-valid">
            <div className="added-placeholder">
              <span className="placeholder">Name *</span>
              <input
                className=""
                id="name"
                name="firstname"
                placeholder=""
                type="text"
                aria-required="true"
                aria-describedby="name-error"
                aria-invalid="false"
                onChange={handleChange}
                value={state.data.firstname}
              />
              <div className="field-msg">
                {state.errors.firstname && (
                  <span id="password-error" className="error jqval-error">
                    {state.errors.firstname}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* //email */}
          <div className="za-email-container sgfrm">
            <div className="added-placeholder">
              <span className="placeholder">Email *</span>
              <input
                className="pending"
                id="email"
                name="email"
                placeholder=""
                type="text"
                aria-invalid="false"
                onChange={handleChange}
                value={state.data.email}
              />

              <div className="field-msg">
                {state.errors.email && (
                  <span id="password-error" className="error jqval-error">
                    {state.errors.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* //password */}
          <div className="za-password-container sgfrm">
            <div
              className="added-placeholder"
              style={{ position: "relative;" }}
            >
              <span className="placeholder">Password *</span>
              <span className={state.disbleClass} onClick={handleDisble}></span>
              <input
                className=""
                id="password"
                name="password"
                placeholder=""
                type={state.password}
                aria-describedby="password-error"
                aria-invalid="true"
                onChange={handleChange}
                value={state.data.password}
              />

              {/* {/* <!--<div className="password-strength" style="display: none;">-->
                    <!--  <div style="width: 10%; background-color: rgb(234, 2, 6);"></div>-->
                    <!--</div>-->}*/}
              <div className="field-msg">
                {state.errors.password && (
                  <span id="password-error" className="error jqval-error">
                    {state.errors.password}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* //mobile */}
          <div className="za-rmobile-container sgfrm rmobiledisabled">
            <div
              align="left"
              className="za-country_code-container added-placeholder"
            >
              <select
                className="za_country_code"
                id="country_code_rmobile"
                onChange="changeCountrycode()"
                name="country_code"
              >
                <option value="AF" dialling_code="93">
                  Afghanistan (+93)
                </option>
                <option value="AL" dialling_code="355">
                  Albania (+355)
                </option>
                <option value="DZ" dialling_code="213">
                  Algeria (+213)
                </option>
                <option value="AS" dialling_code="1">
                  American Samoa (+1)
                </option>
                <option value="AD" dialling_code="376">
                  Andorra (+376)
                </option>
                <option value="AO" dialling_code="244">
                  Angola (+244)
                </option>
                <option value="AI" dialling_code="1">
                  Anguilla (+1)
                </option>
              </select>
              <input
                className="phone_countrycode"
                name="x_phone_countrycode"
                type="hidden"
                value="+91"
                placeholder=""
                mandate="false"
              />
              <div className="ccodelabel" id="countryCodeDiv">
                <div className="ccodediv" id="ccodediv">
                  +91
                </div>
              </div>
              <span className="dialphonenum placeholder">Phone Number *</span>
              <input
                id="rmobile"
                className="dialphone pending"
                name="rmobile"
                placeholder=""
                spellcheck="false"
                type="text"
                aria-invalid="false"
                onChange={handleChange}
                value={state.data.rmobile}
              />
              <div className="field-msg">
                {state.errors.rmobile && (
                  <span id="password-error" className="error jqval-error">
                    {state.errors.rmobile}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* //submit button container //checkbox */}
          <div className="sgnbtnmn">
            <div
              className="za-newsletter-container snews-letter"
              style={{ display: "block" }}
            >
              <label for="newsletter" className="news-signup sign_agree">
                <input
                  tabindex="1"
                  className="za-newsletter"
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  value="true"
                  onclick="toggleNewsletterField()"
                  placeholder=""
                />
                <span
                  className="icon-medium checked"
                  id="signup-newsletter"
                ></span>
                <span>
                  I would like to receive marketing communication from Zoho and
                  Zoho’s regional partners regarding Zoho’s products, services,
                  and events.
                </span>
              </label>
            </div>
            {/* //policy */}
            <div className="za-tos-container">
              <label className="sign_agree" for="tos">
                <input
                  className="za-tos"
                  id="tos"
                  name="tos"
                  onclick="toggleTosField()"
                  type="checkbox"
                  value="false"
                  placeholder=""
                />
                <span
                  className={state.check}
                  onClick={handleCheck}
                  id="signup-termservice"
                >
                  &nbsp;
                </span>
                I agree to the{" "}
                <a
                  href="https://www.zoho.com/terms.html"
                  target="_blank"
                  rel="noopener"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="zrlink"
                  href="https://www.zoho.com/privacy.html"
                  target="_blank"
                  rel="noopener"
                >
                  Privacy Policy
                </a>
                .{" "}
              </label>
            </div>
            {/* //submit */}
            <div className="sgnbtn">
              <input
                className="signupbtn"
                onclick=" return zSignupPrevent();"
                id="signupbtn"
                type="submit"
                value="Free Sign Up"
                style={
                  !this.validate() ? { opacity: " 1" } : { opacity: "0.5" }
                }
                placeholder=""
                disabled
              />
            </div>
          </div>
          {/* //social media */}
          <div className="socl-signup" style={{}}>
            <p>
              <b>or sign in using </b>
              <span
                className="vi-google"
                onclick="FederatedSignIn.GO('GOOGLE');zohoFedClickEvent('Google');"
                title="Google"
                style={{}}
              >
                Google
              </span>
              <span
                className="vi-facebook"
                onclick="FederatedSignIn.GO('FACEBOOK');zohoFedClickEvent('Facebook');"
                title="Facebook"
                style={{ display: "none;" }}
              >
                Facebook
              </span>
              <span
                className="vi-linkedin"
                onclick="FederatedSignIn.GO('LINKEDIN');zohoFedClickEvent('Linkedin');"
                title="Linkedin"
                style={{}}
              >
                Linkedin
              </span>
              <span
                className="vi-twitter"
                onclick="FederatedSignIn.GO('TWITTER');zohoFedClickEvent('Twitter');"
                title="Twitter"
                style={{ display: "none;" }}
              >
                Twitter
              </span>
              <span
                className="vi-office365"
                onclick="FederatedSignIn.GO('AZURE');zohoFedClickEvent('office365');"
                title="Office365"
                style={{}}
              >
                Office365
              </span>
            </p>
          </div>
        </div>
      </form>
    );
  }
}

export default Form;
