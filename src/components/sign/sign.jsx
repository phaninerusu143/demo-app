import React, { Component } from 'react'
import  './signinnewfff2e7e06.scss'

import { pushRoute } from '../pushRoute';
import Joi from 'joi';
class Sign extends Component {
    state = { data:{LOGIN_ID:''},
              errors:{},
			  getPassword:'',
			  showHidePassword:'icon-hide show_hide_password',
			  inputFelid:'password'

}



validationRoles={
	LOGIN_ID:Joi.string().min(2).max(55).required().label('email address or mobile number').messages({
		'string.empty': 'Please enter your email address or mobile number',
	  }),
}
schema=Joi.object(this.validationRoles)


validate = () => {
    const { error } = this.schema.validate(this.state.data, {
      abortEarly: false,
    });
    console.log()
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

  

	signdata=React.createRef();
	formInput=React.createRef();

	validateProperty = ({ name, value }) => {
		console.log('validate property calling');
		
	
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

	}


	hangleChange=({currentTarget:input})=>{

		let errors = { ...this.state.errors };
		console.log('handle cureent filed in handlechange',input.name)
		const errorMessage = this.validateProperty(input);
		console.log('handleChange in main jsx',errorMessage)
		if (errorMessage){
		  console.log('this is errorMessage',errorMessage)
		   errors[input.name] = errorMessage;}
		else {delete errors[input.name];}

		console.log('handle change..');
		const {data}=this.state;
		data.LOGIN_ID=input.value;
		this.setState({data,errors});

	}
	showMoreIdps=(e)=>{
		console.log('data......................................',this.signdata.current.children[1].tagName);
		this.signdata.current.style.display='block'
		this.formInput.current.style.display='none'
		e.currentTarget.style.display='none';
		const childTag=Array.from(this.signdata.current.children);
		childTag.map((tag)=>{
			if(tag.tagName === 'SPAN' || tag.className==='zohosignin hide')
			{
				let fd=tag.className; 
				console.log('child classname',tag.className,tag )
				tag.className=fd.replace("small_box", "large_box");
				if(tag.className==='zohosignin hide')tag.className='zohosignin'
			}
		})
		
	}
	handleSign=(e)=>{
		e.preventDefault();
		alert('hi');
const error=this.validate();
console.log(error);
this.setState({errors:error||{}})

if(!this.validate()){
this.setState({getPassword:'visible'})	
}

		
	}
	rightSide=()=>
	{
		alert('rightSide calling')
	}
	handleForGot=()=>
	{
		console.log('handleForGot',this.props);
		this.props.navigate("/forgotpassword",{state:this.state});
	}
	handleUserId=()=>{
		this.setState({getPassword:''})
	}
	showHidePassword=()=>
	{
if(this.state.showHidePassword === 'icon-hide show_hide_password' && this.state.inputFelid === 'password' )
{
	const visible='icon-hide show_hide_password icon-show';
	const field='text';
	this.setState({showHidePassword:visible,inputFelid:field})
}else{
	this.setState({showHidePassword:'icon-hide show_hide_password',inputFelid:'password'})

}
	}
    render() { 
		console.log('this is sign component.......>',this.state.errors);
        return (
            <div className='signinnewfff2e7e06'>
                
                <div className="bg_one"></div>
    <div className="Alert">
      <span className="tick_icon"></span>
      <span className="alert_message"></span>
    </div>
    <div className="Errormsg">
      <div style={{position:"relative",display:"flex",alignItems:"center"}}>
        <span className="error_icon"></span>
        <span className="error_message"></span>
        <a className="error_help" onClick="closeTopErrNotification"></a>
        <div className="topErrClose hide" onClick="closeTopErrNotification"></div>
      </div>
    </div>



	<div className="container">
		<div className="signin_container">
			<div className="loader" style={{display: "none"}}></div>
			<div className="blur_elem blur" style={{display: "none"}}></div>
			<div className="signin_box" id="signin_flow" >
				<div className={!this.state.getPassword?"smartsigninbutton":"smartsigninbutton hide"} id="smartsigninbtn" onclick="openSmartSignInPage()"> <span className="ssibuttonqricon icon-SmartQR"></span> <span>Try smart sign-in</span> <span className="ssibuttonshineicon icon-shine"></span> </div>
				<div className="zoho_logo zohopeople"></div>
				<div id="signin_div">
					<form name="login" id="login"  ref={this.formInput}>
						<div className="signin_head"> <span id="headtitle">Sign in</span> <span id="trytitle"></span>
							<div className="service_name">to access <span>People</span></div>
							<div className='fielderror'></div>
						</div>
						<div className="fieldcontainer">
							<div className="searchparent" id="login_id_container" style={!this.state.getPassword?{display:"block"}:{display:"none"}}>
								<div className="textbox_div" id="getusername"> <span>
										<label for="country_code_select" className="select_country_code">+1</label>
										<select id="country_code_select" onchange="changeCountryCode();" tabindex="-1" className="select2-hidden-accessible" aria-hidden="true">
	                          					<option data-num="AF" value="+93" id="AF">Afghanistan (+93)</option>
	                          					<option data-num="AL" value="+355" id="AL">Albania (+355)</option>
	                          					<option data-num="DZ" value="+213" id="DZ">Algeria (+213)</option>
	                          					<option data-num="AS" value="+1" id="AS">American Samoa (+1)</option>
	                          					<option data-num="AD" value="+376" id="AD">Andorra (+376)</option>
	                          					
										</select><span className="select2 select2-container select2-container--default" dir="ltr" style={{width: "50px"}}><span className="selection"><span className="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-labelledby="select2-country_code_select-container"><span className="select2-selection__rendered" id="select2-country_code_select-container" title="United States (+1)">+1</span><span className="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span>
									</span><span className="dropdown-wrapper" aria-hidden="true"></span></span>
									<input id="login_id" placeholder="Email address or mobile number" value={this.state.data.LOGIN_ID}  type="email" name="LOGIN_ID" className="textbox" required="" onChange={this.hangleChange} onkeyup="checking()" onkeydown="checking()" autocapitalize="off" autocomplete="webauthn username email" autocorrect="off" tabindex="1"/> <span className="doaminat hide" onclick="enableDomain()">@</span>
									<div className="textbox hide" id="portaldomain">
										<select className="domainselect" id="domaincontainer" onchange="handleDomainChange()"></select>
									</div>
									<div className={((this.state.errors.LOGIN_ID)?'fielderror errorlabel':'fielderror')}   style={(this.state.errors.LOGIN_ID)?{display: "block"}:{display: "none"}}>{this.state.errors.LOGIN_ID}</div>
									</span>
								</div>
							</div>
							<div className={this.state.getPassword?"getpassword":"getpassword zeroheight"} id="password_container" style={this.state.getPassword?{display:'block'}:{display:'none'}}>
								<div className="hellouser">
									<div className="username">{this.state.data.LOGIN_ID}</div> <span className="Notyou bluetext" onClick={this.handleUserId}>Change</span> </div>
								<div className="textbox_div">
									<input id="password" placeholder="Enter password" name="PASSWORD" type={this.state.inputFelid} className="textbox" required="" onfocus="this.value = this.value;" onkeypress="clearCommonError('password')" autocapitalize="off" autocomplete="password" autocorrect="off" maxlength="250"/> <span className={this.state.showHidePassword} onClick={this.showHidePassword}>
									</span>
									<div className="fielderror"></div>
									<div className="textbox_actions" id="enableotpoption" style={!this.state.getPassword?{display:'none'}:{display:'block'}}> <span className="bluetext_action" id="signinwithotp" onclick="showAndGenerateOtp()">Sign in using OTP</span> <span className="bluetext_action bluetext_action_right" id="blueforgotpassword" onclick="goToForgotPassword();">Forgot Password?</span> </div>
									<div className="textbox_actions" id="enableforgot"> <span className="bluetext_action bluetext_action_right" id="blueforgotpassword" onclick="goToForgotPassword();">Forgot Password?</span> </div>
									<div className="textbox_actions_saml" id="enablesaml"> <span className="bluetext_action signinwithsaml" onclick="enableSamlAuth();">Sign in using SAML</span> <span className="bluetext_action bluetext_action_right" id="blueforgotpassword" onclick="goToForgotPassword();">Forgot Password?</span> </div>
									<div className="textbox_actions_saml" id="enablejwt"> <a href="#" className="bluetext_action signinwithjwt">Sign in using JWT</a> <span className="bluetext_action bluetext_action_right" id="blueforgotpassword" onclick="goToForgotPassword();">Forgot Password?</span> </div>
								</div>
							</div>
							<div className="textbox_div" id="mfa_device_container">
								<div className="devices">
									<select className="secondary_devices" onchange="changeSecDevice(this);"></select>
									<div className="deviceparent"> <span className="deviceinfo icon-device"></span> <span className="devicetext"></span> </div>
								</div>
								<div className="rnd_container">
									<div id="rnd_num"></div>
									<div className="bluetext_action rnd_resend resendotp" onclick="javascript:return submitsignin($('#login'));">Resend Push</div>
								</div>
							</div>
							<div id="otp_container">
								<div className="hellouser">
									<div className="username"></div> <span className="Notyou bluetext">Change</span> </div>
								<div className="textbox_div">
									<input id="otp" placeholder="Enter OTP" type="number" name="OTP" className="textbox" required="" onkeypress="clearCommonError('otp')" autocapitalize="off" autocomplete="off" autocorrect="off"/>
									<div className="fielderror"></div>
									<div className="textbox_actions otp_actions"> <span className="bluetext_action" id="signinwithpass" onclick="showPassword()">Sign in using password</span> <span className="bluetext_action signinwithsaml" onclick="enableSamlAuth();">Sign in using SAML</span> <a href="#" className="bluetext_action signinwithjwt">Sign in using JWT</a> <span className="bluetext_action showmoresigininoption" onclick="showmoresigininoption()">Sign in another way</span> <span className="bluetext_action bluetext_action_right resendotp" onclick="generateOTP(true);clearCommonError('otp');clearFieldValue('otp')">Resend OTP</span> </div>
								</div>
							</div>
							<div className="textbox_div" id="mfa_otp_container">
								<input id="mfa_otp" placeholder="Enter OTP" type="number" name="MFAOTP" className="textbox" required="" onkeypress="clearCommonError('mfa_otp')" autocapitalize="off" autocomplete="off" autocorrect="off"/>
								<div className="fielderror"></div>
								<div className="textbox_actions"> <span className="bluetext_action bluetext_action_right resendotp" onclick="generateOTP(true)">Resend OTP</span> </div>
							</div>
							<div className="textbox_div" id="mfa_email_container">
								<input id="mfa_email" placeholder="Enter OTP" type="number" name="MFAEMAIL" className="textbox" required="" onkeypress="clearCommonError('mfa_email')" autocapitalize="off" autocomplete="off" autocorrect="off"/>
								<div className="fielderror"></div>
								<div className="textbox_actions"> <span className="bluetext_action bluetext_action_right resendotp" onclick="generateOTP(true)">Resend OTP</span> </div>
							</div>
							<div className="textbox_div" id="mfa_totp_container">
								<input id="mfa_totp" placeholder="Enter TOTP" type="number" name="TOTP" className="textbox" required="" onkeypress="clearCommonError('mfa_totp')" autocapitalize="off" autocomplete="off" autocorrect="off"/>
								<div className="fielderror"></div>
							</div>
							<div className="qrcodecontainer" id="mfa_scanqr_container"> <span className="qr_before"></span> <img id="qrimg" src=""/> <span className="qr_after"></span> </div>
							<div className="textbox_div" id="captcha_container">
								<input id="captcha" placeholder="Enter CAPTCHA" type="text" name="captcha" className="textbox" required="" onkeypress="clearCommonError('captcha')" autocapitalize="off" autocomplete="off" autocorrect="off" maxlength="8"/>
								<div id="captcha_img" name="captcha" className="textbox"></div> <span className="reloadcaptcha icon-Reload" onclick="changeHip()"></span>
								<div className="fielderror"></div>
							</div>
							<div id="yubikey_container">
								<div className="fielderror"></div>
							</div>
							<button className="btn blue waitbtn" id="waitbtn"> <span className="loadwithbtn"></span> <span className="waittext">Waiting for approval</span> </button>
						</div>
						<div className="textbox_actions_more" id="enablemore"> <span className="bluetext_action showmoresigininoption" onclick="showmoresigininoption()">Sign in another way</span> <span className="bluetext_action bluetext_action_right blueforgotpassword" id="blueforgotpassword" onclick="goToForgotPassword();">Forgot Password?</span> <span className="bluetext_action bluetext_action_right resendotp" id="resendotp" onclick="generateOTP(true)">Resend OTP</span>
							<div id="enableoptionsoneauth"> <span className="signinoptiononeauth" id="signinwithpassoneauth" onclick="showPassword()">Sign in using password</span> <span className="signinoptiononeauth" id="passlessemailverify" onclick="showAndGenerateOtp('email')"></span> <span className="signinoptiononeauth" id="signinwithotponeauth" onclick="showAndGenerateOtp('otp')"></span> <span className="signinwithsamloneauth signinoptiononeauth" onclick="enableSamlAuth();">Sign in using SAML</span> <span className="signinwithfedoneauth signinoptiononeauth" onclick="showMoreFedOptions();">Sign in using linked accounts</span> <a href="#" className="signinwithjwtoneauth signinoptiononeauth">Sign in using JWT</a> </div>
						</div>
						<div className="addaptivetfalist">
							<div className="signin_head verify_title">Sign in another way</div>
							<div className="optionstry optionmod" id="trytotp" onclick="tryAnotherway('totp')">
								<div className="img_option_try img_option icon-totp"></div>
								<div className="option_details_try">
									<div className="option_title_try">Offline TOTP verification</div>
									<div className="option_description try_option_desc">Open OneAuth, tap <span className="trydesc">Sign in another way</span>, and enter it here to verify your sign-in.</div>
								</div>
								<div className="mfa_totp_verify verify_totp" id="verify_totp_container">
									<input id="verify_totp" placeholder="Enter OTP" type="number" name="MFATOTP" className="textbox" required="" onkeypress="clearCommonError('verify_totp')" autocapitalize="off" autocomplete="off" autocorrect="off"/>
									<button className="btn blue" id="totpverifybtn" tabindex="2"> <span className="loadwithbtn"></span> <span className="waittext">Verify</span> </button>
									<div className="fielderror"></div>
								</div>
							</div>
							<div className="optionstry optionmod" id="tryscanqr" onclick="tryAnotherway('qr')">
								<div className="img_option_try img_option icon-qr"></div>
								<div className="option_details_try">
									<div className="option_title_try">Scan QR verification</div>
									<div className="option_description try_option_desc">Open OneAuth and tap <span className="trydesc">Sign in another way</span>. Tap <span className="trydesc">Scan QR instead</span> to open code scanner. Scan the below code to verify sign-in.</div>
								</div>
								<div className="verify_qr" id="verify_qr_container">
									<div className="qrcodecontainer">
										<div> <span className="qr_before"></span> <img id="verify_qrimg" src=""/> <span className="qr_after"></span>
											<div className="loader" style={{display: "none"}}></div>
											<div className="blur_elem blur" style={{display: "none"}}></div>
										</div>
									</div>
								</div>
							</div> <span className="close_icon error_icon" onclick="hideTryanotherWay()"></span>
							<div className="text16 pointer nomargin" id="recoverybtn_mob" onclick="showCantAccessDevice()">Can't access your device?</div>
							<div className="text16 pointer nomargin" id="problemsignin_mob" onclick="showproblemsignin()">Problem signing in?</div>
						</div>
						<div id="problemsigninui"></div>
						<button className="btn blue" id="nextbtn" tabIndex="2" onClick={this.handleSign}><span>{!this.state.getPassword?'Next':'Sign In'}</span></button>
						<div className="text16 pointer nomargin" id="recoverybtn" onclick="showCantAccessDevice()">Can't access your device?</div>
						<div className="text16 pointer nomargin" id="problemsignin" onclick="showproblemsignin()">Problem signing in?</div>
						<div className="tryanother text16" onclick="showTryanotherWay()">Sign in another way</div>
						<div className="text16 pointer" id="forgotpassword">
							<span className="text16" href="" onClick={this.handleForGot} style={!this.state.getPassword?{display: "block"}:{display: "none"}}>Forgot Password?</span>
							{/* <Link to={{pathname:'/forgotpassword',state:this.state}}>Forgot Password?</Link> */}
							</div>
					</form>
					<div className="externaluser_container"></div>
					<button className="btn blue" id="continuebtn" onclick="handleLookupDetails(JSON.stringify(deviceauthdetails),true);return false"><span>Continue</span></button>
					<div id="recovery_container">
						<div className="signin_head recoveryhead"> <span className="icon-backarrow backoption" onclick="goBackToProblemSignin()"></span><span className="rec_head_text">Can't access your device?</span>
							<table id="recoverytitle"></table>
						</div>
						<div id="recoverymodeContainer"></div>
						<div className="recoverymodes">
							<div className="options options_hover" id="recoverOption" onclick="showBackupVerificationCode()">
								<div className="img_option icon-backup"></div>
								<div className="option_details">
									<div className="option_title">Use backup verification code</div>
									<div className="option_description">Backup verification codes are 12-digit codes that are given to you when you set up multi-factor authentication.</div>
								</div>
							</div>
							<div className="options options_hover" id="passphraseRecover" onclick="showPassphraseContainer()">
								<div className="img_option icon-saml"></div>
								<div className="option_details">
									<div className="option_title">Sign in using passphrase</div>
									<div className="option_description">Use passphrase to sign in to your OneAuth app</div>
								</div>
							</div>
							<div className="options contact_support">
								<div className="img_option icon-support"></div>
								<div className="option_details">
									<div className="option_title">Contact Support</div>
									<div className="option_description contactsuprt">Please send us an email at <a href="mailto:support@zohoaccounts.com" style={{color:"#696969",textDecoration:"none"}}>support@zohoaccounts.com</a> describing your issue so we can assist you.</div>
								</div>
							</div>
						</div>
						<div className="btn greytext"></div>
					</div>
					<form id="backup_container" onsubmit="" novalidate="">
						<div className="signin_head backuphead"> <span id="backup_title"><span className="icon-backarrow backoption" onclick="showCantAccessDevice()"></span>Use backup verification code</span>
							<div className="backup_desc extramargin">Backup verification codes are 12-digit codes that are given to you when you set up multi-factor authentication.</div>
						</div>
						<div className="textbox_div" id="backupcode_container">
							<input id="backupcode" placeholder="Backup verification code" type="text" name="backupcode" className="textbox" required="" onkeypress="clearCommonError('backupcode')" onkeyup="submitbackup(event)" autocapitalize="off" autocomplete="off" autocorrect="off"/>
							<div className="fielderror"></div> <span className="bluetext_action" id="recovery_passphrase" onclick="changeRecoverOption('passphrase')">Sign in using passphrase</span> </div>
						<div className="textbox_div" id="passphrase_container">
							<input id="passphrase" placeholder="Enter passphrase" type="password" name="PASSPHRASE" className="textbox" required="" onkeypress="clearCommonError('passphrase')" autocapitalize="off" autocomplete="off" autocorrect="off"/> <span className="icon-hide show_hide_password" onclick="showHidePassword();">
							</span>
							<div className="fielderror"></div> <span className="bluetext_action" id="recovery_backup" onclick="changeRecoverOption('recoverycode')">Sign in using backup codes</span> </div>
						<div className="textbox_div" id="bcaptcha_container">
							<input id="bcaptcha" placeholder="Enter CAPTCHA" type="text" name="captcha" className="textbox" required="" onkeypress="clearCommonError('bcaptcha')" onkeyup="submitbackup(event)" autocapitalize="off" autocomplete="off" autocorrect="off" maxlength="8"/>
							<div id="bcaptcha_img" name="captcha" className="textbox"></div> <span className="reloadcaptcha" onclick="changeHip('bcaptcha_img','bcaptcha')"> </span>
							<div className="fielderror"></div>
						</div>
						<button className="btn blue">Verify</button>
						<div className="btn borderlessbtn back_btn"></div>
					</form>
					<form id="emailcheck_container" onsubmit="" novalidate="">
						<div className="signin_head emailcheck_head"> <span id="backup_title"><span className="icon-backarrow backoption" onclick="hideEmailOTPInitiate()"></span>Sign-in via email OTP</span>
							<div className="backup_desc extramargin" id="emailverify_desc">Please enter your registered email address <b>{0}</b> to receive the OTP.</div>
						</div>
						<div className="textbox_div" id="emailvalidate_container">
							<input id="emailcheck" placeholder="Enter email address" name="EMAILCHECK" type="email" className="textbox" required="" onkeypress="clearCommonError('emailcheck')" autocapitalize="off" autocomplete="on" autocorrect="off" maxlength="250"/>
							<div className="fielderror"></div>
						</div>
						<button className="btn blue">Next</button>
					</form>
					<form id="emailverify_container" onsubmit="" novalidate="">
						<div className="signin_head emailverify_head"> <span id="backup_title"><span className="icon-backarrow backoption" onclick="hideEmailOTPVerify()"></span>Sign-in via email OTP</span>
							<div className="backup_desc extramargin" id="emailverify_desc">Please enter your registered email address <b>{0}</b> to receive the OTP.</div>
						</div>
						<div className="textbox_div" id="emailotpverify_container">
							<input id="emailverify" placeholder="Enter OTP" name="EMAILVERIFY" type="email" className="textbox" required="" onkeypress="clearCommonError('emailverify')" autocapitalize="off" autocomplete="on" autocorrect="off" maxlength="250"/>
							<div className="fielderror"></div>
						</div> <span className="bluetext_action" id="signinwithpass" onclick="showPassword()">Sign in using password</span> <span className="bluetext_action signinwithsaml" onclick="enableSamlAuth();">Sign in using SAML</span> <a href="#" className="bluetext_action signinwithjwt">Sign in using JWT</a> <span className="bluetext_action bluetext_action_right resendotp" onclick="generateOTP(true)">Resend OTP</span>
						<div className="textbox_actions_more" id="enablemore"> <span className="bluetext_action showmoresigininoption" onclick="showmoresigininoption('getbackemailverify');">Sign in another way</span> <span className="bluetext_action bluetext_action_right blueforgotpassword" id="blueforgotpassword" onclick="goToForgotPassword();">Forgot Password?</span> <span className="bluetext_action bluetext_action_right resendotp" id="resendotp" onclick="generateOTP(true)">Resend OTP</span> </div>
						<button className="btn blue">Verify</button>
					</form>
					<div> </div>
					<div className="line" style={!this.state.getPassword?{display: "block"}:{display: "none"}}> <span className="line_con">
		    				<span>Or</span> </span>
					</div>
					<div className="fed_2show" style={!this.state.getPassword?{display: "block"}:{display: "none"}} ref={this.signdata}>
						<div className="signin_fed_text">Sign in using</div> <span className="fed_div google_icon google_fed small_box show_fed" onclick="createandSubmitOpenIDForm('google');" title="Sign in using Google" style={{display: "inline-block"}}>
						            <div className="fed_center_google">
						                <span className="icon-google_small fedicon">
											<span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span> </span> <span className="fed_text">Google</span> </div>
					</span> <span className="fed_div fb_fed_box facebook_fed small_box show_fed" onclick="createandSubmitOpenIDForm('facebook');" title="Sign in using Facebook" style={{display: "inline-block"}}>
									<div className="fed_center">
							            <div className="icon-facebook_small fedicon"></div>
							            <span className="fed_text" style={{display: "none"}}>Facebook</span> </div>
				</span> <span className="fed_div linkedin_fed_box linkedin_fed small_box show_fed" onclick="createandSubmitOpenIDForm('linkedin');" title="Sign in using Linkedin" style={{display:"inline-block"}}>
						            <div className="fed_center">
						                <span className="icon-linkedin_small fedicon linkedicon"></span> </div>
			</span> <span className="fed_div twitter_fed_box twitter_fed small_box show_fed" onclick="createandSubmitOpenIDForm('twitter');" title="Sign in using Twitter" style={{display: "inline-block"}}>
						            <div className="fed_center">
						                <span className="icon-twitter_small fedicon"></span> <span className="fed_text" style={{display: "none"}}>Twitter</span> </div>
		</span> <span className="fed_div MS_icon azure_fed small_box show_fed" onclick="createandSubmitOpenIDForm('azure');" title="Sign in using Microsoft" style={{display: "inline-block"}}>
						            <div className="fed_center">
						                <span className="icon-azure_small fedicon">
						                		<span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span> </span> <span className="fed_text" style={{display:"none"}}>Microsoft</span> </div>
	</span> <span className="fed_div apple_normal_icon apple_fed small_box" id="appleNormalIcon" onclick="createandSubmitOpenIDForm('apple');" title="Sign in using Apple" style={{display: "inline"}}>
						             <div className="fed_center">
						                <span className="icon-apple_small fedicon"></span> <span className="fed_text" style={{display:"none"}}>Sign in with Apple</span> </div>
	</span> <span className="fed_div more small_box" id="showIDPs" title="More" onClick={this.showMoreIdps} style={{display: "inline"}} > <span className="morecircle"></span> <span className="morecircle"></span> <span className="morecircle"></span></span>
	<div className="zohosignin hide" onClick="showZohoSignin">Sign in with Zoho<span className="fedarrow"></span></div>
	</div>
	</div>
	<div className="nopassword_container">
		<div className="nopassword_icon icon-hint"></div>
		<div className="nopassword_message">You have not set a password for this account <a href="javascript:goToForgotPassword();">Set password now</a>.</div>
	</div>
	<div className="go_to_bk_code_container">
		<div className="close_btn" onclick="hideBkCodeRedirection()"></div>
		<div className="nopassword_icon icon-hint"></div>
		<div className="backup_info_tab">
			<div style={{fontSize:"12px",fontWeight:"500"}}>Try Backup Verification Code</div>
			<div style={{marginTop: "5px",color: "#000000BF"}}>If you are unable to sign in using SMS-based OTP, you can use backup verification codes to sign in.</div>
		</div>
		<div className="button_parent"><span className="backup_action" onclick="showBackupVerificationCode()">Try Now</span></div>
	</div>
	<div className="password_expiry_container">
		<div className="passexpsuccess"></div>
		<div className="signin_head"> <span id="headtitle">Password expired</span>
			<div className="pass_name extramargin" id="password_desc"></div>
		</div>
		<div className="textbox_div" id="npassword_container">
			<input id="new_password" onkeyup="setPassword(event)" placeholder="Enter new password" name="newPassword" type="password" className="textbox" required="" onkeypress="clearCommonError('password')" autocapitalize="off" autocomplete="password" autocorrect="off"/> <span className="icon-hide show_hide_password" onclick="showHidePassword();">
			</span>
			<div className="fielderror"></div>
		</div>
		<div className="textbox_div" id="rpassword_container">
			<input id="new_repeat_password" onkeyup="setPassword(event)" placeholder="Confirm Password" name="cpwd" type="password" className="textbox" required="" onkeypress="clearCommonError('password')" autocapitalize="off" autocomplete="password" autocorrect="off"/> </div>
		<button className="btn blue" id="changepassword" onclick="updatePassword();"><span>Set password</span></button>
	</div>
	<div className="terminate_session_container">
		<div className="signin_head"> <span id="headtitle">Terminate Sessions</span>
			<div className="pass_name extramargin" id="password_desc">Apart from changing your password, you can perform the following action if you feel your account is compromised.</div>
		</div>
		<form id="terminate_session_form" name="terminate_session_container" onsubmit="" novalidate="">
			<div className="checkbox_div" id="terminate_web_sess" style={{padding: "10px",marginTop:"10px"}}>
				<input id="termin_web" name="signoutfromweb" className="checkbox_check" type="checkbox"/> <span className="checkbox">
								<span className="checkbox_tick"></span> </span>
				<label for="termin_web" className="session_label"> <span className="checkbox_label">Terminate all the browsers sessions.</span> <span id="terminate_session_web_desc" className="session_terminate_desc">This will sign you out of all your Zoho account sessions that are active in browsers.</span> </label>
			</div>
			<div className="checkbox_div" id="terminate_mob_apps" style={{padding:"10px",marginTop:"10px"}}>
				<input id="termin_mob" name="signoutfrommobile" className="checkbox_check" type="checkbox" onchange="showOneAuthTerminate(this)"/> <span className="checkbox">
								<span className="checkbox_tick"></span> </span>
				<label for="termin_mob" className="session_label big_checkbox_label"> <span className="checkbox_label">Terminate all the desktop and mobile app sessions.</span> <span id="terminate_session_weband_mobile_desc" className="session_terminate_desc">This will sign you out of all the Zoho apps that are installed on devices. You will need to sign in to them again.</span> </label>
			</div>
			<div className="oneAuthLable">
				<div className="oneauthdiv"> <span className="oneauth_icon one_auth_icon_v2"></span> <span className="text_container">
									<div className="text_header">Include OneAuth</div>
									<div className="text_desc">If enabled, you need to verify your new password in OneAuth app installed on your Primary Device.</div>
								</span>
					<div className="togglebtn_div include_oneAuth_button">
						<input className="real_togglebtn" id="include_oneauth" type="checkbox"/>
						<div className="togglebase">
							<div className="toggle_circle"></div>
						</div>
					</div>
				</div>
			</div>
			<div className="checkbox_div" id="terminate_api_tok" style={{padding: "10px",marginTop:"10px"}}>
				<input id="termin_api" name="signoutfromapiToken" className="checkbox_check" type="checkbox"/> <span className="checkbox">
								<span className="checkbox_tick"></span> </span>
				<label for="termin_api" className="session_label big_checkbox_label"> <span className="checkbox_label">Revoke connected app's access to your account.</span> <span id="terminate_session_web_desc_apitoken" className="session_terminate_desc">This will revoke all the permissions you’ve granted to any third-party apps/extensions for fetching information from your account.</span> </label>
			</div>
			<button className="btn blue checkbox_mod" id="terminate_session_submit"><span>Continue</span></button>
		</form>
	</div>
	<div className="trustbrowser_ui">
		<div className="signin_head"> <span id="headtitle">Trust this browser?</span>
			<div className="service_name mod_sername"></div>
		</div>
		<button className="btn blue trustdevice trustbtn" onclick="updateTrustDevice(true)"> <span className="loadwithbtn"></span> <span className="waittext">Trust</span> </button>
		<button className="btn grey trustdevice notnowbtn" onclick="updateTrustDevice(false)"> <span className="loadwithbtn"></span> <span className="waittext">Not now</span> </button>
	</div>
	<div id="restict_signin">
		<div className="signin_head restrict_head">Access denied</div>
		<div className="restrict_icon"></div>
		<div className="restrict_desc service_name">You've enabled Restrict Sign-in for your Zoho account. You can disable it in the OneAuth app.</div>
		<button className="btn blue trybtn" id="restict_btn" tabindex="2" onclick="window.location.reload()">Try again</button>
	</div>
	</div>
	<div className="rightside_box" onLoad={this.rightSide}>
		<div className="mfa_panel hide" style={{display: "none"}}>
			<div className="product_img" id="product_img"></div>
			<div className="product_head">Keep your account secure</div>
			<div className="product_text">Zoho OneAuth is our new in-house multi-factor authentication app. Shield your Zoho account with <a style={{color:"#309FF4",textDecoration:"none"}} href="https://www.zoho.com/accounts/oneauth.html?utm_source=tfa-banner-accounts&amp;utm_medium=web&amp;utm_campaign=oenauth-ms" target="_blank">OneAuth</a> now.</div>
		</div>
		<div className="overlapBanner" style={{width: "300px",display: "block"}}>
			<div id="banner_0" className="rightbanner rightbannerTransition">
				
				<div className="container">
					<div className="banner1_img" style={{backgroundImage: "url('https://accounts.zoho.in/v2/components/images/passwordless_illustration2x.png')"}}></div>
					<div className="banner1_heading">Passwordless sign-in</div>
					<div  className="banner1_content">Move away from risky passwords and experience one-tap access to Zoho. Download and Install OneAuth. </div> <a className="banner1_href" href="https://zoho.to/za_signin_oa_rp" target="_blank"> Learn More </a> </div>
			</div>
			<div id="banner_1" className="rightbanner rightbannerTransition slideright">
				
				<div className="container">
					<div className="banner1_img" style={{backgroundImage:" url('https://accounts.zoho.in/v2/components/images/mfa_illustration2x.png')"}}></div>
					<div className="banner1_heading">MFA for all accounts</div>
					<div  className="banner1_content">Secure online accounts with OneAuth 2FA. Back up OTP secrets and never lose access to your accounts. </div> <a className="banner1_href" href="https://zoho.to/za_signin_oa_rp" target="_blank"> Learn More </a> </div>
			</div>
			<div id="banner_2" className="rightbanner rightbannerTransition slideright">
				
				<div className="container">
					<div className="banner1_img" style={{backgroundImage:"url('https://accounts.zoho.in/v2/components/images/recovery_illustration2x.png')"}}></div>
					<div className="banner1_heading">Easy recovery modes</div>
					<div className="banner1_content">Lost access to OneAuth? Worry not. Set up passphrase and backup number to recover OneAuth easily. </div> <a className="banner1_href" href="https://zoho.to/za_signin_oa_rp" target="_blank"> Learn More </a> </div>
			</div>
		</div>
		<div className="dotHead">
			<div className="dot" id="dot_0">
				<div></div>
			</div>
			<div className="dot" id="dot_1" selected="selected">
				<div></div>
			</div>
			<div className="dot" id="dot_2">
				<div></div>
			</div>
		</div>
	</div>
	
	</div>
	<div id="signuplink">Don't have a Zoho account? <a href="javascript:register()">Sign Up Now</a></div>
	<div id="enableCookie" style={{display:"none",textAlign:"center"}}>
		<div className="zoho_logo zohopeople zoho_logo_position_center"></div>
		<div style={{textAlign: "center",padding: "10px"}}>Cookies are disabled for your browser. Please enable cookies to continue.</div>
	</div>
	</div>
	
	
    			
            </div>
        );
    }
}
 
export default pushRoute(Sign);