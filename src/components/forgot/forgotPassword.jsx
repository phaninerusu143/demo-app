import React, { Component, createRef } from 'react'
import { isNumeric } from 'jquery';
import { pushRoute } from '../pushRoute';
import CaptchaCode from 'react-captcha-code';
class Forgotpassword extends Component {
	state = {
		data:{LOGIN_ID:''},
		visibleField:'',
		captchaCode: ''
	}
	changeHip=()=>
	{
		// alert('calling')
		this.generateCaptcha();
	}
	fieldcontainer=createRef();

	generateCaptcha = () => {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let captchaCode = '';
		for (let i = 0; i < 6; i++) {
		  captchaCode += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		this.setState({ captchaCode });
	  };

	handleChange=(e)=>
	{
	let {data}=this.state;
	data.LOGIN_ID=e.currentTarget.value;
	console.log('handleChange',e.currentTarget.value);
	console.log('handle change filedContainer',this.fieldcontainer);
	if(isNumeric(data.LOGIN_ID)&&!isNaN(this.state.data.LOGIN_ID))
	{
		console.log('your Enter Mobile number',this.fieldcontainer.current.children[0]);
		//const {}=
		const {children}=this.fieldcontainer.current;
		const {children:listOfChilds}=children[0];
		listOfChilds[0].children[0].children[2].style.display='inline';
		listOfChilds[0].children[0].children[2].children[0].className='selection showcountry_code'
		// document.getElementsByName('LOGIN_ID').className='textbox textintent52';
		this.fieldcontainer.current.children[0].children[0].children[0].children[3].className='textbox textintent52';
		console.log('your Enter Mobile number------>',this.fieldcontainer.current.children[0].children[0].children[0].children[3]);

		this.setState({data})
		
		// this.fieldcontainer.current.children[0].map(t=>{console.log(t)});

	}
	else{
		const {children}=this.fieldcontainer.current;
		const {children:listOfChilds}=children[0];
		listOfChilds[0].children[0].children[2].style.display='none';
		listOfChilds[0].children[0].children[2].children[0].className='selection'
		// document.getElementsByName('LOGIN_ID').className='textbox textintent52';
		this.fieldcontainer.current.children[0].children[0].children[0].children[3].className='textbox';
		console.log('your Enter Mobile number------>',this.fieldcontainer.current.children[0].children[0].children[0].children[3]);

		this.setState({data})
	};
	
	}
	handleCaptch=(e)=>
	{
		e.preventDefault();
		const visibleField='captch';
		this.setState({visibleField})
	}
	componentDidMount() { 
		if(this.props.location.state.data.LOGIN_ID){
			this.generateCaptcha();
			const {data}=this.state;
		    data.LOGIN_ID=this.props.location.state.data.LOGIN_ID;
			this.setState({data,visibleField:'visible'})
		}
		
		// this.setState({data});	
	 }
	handleUserid=()=>
	{
		console.log('this is handle user id',this.props.location.state)
		let visibleField='';
		this.setState({visibleField})
		// const {data}=this.state;
		// data.LOGIN_ID=this.props.location.state.data.LOGIN_ID;
		// console.log('this is handle user id',data.LOGIN_ID);

		//this.setState({data});
	}
	firstLoad=()=>
	{
		// alert('first calling');
		var styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.type = 'text/css';
  styles.href = 'https://static.zohocdn.com/iam/v2/components/css/accountrecoveryStyle.4897f35d639639f45dfe9dbbf45edb6b.css';
  document.getElementsByTagName('head')[0].appendChild(styles);
	}
	render() {
		//alert('calling forgot')
		const {state}=this.props.location;
		console.log('this is forgot component state props............',state)
		console.log('checking ref',this.state.visibleField)
		console.log('check styles..');
		return (
			<div className='styles' onLoad={this.firstLoad}>
			<div className="bg_one">
				{/* <div className="bg_one">

				</div> */}
				<div className="Alert">
					<span className="tick_icon"></span>
					<span className="alert_message"></span>
				</div>
				<div className="Errormsg">
					<span className="error_icon"></span>
					<span className="error_message"></span>
				</div>
				<div className="recovery_container container" ref={this.refe}>

					<div className="recovery_box" id="recovery_flow" style={{ display: 'block' }}>

						<div className="service_logo zoho_logo AaaServer"></div>



						<div id="lookup_div" className="recover_sections">

							<div className="info_head">
								<div className="user_info" id="recovery_user_info" style={this.state.visibleField?{ display: 'block' }:{ display: 'none' }}>
									<span className="menutext">{this.state.data.LOGIN_ID}</span>
									<span className="change_user" onClick={this.handleUserid}>Change</span>
								</div>
								<span id="headtitle">Forgot Password</span>
								<div className="head_info" style={this.state.visibleField?{ display: 'none' }:{ fontSize: "15px" }}>Enter your registered email address, mobile number, or username to change your Codegene account password.</div>
							</div>

							<div className="fieldcontainer" ref={this.fieldcontainer}>

								<form name="login_id_container" onsubmit="return accountLookup(event);" novalidate="">
									<div className="searchparent" id="login_id_container" style={this.state.visibleField?{display:'none'}:{display:'block'}}>
										<div className="textbox_div">
											<label htmlFor="country_code_select" className="select_country_code" style={{ display: "none;" }}>+91</label>
											<select id="country_code_select" onchange="changeCountryCode();" tabIndex="-1" className="select2-hidden-accessible" aria-hidden="true" style={{ display: "none;" }}>
												<option data-num="AF" value="+93" id="AF">Afghanistan (+93)</option>
												<option data-num="AL" value="+355" id="AL">Albania (+355)</option>
												<option data-num="DZ" value="+213" id="DZ">Algeria (+213)</option>
												<option data-num="AS" value="+1" id="AS">American Samoa (+1)</option>
												<option data-num="AD" value="+376" id="AD">Andorra (+376)</option>
												<option data-num="AO" value="+244" id="AO">Angola (+244)</option>
												<option data-num="AI" value="+1" id="AI">Anguilla (+1)</option>


											</select><span className="select2 select2-container select2-container--default" dir="ltr" style={{ width: "50px;", display: "none;" }}><span className="selection"><span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabIndex="-1" aria-labelledby="select2-country_code_select-container"><span className="select2-selection__rendered" id="select2-country_code_select-container" title="India (+91)">+91</span><span className="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span className="dropdown-wrapper" aria-hidden="true"></span></span>
											<input id="login_id" placeholder="Email, mobile, or username" type="email" name="LOGIN_ID" className="textbox" required="" onChange={this.handleChange} autocapitalize="off" autocomplete="on" autocorrect="off" tabIndex="1" value={this.state.data.LOGIN_ID} />
											<div className="fielderror"></div>
										</div>
									</div>


									<div className="textbox_div" id="captcha_container" style={this.state.visibleField?{display:'block'}:{display:'none'}}>
										<div id="captcha_img" name="captcha" className="textbox" style={{}}>
										<img src={`https://dummyimage.com/150x50/ffffff/000000.png&text=${this.state.captchaCode}`} alt="CAPTCHA" align='left' style={{mixBlendMmode: "multiply" ,marginLeft:'-68px'}} id="hip" />

										</div>
										<span className="reloadcaptcha icon-reload" onClick={this.changeHip} style={{top:"59px"}}> </span>
										<input id="captcha" placeholder="Enter CAPTCHA" type="text" name="captcha" className="textbox" required="" onkeypress="clearCommonError('captcha'),removeCaptchaError()" autocapitalize="off" autocomplete="off" autocorrect="off" maxlength="8" />
										<div className="fielderror"></div>
									</div>
									<span className="captchafielderror"></span>
									<button className="btn blue" id="nextbtn" tabIndex="2" onClick={this.handleCaptch}><span>Next</span></button>
								</form>

							</div>




						</div>


						<div id="lookup_err_div" className="recover_sections hide">

							<div className="info_head">

								<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
									<span className="menutext"></span>
									<span className="change_user">Change</span>
								</div>

								<span id="headtitle">Cannot reset password</span>
								<div className="head_info" style={{ color: "#D61212;" }}>You are not allowed to reset your password as your organization admin has enforced Custom SSO authentication for your account.</div>
							</div>


						</div>

						<div id="Last_password_div" className="recover_sections">

							<div className="info_head">

								<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
									<span className="menutext"></span>
									<span className="change_user">Change</span>
								</div>
								<span id="headtitle">Forgot Password</span>
								<div className="head_info">Enter the last password you remember with this Zoho account. If it matches, you can continue to sign in.</div>
							</div>

							<div className="fieldcontainer">

								<form name="last_password_container" onsubmit="return false;" novalidate="">
									<div className="searchparent" id="last_password_container">
										<div className="textbox_div">
											<input id="last_password" placeholder="Enter last password" type="password" name="last_password" className="textbox" required="" onkeypress="clearCommonError('last_password')" autocapitalize="off" autocorrect="off" tabIndex="1" />
											<span className="icon-hide show_hide_password" onclick="showHidePassword();"></span>
											<div className="fielderror"></div>
										</div>
									</div>

									<button className="btn blue" onclick="last_pwd_ckeck()" id="last_pwd_submit" tabIndex="2"><span>Verify Password</span></button>
								</form>

							</div>

							<div className="bottom_line_opt"><div className="bottom_option" id="dont_remember" onclick="initialize_recoveryModes()">Continue to reset password</div></div>

						</div>

						<div id="password_matched_div" className="recover_sections">

							<div className="info_head">
								<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
									<span className="menutext"></span>
									<span className="change_user">Change</span>
								</div>
								<span id="headtitle">Password matched</span>
								<div className="head_info">The password you entered matches with your current Codegene account password.</div>
							</div>

							<div className="fieldcontainer">
								<button className="btn blue" onclick="last_pwd_redirect('signin')" id="last_pwd_audit" tabIndex="2"><span>Continue to sign in</span></button>
							</div>

							<div className="bottom_line_opt"><div className="bottom_option" id="continue_pwd_reset" onclick="last_pwd_redirect('fp')">Reset password anyway</div></div>

						</div>


						<div id="username_div" className="recover_sections">

							<div className="info_head">

								<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
									<span className="menutext"></span>
									<span className="change_user" onclick={this.handleUserid}>Change</span>
								</div>

								<span id="headtitle">Forgot Password</span>
								<div className="head_info">A one-time password (OTP) will be sent to your registered mobile number for verification.</div>
							</div>

							<div className="fieldcontainer">
								<button className="btn blue" id="username_select_action" onclick="call_recusernameScreen()" tabIndex="2"><span>Send OTP</span></button>
							</div>

							<div className="bottom_line_opt"><div className="bottom_option rec_modes_other_options" onclick="show_other_options()">View all options</div></div>

							<div className="bottom_line_opt"><div className="bottom_option rec_modes_contact_support hide" onclick="show_contactsupport()">Contact Support</div></div>

						</div>

						<div id="other_options_div" className="recover_sections">

							<div className="info_head">

								<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
									<span className="menutext"></span>
									<span className="change_user">Change</span>
								</div>

								<div><span className="icon-backarrow backoption" onclick="show_confirm_username_screen()" id="recovery_usernamescreen_bk"></span>
									<span id="headtitle">Verify your identity</span></div>
								<div className="head_info">Choose a mode to verify that this account belongs to you.</div>
							</div>

							<div className="fieldcontainer">

								<div className="optionstry optionmod" id="recover_via_passkey" onclick="initPasskeyOption()">
									<div className="img_option_try img_option icon-password"></div>
									<div className="option_details_try">
										<div className="option_title_try">Verify via Passkey</div>
										<div className="option_description try_option_desc">If your passkey is not synced with this device, scan the QR code shown using a passkey-synced device.</div>
									</div>
								</div>
								<div className="optionstry optionmod" id="recover_via_device" onclick="show_recDeviceScreen()">
									<div className="img_option_try img_option icon-device"></div>
									<div className="option_details_try">
										<div className="option_title_try">Verify via device</div>
										<div className="option_description try_option_desc">A notification will be sent to your OneAuth installed recovery device for verification.</div>
									</div>
								</div>

								<div className="optionstry optionmod" id="recover_via_email" onclick="show_recEmailScreen()">
									<div className="img_option_try img_option icon-email"></div>
									<div className="option_details_try">
										<div className="option_title_try">Verify via email address</div>
										<div className="option_description try_option_desc">An OTP will be sent to your registered email address.</div>
									</div>
								</div>

								<div className="optionstry optionmod" id="recover_via_mobile" onclick="show_recMobScreen()">
									<div className="img_option_try img_option icon-otp"></div>
									<div className="option_details_try">
										<div className="option_title_try">Verify via mobile number</div>
										<div className="option_description try_option_desc">An OTP will be sent to your registered mobile number.</div>
									</div>
								</div>

								<div className="optionstry optionmod" id="recover_via_domain" onclick="show_recDomainScreen()">
									<div className="img_option_try img_option icon-domain"></div>
									<div className="option_details_try">
										<div className="option_title_try">Verify via domain</div>
										<div className="option_description try_option_desc">Prove the ownership of your domain by adding a CNAME record in your domain host.</div>
									</div>
								</div>


								<div className="bottom_line_opt"><div className="bottom_option" id="contact_support" onclick="show_contactsupport()">Contact Support</div></div>

							</div>

						</div>

						<div id="confirm_otp_div" className="recover_sections">

							<div className="info_head">

								<div className="user_info_space user_info" id="rec_username_user_info" onclick="change_user()" style={{ display: "none;" }}>
									<span className="menutext"></span>
									<span className="change_user">Change</span>
								</div>
								<div><span className="icon-backarrow backoption only_two_recmodes" onclick="show_confirm_username_screen()"></span>
									<span id="headtitle">Forgot Password</span></div>
								<div className="head_info">Enter the one-time password sent to <span className="bold_font">{0}</span>.</div>
							</div>

							<div className="fieldcontainer">

								<form name="confirm_otp_container" onsubmit="return false;">
									<div className="searchparent" id="confirm_otp_container">
										<div className="textbox_div">
											<div id="confirm_otp" className="otp_container"></div>
											<input type="hidden" className="hide" id="username_mdigest" value="" />
											<div className="textbox_actions">
												<span id="otp_resend" className="bluetext_action resendotp nonclickelem"></span>
												<div className="resend_text otp_sent" id="otp_sent" style={{ display: "none;" }}>OTP sending</div>
											</div>
											<div className="fielderror"></div>
										</div>
									</div>

									<button className="btn blue" onclick="username_confimation_action()" id="otp_confirm_submit" tabIndex="2"><span>Verify</span></button>
								</form>

								<div className="bottom_line_opt"><div className="bottom_option rec_modes_other_options" onclick="show_other_options()">View all options</div></div>

								<div className="bottom_line_opt"><div className="bottom_option rec_modes_contact_support hide" onclick="show_contactsupport()">Contact Support</div></div>

							</div>

						</div>

						<div id="recovery_domian_div" className="recover_sections">

							<div className="hide domain_section" id="domain_verification_infostep">

								<div className="info_head">

									<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
										<span className="menutext"></span>
										<span className="change_user">Change</span>
									</div>

									<div><span className="icon-backarrow backoption only_two_recmodes" onclick="show_confirm_username_screen()"></span>
										<span id="headtitle">How to verify via domain</span></div>

								</div>

								<div className="fieldcontainer">

									<ol className="domain_verifictaion_steps">
										<li>Enter the domain name that is associated with your Zoho account.</li>
										<li>Enter an email address to receive instructions on how to prove your domain ownership.</li>
										<li>Follow the emailed instructions to add a CNAME record in your domain host.</li>
										<li>Once the CNAME record is added, click the <b>Change Password </b>link given below the instructions.</li>
									</ol>


									<button className="btn blue" onclick="domian_verification_select()" id="otp_confirm_submit" tabIndex="2"><span>Continue</span></button>

								</div>

							</div>

							<div className="hide domain_section" id="select_domain_verification">

								<div className="info_head">

									<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
										<span className="menutext"></span>
										<span className="change_user">Change</span>
									</div>

									<div><span className="icon-backarrow backoption" onclick="$(&quot;#recovery_domian_div .domain_section&quot;).hide();$(&quot;#recovery_domian_div #domain_verification_infostep&quot;).show();"></span>
										<span id="headtitle">Choose a domain</span></div>

									<div className="head_info">You have {0} verified domains associated with your account. Select the domain you want to continue with.</div>
								</div>

								<div className="fieldcontainer">

								</div>

								<div className="hide empty_domain_template">

									<div className="optionstry optionmod" id="recovery_domain" onclick="show_recovery_domain_confirmationscreen()">
										<div className="img_option_try img_option icon-domain"></div>
										<div className="option_details_try">
											<div className="option_title_try"></div>
										</div>
									</div>

								</div>

								<div className="bottom_line_opt"><div className="bottom_option rec_modes_other_options" onclick="show_other_options()">View all options</div></div>

								<div className="bottom_line_opt"><div className="bottom_option rec_modes_contact_support hide" onclick="show_contactsupport()">Contact Support</div></div>

							</div>

							<div className="hide domain_section" id="confirm_domain_verification">

								<div className="info_head">

									<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
										<span className="menutext"></span>
										<span className="change_user">Change</span>
									</div>

									<div><span className="icon-backarrow backoption" onclick="domian_verification_select();"></span>
										<span id="headtitle">Enter domain name</span></div>

									<div className="head_info"><b>{0} </b>is a verified domain associated with your account. Enter this domain name below.</div>
								</div>

								<div className="fieldcontainer">

									<form name="domain_confirm_container" onsubmit="return false;">
										<div className="searchparent" id="domain_confirm_container">
											<div className="textbox_div">
												<input type="hidden" className="hide" id="selected_encrypt_domain" value="" />
												<input id="domain_confirm" maxlength="253" placeholder="Enter domain name" name="domain_confirm" className="textbox" required="" onkeypress="clearCommonError('domain_confirm')" autocapitalize="off" autocorrect="off" tabIndex="1" />
												<div className="fielderror"></div>
											</div>
										</div>

										<button className="btn blue" onclick="domian_verification_confim()" id="domain_confirm_submit" tabIndex="2"><span>Next</span></button>
									</form>


								</div>

								<div className="bottom_line_opt"><div className="bottom_option rec_modes_other_options" onclick="show_other_options()">View all options</div></div>

								<div className="bottom_line_opt"><div className="bottom_option rec_modes_contact_support hide" onclick="show_contactsupport()">Contact Support</div></div>


							</div>

							<div className="hide domain_section" id="domain_email_verification">

								<div className="info_head">

									<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
										<span className="menutext"></span>
										<span className="change_user">Change</span>
									</div>

									<div><span className="icon-backarrow backoption" onclick="$(&quot;#recovery_domian_div .domain_section&quot;).hide();$(&quot;#recovery_domian_div #domain_verification_infostep&quot;).show();"></span>
										<span id="headtitle">Enter an email address</span></div>

									<div className="head_info">Enter an email address to receive instructions on how to prove your domain ownership.</div>
								</div>

								<div className="fieldcontainer">

									<form name="domain_email_confirm_container" onsubmit="return false;">
										<div className="searchparent" id="domain_email_confirm_container">
											<div className="textbox_div">
												<input type="hidden" className="hide" id="contact_encrypt_domain" value="" />
												<input id="domain_email_confirm" maxlength="320" placeholder="Enter email address" name="domain_email_confirm" className="textbox" required="" onkeypress="clearCommonError('domain_email_confirm')" autocapitalize="off" autocorrect="off" tabIndex="1" />
												<div className="fielderror"></div>
											</div>
										</div>

										<button className="btn blue" onclick="domian_email_confim()" id="domain_email_confirm_submit" tabIndex="2"><span>Send Email</span></button>
									</form>


								</div>

								<div className="bottom_line_opt"><div className="bottom_option rec_modes_other_options" onclick="show_other_options()">View all options</div></div>

								<div className="bottom_line_opt"><div className="bottom_option rec_modes_contact_support hide" onclick="show_contactsupport()">Contact Support</div></div>


							</div>

							<div className="hide domain_section" id="domain_reset_instruction">

								<div className="info_head">

									<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none;" }}>
										<span className="menutext"></span>
										<span className="change_user">Change</span>
									</div>

									<span id="headtitle">Follow the emailed instructions</span>
									<div className="head_info">Instructions to prove ownership of the domain <b>{0}</b> have been sent to the email address <b>{1}</b>.</div>
								</div>
								<div className="fieldcontainer">
									Once you complete the steps, click the <b>Change Password</b> link given below the instructions.							</div>

							</div>


						</div>

						<div id="recovery_device_div" className="recover_sections">

							<div className="info_head">
								<span className="icon-backarrow backoption only_two_recmodes" onclick="show_confirm_username_screen()"></span>
								<span id="headtitle">Verify via device</span>
								<div className="head_info">Accept the push notification sent to your recovery device to verify yourself.</div>
							</div>

							<div className="fieldcontainer">
								<div className="devices">
									<select className="secondary_devices" id="recovery_device_select" onchange="changeRECOVERYSecDevice(this);"></select>
								</div>
								<div id="rnd_number" style={{ display: "none;" }}></div>
								<button className="btn blue hide" id="device_rec_wait" tabIndex="2"><span>Waiting for approval</span></button>
								<button className="btn blue hide" id="device_rec_resend" onclick="changeRECOVERYSecDevice($('#recovery_device_select'))" tabIndex="1"><span>Resend push notification</span></button>
								<div className="resend_label">
									<span id="otp_resend" className="resendotp push_resend"></span>
									<span className="rnd_resend_push">Resend push notification</span>
								</div>

							</div>

							<div className="bottom_line_opt"><div className="bottom_option rec_modes_other_options" onclick="show_other_options()">View all options</div></div>

							<div className="bottom_line_opt"><div className="bottom_option rec_modes_contact_support hide" onclick="show_contactsupport()">Contact Support</div></div>
						</div>



						<div id="email_confirm_div" className="recover_sections">

							<div id="confirm_reocvery_email">

								<div className="info_head">
									<span className="icon-backarrow backoption only_two_recmodes" onclick="show_confirm_username_screen()"></span>
									<span id="headtitle">Verify via email address</span>
									<div className="head_info">You can verify yourself using your recovery email address <span className="bold_font">{0}</span>. <div style={{ marginTop: "20px" }}>Enter the full email address to receive a one-time password.</div></div>
								</div>

								<div className="fieldcontainer">

									<form name="email_confirm_container" onsubmit="return false;">
										<div className="searchparent" id="email_confirm_container">
											<div className="textbox_div">
												<input type="hidden" className="hide" id="selected_encrypt_email" value="" />
												<input id="email_confirm" placeholder="Enter Email Address" name="email_confirm" className="textbox" required="" onkeypress="clearCommonError('email_confirm')" autocapitalize="off" autocorrect="off" tabIndex="1" />
												<div className="fielderror"></div>
											</div>
										</div>

										<button className="btn blue" id="emailconfirm_action" onclick="email_confirmation()" tabIndex="2"><span>Send OTP</span></button>
									</form>

								</div>

							</div>


							<div id="select_reocvery_email">

								<div className="info_head">
									<span className="icon-backarrow backoption only_two_recmodes" onclick="show_confirm_username_screen()"></span>
									<span id="headtitle">Verify via email address</span>
									<div className="head_info">You've added <span className="bold_font">{0}</span> recovery email address. Verify yourself by selecting one of the following to reset your password.</div>
								</div>

								<div className="fieldcontainer">
								</div>

								<div className="hide empty_email_template">

									<div className="optionstry optionmod" id="recovery_email" onclick="show_recovery_email_confirmationscreen()">
										<div className="img_option_try img_option icon-email"></div>
										<div className="option_details_try">
											<div className="option_title_try"></div>
											<input type="hidden" className="hide" id="encrypt_recovery_email" value="" />
										</div>
									</div>

								</div>

							</div>

							<div className="bottom_line_opt"><div className="bottom_option rec_modes_other_options" onclick="show_other_options()">View all options</div></div>

							<div className="bottom_line_opt"><div className="bottom_option rec_modes_contact_support hide" onclick="show_contactsupport()">Contact Support</div></div>

						</div>

						<div id="mobile_confirm_div" className="recover_sections">

							<div id="confirm_reocvery_mobile">

								<div className="info_head">
									<span className="icon-backarrow backoption only_two_recmodes" onclick="show_confirm_username_screen()"></span>
									<span id="headtitle">Verify via mobile number</span>
									<div className="head_info">You can verify yourself using your mobile number <span className="bold_font">{0}</span>. <div style={{ marginTop: "20px" }}>Enter the full mobile number to receive a one-time password.</div></div>
								</div>

								<div className="fieldcontainer">

									<form name="mobile_confirm_container" onsubmit="return false;">
										<div className="searchparent" id="mobile_confirm_container">
											<div className="textbox_div">
												<input type="hidden" className="hide" id="selected_encrypt_mobile" value="" />
												<input id="mobile_confirm" placeholder="Enter Mobile Number" name="mobile_confirm" className="textbox" required="" oninput="this.value = this.value.replace(/[^\d]+/g,'')" onkeypress="clearCommonError('mobile_confirm')" autocapitalize="off" autocorrect="off" tabIndex="1" />
												<div className="fielderror"></div>
											</div>
										</div>

										<button className="btn blue" id="mobconfirm_action" onclick="mobile_confirmation()" tabIndex="2"><span>Send OTP</span></button>
									</form>

								</div>

							</div>

							<div id="select_reocvery_mobile">

								<div className="info_head">
									<span className="icon-backarrow backoption only_two_recmodes" onclick="show_confirm_username_screen()"></span>
									<span id="headtitle">Verify via mobile number</span>
									<div className="head_info">You've added <span className="bold_font">{0}</span> recovery mobile numbers. Verify yourself by selecting one of the following to reset your password.</div>
								</div>

								<div className="fieldcontainer">
								</div>

								<div className="hide empty_mobile_template">

									<div className="optionstry optionmod" id="recovery_mob" onclick="show_recovery_mobilenum_confirmationscreen()">
										<div className="img_option_try img_option icon-otp"></div>
										<div className="option_details_try">
											<div className="option_title_try"></div>
										</div>
									</div>

								</div>

							</div>

							<div className="bottom_line_opt"><div className="bottom_option rec_modes_other_options" onclick="show_other_options()">View all options</div></div>

							<div className="bottom_line_opt"><div className="bottom_option rec_modes_contact_support hide" onclick="show_contactsupport()">Contact Support</div></div>

						</div>

						{/* <!--MFA OPTIONS --> */}

						<div id="other_mfaoptions_div" className="recover_sections">

							<div className="info_head" style={{ display: 'none' }}>
								<div className="user_info_space user_info" id="recovery_user_info" onclick="change_user()" style={{ display: "none" }}>
									<span className="menutext"></span>
									<span className="change_user">Change</span>
								</div>
								<span id="headtitle">MFA Verification</span>
								<div className="head_info">You've enabled multi-factor authentication (MFA) for your Zoho account. Complete MFA to  change your account password.</div>
							</div>

							<div className="fieldcontainer" style={{ display: 'none' }}>


								<div className="optionstry optionmod" id="mfa_via_device" onclick="show_MfaDeviceScreen()">
									<div className="img_option_try img_option icon-device"></div>
									<div className="option_details_try">
										<div className="option_title_try">OneAuth Verification</div>
										<div className="option_description try_option_desc">Use the OneAuth app to verify yourself.</div>
									</div>
								</div>

								<div className="optionstry optionmod" id="mfa_via_totp" onclick="show_MfaTotpScreen()">
									<div className="img_option_try img_option icon-totp"></div>
									<div className="option_details_try">
										<div className="option_title_try">Authenticator app</div>
										<div className="option_description try_option_desc">Enter the time-based OTP from your authenticator app.</div>
									</div>
								</div>

								<div className="optionstry optionmod" id="mfa_via_otp" onclick="show_MfaOtpScreen()">
									<div className="img_option_try img_option icon-otp"></div>
									<div className="option_details_try">
										<div className="option_title_try">SMS Verification</div>
										<div className="option_description try_option_desc">A one-time password will be sent to your mobile number.</div>
									</div>
								</div>

								<div className="optionstry optionmod" id="mfa_via_yubikey" onclick="show_MfaYubikeyScreen()">
									<div className="img_option_try img_option icon-yubikey"></div>
									<div className="option_details_try">
										<div className="option_title_try">Verify via security key</div>
										<div className="option_description try_option_desc">Connect the security key to the computer and proceed.</div>
									</div>
								</div>


								<div className="bottom_line_opt"><div className="bottom_option" onclick="show_contactsupport()">Contact Support</div></div>

							</div>

						</div>

						<div id="mfa_totp_section" className="recover_sections">

							<div className="info_head">
								<span className="icon-backarrow backoption mfa_backoption" onclick="show_mfa_other_options()"></span>
								<span id="headtitle">MFA Verification</span>
								<div className="head_info">Enter the OTP generated on your authenticator app</div>
							</div>

							<div className="fieldcontainer">

								<form name="mfa_totp_container" onsubmit="return false;">
									<div className="searchparent" id="mfa_totp_container">
										<div className="textbox_div">
											<div id="mfa_totp" className="otp_container"></div>
											<div className="fielderror"></div>
										</div>
									</div>

									<button className="btn blue" onclick="mfa_totp_confimration()" id="mfa_totp_submit" tabIndex="2"><span>Verify</span></button>
								</form>

							</div>

							<div className="bottom_line_opt"><div className="bottom_option show_mfa_options" onclick="show_mfa_other_options()">Try other MFA modes</div></div>
							<div className="bottom_line_opt"><div className="bottom_option show_mfa_support_options" onclick="show_contactsupport()">Contact Support</div></div>

						</div>

						<div id="mfa_otp_section" className="recover_sections">

							<div id="mfa_otp_confirm" className="hide">

								<div className="info_head">
									<span className="icon-backarrow backoption mfa_backoption" onclick="show_mfa_other_options()"></span>
									<span id="headtitle">MFA Verification</span>
									<div className="head_info">Enter the OTP sent to {0}</div>
								</div>

								<div className="fieldcontainer">

									<form name="mfa_otp_container" onsubmit="return false;">
										<div className="searchparent" id="mfa_otp_container">
											<div className="textbox_div">
												<input type="hidden" id="mfa_otp_decoded" className="hide" value="" />
												<input type="hidden" id="mfa_otp_enc" className="hide" value="" />
												<input type="hidden" id="mfa_otp_mdigest" className="hide" value="" />
												<div id="mfa_otp" className="otp_container"></div>
												<div className="textbox_actions">
													<span id="otp_resend" className="bluetext_action resendotp nonclickelem"></span>
													<div className="resend_text otp_sent" id="otp_sent" style={{ display: "none" }}>OTP sending</div>
												</div>
												<div className="fielderror"></div>
											</div>
										</div>

										<button className="btn blue" onclick="mfa_otp_confimration()" id="mfa_otp_submit" tabIndex="2"><span>Verify</span></button>
									</form>

								</div>

								<div className="bottom_line_opt"><div className="bottom_option show_mfa_otp_options" id="mfa_otp_view_otherMFA_options" onclick="show_mfa_other_options()">Try other MFA modes</div></div>
								<div className="bottom_line_opt"><div className="bottom_option show_mfa_options" id="mfa_otp_view_other_options" onclick="show_mfa_otp_other_options()">Try other MFA numbers</div></div>
								<div className="bottom_line_opt"><div className="bottom_option show_mfa_support_options" id="mfa_otp_contactsupport" onclick="show_contactsupport()">Contact Support</div></div>

							</div>

							<div id="mfa_otp_select" className="hide">

								<div className="info_head">
									<span className="icon-backarrow backoption mfa_backoption" onclick="show_mfa_other_options()"></span>
									<span id="headtitle">MFA Verification</span>
									<div className="head_info">You've added <span className="bold_font">{0}</span> MFA mobile numbers. Verify yourself by selecting one of the following to reset your password.</div>
								</div>

								<div className="fieldcontainer">
								</div>

								<div className="hide empty_mfa_mob_template">

									<div className="optionstry optionmod" id="mfa_mobile" onclick="select_mfa_mob()">
										<div className="img_option_try img_option icon-otp"></div>
										<div className="option_details_try">
											<div className="option_title_try"></div>
										</div>
									</div>
								</div>


								<div className="bottom_line_opt"><div className="bottom_option show_mfa_options" onclick="show_mfa_other_options()">Try other MFA modes</div></div>
								<div className="bottom_line_opt"><div className="bottom_option show_mfa_support_options" onclick="show_contactsupport()">Contact Support</div></div>

							</div>

						</div>

						<div id="mfa_yubikey_section" className="recover_sections">

							<div className="info_head">
								<span className="icon-backarrow backoption mfa_backoption" onclick="show_mfa_other_options()"></span>
								<span id="headtitle">MFA Verification</span>
								<div className="head_info">Please insert a configured security key into your computer. When the security key starts blinking, tap on its disc.</div>
							</div>

							<div className="fieldcontainer">



								<div className="devices" id="list_mfa_yubikeys">
									<select className="secondary_devices" id="mfa_yubikey_select" onchange="changeMFAYubikey(this);"></select>
								</div>

								<button className="btn blue" onclick="changeMFAYubikey($('#mfa_yubikey_select'))" id="mfa_yubikey_submit" style={{ display: "inline-block;" }}>
									<span className="loadwithbtn hide"></span>
									<span className="waittext">Waiting for approval</span>
								</button>

							</div>

							<div className="bottom_line_opt"><div className="bottom_option show_mfa_options" onclick="show_mfa_other_options()">Try other MFA modes</div></div>
							<div className="bottom_line_opt"><div className="bottom_option show_mfa_support_options" onclick="show_contactsupport()">Contact Support</div></div>

						</div>

						<div id="mfa_device_section" className="recover_sections">

							<div id="mfa_device_push_slide" className="mfa_device_sliodes hide">

								<div className="info_head">
									<span className="icon-backarrow backoption mfa_backoption" onclick="show_mfa_other_options()"></span>
									<span id="headtitle">Verify push notification</span>
									<div className="head_info">Accept the push notification in OneAuth to reset your account password.</div>
								</div>

								<div className="fieldcontainer">

									<div className="devices" id="list_mfa_devices">
										<select className="secondary_devices" id="mfa_device_select" onchange="changeMFADevice(this);"></select>
									</div>

									<button className="btn hide" id="device_MFA_wait" tabIndex="1"><span>Waiting for approval</span></button>
									<button className="btn blue hide" id="device_MFA_resend" onclick="changeMFADevice($('#mfa_device_select'))" tabIndex="1"><span>Resend push notification</span></button>
									<div className="resend_label hide">
										<span id="otp_resend" className="resendotp push_resend"></span>
									</div>
								</div>

								<div className="bottom_line_opt"><div className="bottom_option mfa_device_screens" onclick="show_mfa_device_other_options(&quot;1&quot;)">Try other OneAuth modes</div></div>

								<div className="bottom_line_opt"><div className="bottom_option show_mfa_options" onclick="show_mfa_other_options()">Try other MFA modes</div></div>
								<div className="bottom_line_opt"><div className="bottom_option show_mfa_support_options" onclick="show_contactsupport()">Contact Support</div></div>

							</div>

							<div id="mfa_device_totp_slide" className="mfa_device_sliodes hide">

								<div className="info_head">
									<span className="icon-backarrow backoption mfa_device_bk_button" id=""></span>
									<span id="headtitle">Enter time-based OTP</span>
									<div className="head_info">Open OneAuth, tap <span className="trydesc">Sign in another way</span>, and enter it here to reset your account password.</div>
								</div>

								<div className="fieldcontainer">

									<div className="searchparent" id="mfa_device_totp_container">
										<div className="textbox_div">
											<div id="mfa_device_totp" className="otp_container textbox"></div>
											<div className="fielderror"></div>
										</div>
									</div>

									<button className="btn blue" onclick="mfa_devicetotp_confimration()" id="mfa_device_TOTP_submit" tabIndex="2"><span>Verify</span></button>

								</div>

								<div className="bottom_line_opt"><div className="bottom_option mfa_device_screens" onclick="show_mfa_device_other_options(&quot;2&quot;)">Try other OneAuth modes</div></div>

								<div className="bottom_line_opt"><div className="bottom_option show_mfa_options" onclick="show_mfa_other_options()">Try other MFA modes</div></div>
								<div className="bottom_line_opt"><div className="bottom_option show_mfa_support_options" onclick="show_contactsupport()">Contact Support</div></div>

							</div>

							<div id="mfa_device_qr_slide" className="mfa_device_sliodes hide">

								<div className="info_head">
									<span className="icon-backarrow backoption mfa_device_bk_button" id=""></span>
									<span id="headtitle">Scan QR code</span>
									<div className="head_info">Scan the QR code using OneAuth to reset your account password</div>
								</div>

								<div className="fieldcontainer">

									<div className="qrcodecontainer">
										<span className="qr_before"></span>
										<img id="qrimg" src="" />
										<span className="qr_after"></span>
									</div>

								</div>

								<div className="bottom_line_opt"><div className="bottom_option mfa_device_screens" onclick="show_mfa_device_other_options(&quot;3&quot;)">Try other OneAuth modes</div></div>

								<div className="bottom_line_opt"><div className="bottom_option show_mfa_options" onclick="show_mfa_other_options()">Try other MFA modes</div></div>
								<div className="bottom_line_opt"><div className="bottom_option show_mfa_support_options" onclick="show_contactsupport()">Contact Support</div></div>


							</div>

							<div id="mfa_device_options_slide" className="mfa_device_sliodes hide">

								<div className="info_head">
									<span className="icon-backarrow backoption mfa_device_bk_button" id=""></span>
									<span id="headtitle">Alternate verification</span>
									<div className="head_info">You've enabled multi-factor authentication (MFA) for your Zoho account. Complete MFA to  change your account password.</div>
								</div>

								<div className="fieldcontainer">


									<div className="optionstry optionmod" id="mfa_via_device_totp" onclick="tryThisOption(this)">
										<div className="img_option_try img_option icon-totp"></div>
										<div className="option_details_try">
											<div className="option_title_try">Offline TOTP verification</div>
											<div className="option_description try_option_desc">Open OneAuth, tap <span className="trydesc">Sign in another way</span>, and enter it here to reset your account password.</div>
										</div>
										<div className="otp_verify option_detail verify_device_totp_container hide" id="verify_device_totp_container">
											<div id="verify_device_totp" className="otp_container mini_txtbox"></div>
											<button className="btn blue mini_btn" id="mfa_device_totp_verifybtn" tabIndex="2" onclick="mfa_devicetotp_confimration('true')">
												<span className="loadwithbtn hide"></span>
												<span className="waittext">Verify</span>
											</button>
											<div className="fielderror"></div>
										</div>
									</div>

									<div className="optionstry optionmod" id="mfa_via_device_qr" onclick="tryThisOption(this)">
										<div className="img_option_try img_option icon-qr"></div>
										<div className="option_details_try">
											<div className="option_title_try">Scan QR verification</div>
											<div className="option_description try_option_desc">Open OneAuth and tap <span className="trydesc">Sign in another way</span>. Tap <span className="trydesc">Scan QR instead</span> to open code scanner.</div>
										</div>
										<div className="verify_qr option_detail verify_device_qr_container hide" id="verify_device_qr_container">
											<div className="qrcodecontainer">
												<div>
													<span className="qr_before"></span>
													<img id="verify_qrimg" src="" />
													<span className="qr_after"></span>
													<div className="loader" style={{ display: "none;" }}></div>
													<div className="blur_elem blur" style={{ display: "none;" }}></div>
												</div>
											</div>
										</div>
									</div>

									<div className="bottom_line_opt"><div className="bottom_option show_mfa_options" onclick="show_mfa_other_options()">Try other MFA modes</div></div>
									<div className="bottom_line_opt"><div className="bottom_option show_mfa_support_options" onclick="show_contactsupport()">Contact Support</div></div>

								</div>

							</div>

						</div>



						<div id="change_password_div" className="recover_sections">

							<div className="info_head">
								<span id="headtitle">Create New Password</span>
								<div className="head_info">Enter a unique and strong password that is easy to remember so that you won't forget it the next time.</div>
							</div>

							<div className="fieldcontainer">

								<form id="reset_password_form" name="change_password_container" onsubmit="return chnage_password(event);" novalidate="">

									<div className="searchparent" id="change_password_container">
										<div className="textbox_div">
											<input id="change_password" placeholder="New Password" type="password" name="change_password" className="textbox" required="" onkeyup="check_pass();" autocapitalize="off" autocorrect="off" tabIndex="1" />
											<span className="icon-hide show_hide_password" onclick="showHidePassword('change_password');"></span>
											<div className="fielderror"></div>
										</div>
									</div>

									<div className="searchparent" id="reneter_password_container">
										<div className="textbox_div">
											<input id="reneter_password" placeholder="Confirm New Password" type="password" name="reneter_password" className="textbox" required="" onkeypress="clearCommonError('reneter_password')" autocapitalize="off" autocorrect="off" tabIndex="1" />
											<div className="fielderror"></div>
										</div>
									</div>

									<button className="btn blue" type="submit" id="reset_password_submit" tabIndex="2"><span>Change Password</span></button>
								</form>

							</div>

							<div className="bottom_line_opt"><div className="bottom_option" id="contact_support" onclick="show_contactsupport()">Contact Support</div></div>


						</div>


						<div id="terminate_session_div" className="recover_sections">

							<div className="info_head">
								<span id="headtitle">Terminate Sessions</span>
								<div className="head_info">Apart from changing your password, you can perform the following action if you feel your account is compromised.</div>
							</div>

							<div className="fieldcontainer">

								<form id="terminate_session_form" name="terminate_session_container" onsubmit="return send_terminate_session_request(this);" novalidate="">
									<div id="change_second">
										<div className="searchparent" id="terminate_web_sess">
											<div className="checkbox_div" style={{ padding: "10px;", marginTop: "10px" }}>
												<input data-validate="zform_field" id="ter_all" name="clear_web" className="checkbox_check" type="checkbox" value="" />
												<span className="checkbox">
													<span className="checkbox_tick"></span>
												</span>
												<label htmlFor="ter_all" className="session_label">
													<span className="checkbox_label">Terminate all the browsers sessions.</span>
													<span id="terminate_session_web_desc" className="session_terminate_desc">This will sign you out of all your Zoho account sessions that are active in browsers.</span>
												</label>
											</div>
										</div>

										<div className="searchparent" id="terminate_mob_apps">
											<div className="checkbox_div" style={{ padding: "10px;", marginTop: "10px;" }}>
												<input data-validate="zform_field" id="ter_mob" name="clear_mobile" className="checkbox_check" onchange="showOneAuthTerminate(this)" type="checkbox" value="" />
												<span className="checkbox">
													<span className="checkbox_tick"></span>
												</span>
												<label htmlFor="ter_mob" className="session_label big_checkbox_label">
													<span className="checkbox_label">Terminate all the desktop and mobile app sessions.</span>
													<span id="terminate_session_weband_mobile_desc" className="session_terminate_desc">This will sign you out of all the Zoho apps that are installed on devices. You will need to sign in to them again.</span>
												</label>
											</div>
										</div>
										<div className="oneAuthLable">
											<div className="oneauthdiv">
												<span className="oneauth_icon one_auth_icon_v2"></span>
												<span className="text_container">
													<div className="text_header">Include OneAuth</div>
													<div className="text_desc">If enabled, you need to verify your new password in OneAuth app installed on your Primary Device.</div>
												</span>
												<div className="togglebtn_div include_oneAuth_button">
													<input className="real_togglebtn" id="include_oneauth" type="checkbox" value="" />
													<div className="togglebase">
														<div className="toggle_circle"></div>
													</div>
												</div>
											</div>
										</div>

										<div className="searchparent" id="terminate_api_tok">
											<div className="checkbox_div" style={{ padding: "10px;", marginTop: "10px" }}>
												<input data-validate="zform_field" id="ter_apiToken" name="clear_apiToken" className="checkbox_check" type="checkbox" value="" />
												<span className="checkbox">
													<span className="checkbox_tick"></span>
												</span>
												<label htmlFor="ter_apiToken" className="session_label big_checkbox_label">
													<span className="checkbox_label">Revoke connected app's access to your account.</span>
													<span id="terminate_session_web_desc_apitoken" className="session_terminate_desc">This will revoke all the permissions you’ve granted to any third-party apps/extensions for fetching information from your account.</span>
												</label>
											</div>
										</div>
									</div>
									<button id="terminate_session_submit" className="btn blue" type="submit" tabIndex="2"><span>Continue</span></button>
								</form>

							</div>

							<div className="bottom_line_opt"><div className="bottom_option" id="contact_support" onclick="show_contactsupport()">Contact Support</div></div>


						</div>




						<div id="contact_support_div" className="recover_sections">

							<div id="normal_contact_support" className="support_sections">

								<div className="info_head">
									<span className="icon-backarrow backoption support_bk_button" id="support_bk_button"></span>
									<span id="headtitle">Contact Support</span>
									<div className="head_info">
										<div style={{ marginBottom: "20px" }}>We are here to help you. </div>
										<div className="normal_mode_support_contactid" style={{ marginBottom: "20px" }}>Send an email to <a href="mailto:support@zohoaccounts.com" style={{ color: "#0091FF", textDecoration: "none;" }}>support@zohoaccounts.com</a>  and we will assist you in recovering your account.</div>
									</div>
								</div>

							</div>

							<div id="org_contact_support" className="support_sections">

								<div className="info_head">
									<span className="icon-backarrow backoption support_bk_button" id="support_bk_button"></span>
									<span id="headtitle">Contact Support</span>
									<div className="head_info">You are part of the organization <b>{0}</b>. Please contact your admin <b><a href="mailto:{1}" style={{ color: "#0091FF", textDecoration: "none;" }}>{2}</a></b> to reset your Zoho account password.</div>
								</div>

							</div>

							<div id="no_recovery_mode_support" className="support_sections">

								<div className="info_head">
									<span id="headtitle">Contact Support</span>
									<div className="head_info">
										<div style={{ marginBottom: "20px" }}>We are here to help you. </div>
										<div style={{ marginBottom: "20px" }}>Since your account is unverified, you don't have any more password recovery options.</div>
										<div className="no_recovery_mode_support_contactid">Send an email to <a href="mailto:support@zohoaccounts.com" style={{ color: "#0091FF", textDecoration: "none;" }}>support@zohoaccounts.com</a>  and we will assist you in recovering your account.</div>
									</div>
								</div>

							</div>

							<div id="support_norm_desc" className="fieldcontainer">

								<div className="support_temp_info">You can also go through our help articles to troubleshoot your issue.</div>
							</div>

							<div id="support_help_article" className="bottom_line_opt"><a href="https://help.zoho.com/portal/en/kb/accounts/faqs-troubleshooting/faqs/password-recovery" target="_blank" className="bottom_option ">View help articles</a></div>

							<div id="support_go_bk" onclick="change_user()" className="bottom_line_opt bottom_option hide">Go back</div>


							<div id="main_contact_support" className="support_sections">

								<div className="info_head">
									<span id="headtitle">Contact Support</span>
									<div className="head_info">Once you submit, we will contact you through your email address {0}.</div>
									<span className="change_cont_suport" onclick="change_contactemail()">Change</span>
								</div>


								<div className="fieldcontainer">

									<div className="searchparent hide" id="contact_supportexpl_container">
										<div className="textbox_div">
											<textarea id="contact_supportexpl" placeholder="Type your Problem" type="text" name="contact_supportexpl" className="textbox" required="" onkeypress="clearCommonError('contact_supportexpl')" autocapitalize="off" autocorrect="off" tabIndex="1"></textarea>
											<div className="fielderror"></div>
										</div>
									</div>

									<button className="btn blue" id="main_contact_support_action" onclick="contact_support()" tabIndex="2"><span>Submit</span></button>

								</div>

							</div>

							<div id="change_contactemail_support" className="support_sections">

								<div className="info_head">
									<span id="headtitle">Change contact email address</span>
									<div className="head_info">Enter the email address you want us to contact you to recover your account.</div>
								</div>

								<div className="fieldcontainer">

									<div className="searchparent hide" id="change_contact_support_container">
										<div className="textbox_div">
											<input id="change_contact_support" placeholder="??????" type="text" name="contact_support" className="textbox" required="" onkeypress="clearCommonError('change_contact_support')" autocapitalize="off" autocorrect="off" tabIndex="1" />
											<div className="fielderror"></div>
											<div className="text_warn">We will send a one-time password to verify this email address and it will be used only for contacting you regarding your password reset.</div>
										</div>
									</div>

									<button className="btn blue" id="change_contact_support_action" onclick="change_contact_support()" tabIndex="2"><span>Send OTP</span></button>

								</div>

							</div>

							<div id="confirm_contact_support" className="support_sections">

								<div className="info_head">
									<span id="headtitle">Verify Contact Email address.</span>
									<div className="head_info">A one-time password has been sent to your contact email address <b>{0}</b>.</div>
								</div>

								<div className="fieldcontainer">

									<div className="searchparent hide" id="verify_contact_support_container">
										<div className="textbox_div">
											<input id="verify_contact_support" placeholder="??????" type="text" name="contact_support" className="textbox" required="" onkeypress="clearCommonError('verify_contact_support')" autocapitalize="off" autocorrect="off" tabIndex="1" />
											<div className="textbox_actions">
												<span id="otp_resend" className="bluetext_action resendotp nonclickelem"></span>
											</div>
											<div className="fielderror"></div>
										</div>
									</div>

									<button className="btn blue" id="confirm_contact_support_action" onclick="confirm_change_contact_support()" tabIndex="2"><span>Send OTP</span></button>

								</div>

							</div>

						</div>


					</div>
				</div>
			</div>
</div>
		);
	}
}

export default pushRoute(Forgotpassword);