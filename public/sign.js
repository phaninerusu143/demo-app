import $ from 'jquery';

function strToBin(str) {
    return Uint8Array.from(atob(str), function (c) {
       return c.charCodeAt(0)
    })
 }
 
 function binToStr(bin) {
    return btoa(new Uint8Array(bin).reduce(function (s, byte) {
       return s + String.fromCharCode(byte)
    }, ''))
 }
 
 function isWebAuthNSupported() {
    return window.PublicKeyCredential ? !0 : !1
 }
 
 function credentialListConversion(list) {
    return list.map(function (item) {
       var cred = {
          type: item.type,
          id: strToBin(item.id)
       };
       return null != item.transports && item.transports.length && (cred.transports = item.transports), cred
    })
 }
 
 function select2_open_listener(event) {
    event && document.querySelector(event.target).closest('.select2-selection').length && document.querySelector('.select2-dropdown').children('.select2-search').children('.select2-search__field')[0].focus()
 }
 
 function submitsignin(frm) {
    if (document.querySelector('.signin_head .fielderror').classList.remove('errorlabel'), document.querySelector('.signin_head .fielderror').textContent = ''), isFormSubmited) return !1;
 document.querySelector('#nextbtn span').classList.add('zeroheight'), document.querySelector('#nextbtn').classList.add('changeloadbtn'), document.querySelector('#nextbtn').getAttribute('disabled', !0), document.querySelector('#totpverifybtn').matches(':visible') && (document.querySelector('#totpverifybtn .loadwithbtn').style.display = '', document.querySelector('#totpverifybtn .waittext').classList.add('loadbtntext'));
 var isCaptchaNeeded = document.querySelector('#captcha_container').matches(':visible'),
    captchavalue = frm.captcha && frm.captcha.value.trim();
 if (isCaptchaNeeded) {
    if (!isValid(captchavalue)) return changeHip(), showCommonError('captcha', I18N.get('IAM.SIGNIN.ERROR.CAPTCHA.REQUIRED')), !1;
    if (/[^a-zA-Z0-9\-\/]/.test(captchavalue)) return changeHip(), showCommonError('captcha', I18N.get('IAM.SIGNIN.ERROR.CAPTCHA.INVALID')), !1
 }
 if ('lookup' === signinathmode) {
    var LOGIN_ID = frm.LOGIN_ID.value.trim();
    if (document.querySelector('#portaldomain').matches(':visible') && (LOGIN_ID += document.querySelector('.domainselect').value), !isValid(LOGIN_ID)) return showCommonError('login_id', I18N.get('IAM.NEW.SIGNIN.ENTER.EMAIL.OR.MOBILE')), !1;
    if ((document.querySelector('.showcountry_code').matches(':visible') || document.querySelector('#country_code_select').matches(':visible')) && !isPhoneNumber(LOGIN_ID)) return showCommonError('login_id', I18N.get('IAM.PHONE.ENTER.VALID.MOBILE_NUMBER')), !1;
    if (!isUserName(LOGIN_ID) && !isEmailId(LOGIN_ID) && !isPhoneNumber(LOGIN_ID.split('-')[1])) return showCommonError('login_id', I18N.get('IAM.SIGNIN.ERROR.USEREMAIL.NOT.EXIST')), !1;
    LOGIN_ID = document.querySelector('.showcountry_code').matches(':visible') || document.querySelector('#country_code_select').matches(':visible') ? document.querySelector('#country_code_select').value.split('+')[1] + '-' + LOGIN_ID : LOGIN_ID, LOGIN_ID = isPhoneNumber(LOGIN_ID.split('-')[1]) ? LOGIN_ID.split('-')[0].trim() + '-' + LOGIN_ID.split('-')[1].trim() : LOGIN_ID;
    var loginurl = uriPrefix + '/signin/v2/lookup/' + LOGIN_ID,
       params = 'mode=primary&' + signinParams;
    return isCaptchaNeeded && (params += '&captcha=' + captchavalue + '&cdigest=' + cdigest), sendRequestWithCallback(loginurl, params, !0, handleLookupDetails), !1
 }
 if ('passwordauth' === signinathmode) {
    if (void 0 != allowedmodes && -1 != allowedmodes.indexOf('yubikey') && !isWebAuthNSupported()) return showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.BrowserNotSupported')), changeButtonAction(I18N.get('IAM.NEXT'), !1), !1;
    var PASSWORD = frm.PASSWORD.value.trim();
    if (!isValid(PASSWORD)) return showCommonError('password', I18N.get('IAM.ERROR.ENTER_PASS')), !1;
    var jsonData = {
          passwordauth: {
             password: PASSWORD
          }
       },
       loginurl = uriPrefix + '/signin/v2/' + callmode + '/' + zuid + '/password?';
    return loginurl += 'digest=' + digest + '&' + signinParams, isCaptchaNeeded && (loginurl += '&captcha=' + captchavalue + '&cdigest=' + cdigest), sendRequestWithCallback(loginurl, JSON.stringify(jsonData), !0, handlePasswordDetails), !1
 }
 if ('totpsecauth' === signinathmode || 'oneauthsec' === signinathmode && 'ONEAUTH_TOTP' === prefoption) {
    var TOTP = frm.TOTP.value.trim();
    if (!isValid(TOTP)) return showCommonError('mfa_totp', I18N.get('IAM.NEW.SIGNIN.INVALID.OTP.MESSAGE.EMPTY')), !1;
    if (/[^0-9\-\/]/.test(TOTP)) return showCommonError('mfa_totp', I18N.get('IAM.SIGNIN.ERROR.INVALID.VERIFICATION.CODE')), !1;
    callmode = 'secondary';
    var loginurl = 'ONEAUTH_TOTP' === prefoption ? uriPrefix + '/signin/v2/' + callmode + '/' + zuid + '/oneauth/' + deviceid + '?' : uriPrefix + '/signin/v2/' + callmode + '/' + zuid + '/totp?';
    loginurl += 'digest=' + digest + '&' + signinParams, isCaptchaNeeded && (loginurl += '&captcha=' + captchavalue + '&cdigest=' + cdigest);
    var jsonData = 'ONEAUTH_TOTP' === prefoption ? {
          oneauthsec: {
             devicepref: prefoption,
             code: TOTP
          }
       } : {
          totpsecauth: {
             code: TOTP
          }
       },
       method = 'ONEAUTH_TOTP' === prefoption ? 'PUT' : 'POST';
    return loginurl = 'ONEAUTH_TOTP' === prefoption ? loginurl + '&polling=' + !1 : loginurl, sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handleTotpDetails, method), !1
 }
 if ('otpsecauth' === signinathmode) {
    var TFA_OTP_CODE = frm.MFAOTP.value.trim(),
       errorfield = 'mfa_otp',
       incorrectOtpErr = I18N.get('IAM.NEW.SIGNIN.INVALID.OTP.MESSAGE.NEW');
    if ('email' === prev_showmode && (TFA_OTP_CODE = frm.MFAEMAIL.value.trim(), errorfield = 'mfa_email', incorrectOtpErr = I18N.get('IAM.NEW.SIGNIN.INVALID.EMAIL.MESSAGE.NEW')), !isValid(TFA_OTP_CODE)) return showCommonError(errorfield, I18N.get('IAM.NEW.SIGNIN.INVALID.OTP.MESSAGE.EMPTY')), !1;
    if (isNaN(TFA_OTP_CODE) || 7 != TFA_OTP_CODE.length) return showCommonError(errorfield, incorrectOtpErr), !1;
    if (/[^0-9\-\/]/.test(TFA_OTP_CODE)) return showCommonError(errorfield, I18N.get('IAM.SIGNIN.ERROR.INVALID.VERIFICATION.CODE')), !1;
    callmode = 'secondary';
    var loginurl = uriPrefix + '/signin/v2/' + callmode + '/' + zuid + '/otp/' + emobile + '?';
    loginurl += 'digest=' + digest + '&' + signinParams, isCaptchaNeeded && (loginurl += '&captcha=' + captchavalue + '&cdigest=' + cdigest);
    var jsonData = {
       otpsecauth: {
          mdigest: mdigest,
          code: TFA_OTP_CODE
       }
    };
    return sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handleTotpDetails, 'PUT'), !1
 }
 if ('otpauth' === signinathmode) {
    var OTP_CODE = frm.OTP.value.trim();
    if (void 0 != allowedmodes && -1 != allowedmodes.indexOf('yubikey') && !isWebAuthNSupported()) return showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.BrowserNotSupported')), changeButtonAction(I18N.get('IAM.VERIFY'), !1), !1;
    if (!isValid(OTP_CODE)) return showCommonError('otp', I18N.get('IAM.NEW.SIGNIN.INVALID.OTP.MESSAGE.EMPTY')), !1;
    if (isNaN(OTP_CODE) || 7 != OTP_CODE.length) {
       var error_msg = I18N.get('email' === prev_showmode ? 'IAM.NEW.SIGNIN.INVALID.EMAIL.MESSAGE.NEW' : 'IAM.NEW.SIGNIN.INVALID.OTP.MESSAGE.NEW');
       return showCommonError('otp', error_msg), !1
    }
    if (/[^0-9\-\/]/.test(OTP_CODE)) return showCommonError('otp', I18N.get('IAM.SIGNIN.ERROR.INVALID.VERIFICATION.CODE')), !1;
    var loginurl = uriPrefix + '/signin/v2/' + callmode + '/' + zuid + '/otp/' + emobile + '?';
    loginurl += 'digest=' + digest + '&' + signinParams, isCaptchaNeeded && (loginurl += '&captcha=' + captchavalue + '&cdigest=' + cdigest);
    var jsonData = {
       otpauth: {
          code: OTP_CODE,
          is_resend: !1
       }
    };
    return sendRequestWithCallback(loginurl, JSON.stringify(jsonData), !0, handlePasswordDetails, 'PUT'), !1
 }
 if ('deviceauth' === signinathmode || 'devicesecauth' === signinathmode) {
    var myzohototp;
    if ('totp' === prefoption && (myzohototp = isTroubleSignin ? frm.MFATOTP.value.trim() : frm.TOTP.value.trim(), !isValid(myzohototp))) {
       var container = isTroubleSignin ? 'verify_totp' : 'mfa_totp';
       return showCommonError(container, I18N.get('IAM.NEW.SIGNIN.INVALID.OTP.MESSAGE.EMPTY')), !1
    }
    var loginurl = '/signin/v2/' + callmode + '/' + zuid + '/device/' + deviceid + '?';
    loginurl += 'digest=' + digest + '&' + signinParams, isResend = 'push' === prefoption ? !0 : !1;
    var jsonData = 'totp' === prefoption ? {
       devicesecauth: {
          devicepref: prefoption,
          code: myzohototp
       }
    } : {
       devicesecauth: {
          devicepref: prefoption
       }
    };
    'deviceauth' === signinathmode && (jsonData = 'totp' === prefoption ? {
       deviceauth: {
          devicepref: prefoption,
          code: myzohototp
       }
    } : {
       deviceauth: {
          devicepref: prefoption
       }
    });
    var method = 'POST',
       invoker = handleMyZohoDetails;
    return 'totp' === prefoption && (method = 'PUT', loginurl += '&polling=' + !1, invoker = handleTotpDetails), sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, invoker, method), !1
 }
 if ('oneauthsec' === signinathmode) {
    var loginurl = '/signin/v2/' + callmode + '/' + zuid + '/oneauth/' + deviceid + '?';
    loginurl += 'digest=' + digest + '&' + signinParams;
    var jsonData = {
       oneauthsec: {
          devicepref: prefoption
       }
    };
    return isResend = 'totp' === prefoption || 'scanqr' === prefoption ? !1 : !0, sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handleOneAuthDetails), !1
 }
 if ('yubikeysecauth' === signinathmode) {
    if (clearCommonError('yubikey'), !isWebAuthNSupported()) return showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.BrowserNotSupported')), !1;
    var loginurl = '/signin/v2/' + callmode + '/' + zuid + '/yubikey/self?' + signinParams;
    return sendRequestWithTemptoken(loginurl, '', !0, handleYubikeyDetails), !1
 }
 return isFormSubmited = !0, !1
 }
 
 function sendRequestWithTemptoken(action, params, async, callback, method) {
    'undefined' != typeof contextpath && (action = contextpath + action);
    var objHTTP = xhr();
    objHTTP.open(method ? method : 'POST', action, async), objHTTP.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8'), isValid(temptoken) && objHTTP.setRequestHeader('Z-Authorization', 'Zoho-ticket ' + temptoken), objHTTP.setRequestHeader('X-ZCSRF-TOKEN', csrfParam + '=' + euc(getCookie(csrfCookieName))), async &&(objHTTP.onreadystatechange = function () {
       if (4 == objHTTP.readyState) {
          if (0 === objHTTP.status) return handleConnectionError(), !1;
          callback && callback(objHTTP.responseText)
       }
    }), objHTTP.send(params), async ||callback && callback(objHTTP.responseText)
 }
 
 function showCommonError(field, message) {
    if (document.querySelector('.fielderror').val(''), document.querySelector('.changeloadbtn').matches(':visible')) {
       var btnvalue = I18N.get('login_id' === field ? 'IAM.NEXT' : 'password' === field ? 'IAM.SIGNIN' : 'IAM.VERIFY');
       changeButtonAction(btnvalue, !1)
    }
    'captcha' === field ? document.querySelector('#bcaptcha_container').matches(':visible') ? changeHip('bcaptcha_img', 'bcaptcha') : changeHip() : document.querySelector('#captcha_container,#bcaptcha_container').style.display = 'none';
    var container = field + '_container';
    return document.querySelector('#' + field).classList.add('errorborder'), document.querySelector('#' + container + ' .fielderror').classList.add('errorlabel'), document.querySelector('#' + container + ' .fielderror').innerHTML = message), document.querySelector('#' + container + ' .fielderror').slideDown(200), document.querySelector('#' + field).focus(), document.querySelector('#totpverifybtn').matches(':visible') && (document.querySelector('#totpverifybtn .loadwithbtn').style.display = 'none', document.querySelector('#totpverifybtn .waittext').classList.remove('loadbtntext')), !1
 }
 
 function callback_signin_lookup(msg) {
    return showCommonError('login_id', msg), document.querySelector('#nextbtn span').classList.remove('zeroheight'), document.querySelector('#nextbtn').classList.remove('changeloadbtn'), document.querySelector('#nextbtn').getAttribute('disabled', !1), document.querySelector('#nextbtn span').textContent = I18N.get('IAM.NEXT')), isFormSubmited = !1, !1
 }
 
 function changeButtonAction(textvalue, isSubmitted) {
    return document.querySelector('#nextbtn span').classList.remove('zeroheight'), document.querySelector('#nextbtn').classList.remove('changeloadbtn'), document.querySelector('#nextbtn').getAttribute('disabled', !1), document.querySelector('#nextbtn span').textContent = textvalue), isFormSubmited = isSubmitted, !1
 }
 
 function identifyEmailOrNum() {
    var userLogin = deviceauthdetails.lookup.loginid;
    return isPhoneNumber(userLogin.split('-')[1]) ? '+' + userLogin.split('-')[0] + ' ' + userLogin.split('-')[1] : userLogin
 }
 
 function enablePassword(loginId, isOTP, isSaml, isFederated, isNoPassword, isJwt, isEOTP) {
    if (changeButtonAction(I18N.get('IAM.SIGNIN'), !1), document.querySelector('#login_id_container,#showIDPs').slideUp(200), document.querySelector('#password_container').classList.remove('zeroheight'), document.querySelector('#password_container').slideDown(200), document.querySelector('.backbtn').style.display = '', document.querySelector('#captcha_container,.line').style.display = 'none', document.querySelector('.username').textContent = identifyEmailOrNum()), document.querySelector('#forgotpassword').style.display = 'none', !isFederated && isNoPassword && (isOTP || isEOTP)) {
    if (document.querySelector('#password_container .textbox_div,#nextbtn').style.display = 'none', document.querySelector('.nopassword_container').css('position', 'unset'), document.querySelector('.nopassword_container').css('width', '100%'), document.querySelector('.nopassword_container').style.display = '', !isOTP && !isEOTP) return !1;
    document.querySelector('#nextbtn').style.display = ''
 }
 if (document.querySelector('#password').focus(), signinathmode = 'passwordauth', isOTP && isEOTP ? (document.querySelector('#enablemore').style.display = '', document.querySelector('#enableforgot').style.display = 'none') : isOTP ? (document.querySelector('#enableotpoption').style.display = '', emobile = deviceauthdetails.lookup.modes.otp.data[0].e_mobile, rmobile = deviceauthdetails.lookup.modes.otp.data[0].r_mobile) : isEOTP && (document.querySelector('#enableotpoption').style.display = '', isEmailVerifyReqiured = deviceauthdetails.lookup.isUserName ? !0 : !1, emobile = deviceauthdetails.lookup.modes.email.data[0].e_email, rmobile = deviceauthdetails.lookup.modes.email.data[0].email), isSaml && document.querySelector('#enablesaml').style.display = '', isFederated) {
    document.querySelector('.fed_2show').style.display = '', document.querySelector('.fed_div').style.display = 'none', document.querySelector('.googleIcon').classList.remove('google_small_icon'), isOTP || isSaml || document.querySelector('#enableforgot').style.display = '';
    var idps = deviceauthdetails.lookup.modes.federated.data;
    if (idps.forEach(function (idps) {
          isValid(idps) && (idp = idps.idp.toLowerCase(), document.querySelector('.' + idp + '_fed').getAttribute('style', 'display:block !important'))
       }), document.querySelector('.apple_fed').matches(':visible')) {
       if (!isneedforGverify) return document.querySelector('.apple_fed').style.display = 'none', document.querySelector('#macappleicon').style.display = '', document.querySelector('.googleIcon').classList.add('google_small_icon'), !1;
       document.querySelector('#macappleicon').style.display = 'none'
    }
    isNoPassword && isFederated && !isOTP && !isEOTP && (document.querySelector('#password_container .textbox_div,#nextbtn').style.display = 'none', document.querySelector('.nopassword_container').css('position', 'absolute'), document.querySelector('.nopassword_container').style.display = '')
 }
 if (isNoPassword || document.querySelector('#signinwithpass').style.display = '', isJwt) {
    document.querySelector('#enablejwt').style.display = '';
    var redirectURI = deviceauthdetails.lookup.modes.jwt.redirect_uri;
    document.querySelector('.signinwithjwt').getAttribute('href', redirectURI)
 }
 return isOTP && isSaml && !isNoPassword && (document.querySelector('#enablemore').style.display = '', document.querySelector('#enableforgot').style.display = 'none'), (document.querySelector('#enablemore').matches(':visible') || document.querySelector('#enableotpoption').matches(':visible')) && document.querySelector('#enableforgot').style.display = 'none', !1
 }
 
 function enableSamlAuth(samlAuthDomain) {
    var login_id = deviceauthdetails.lookup.loginid;
    samlAuthDomain = void 0 === samlAuthDomain ? deviceauthdetails.lookup.modes.saml.data[0].auth_domain : samlAuthDomain;
    var loginurl = '/signin/v2/' + callmode + '/' + zuid + '/samlauth/' + samlAuthDomain + '?';
    loginurl += 'digest=' + digest + '&' + signinParams;
    var jsonData = {
       samlauth: {
          login_id: login_id
       }
    };
    return sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handleSamlAuthdetails), !1
 }
 
 function handleSamlAuthdetails(resp) {
    if (!IsJsonString(resp)) return showTopErrNotification(I18N.get('IAM.ERROR.GENERAL')), !1;
    var jsonStr = JSON.parse(resp);
    switchto(jsonStr.samlauth.redirect_uri)
 }
 
 function enableOTP(enablemode) {
    return showAndGenerateOtp(enablemode), !1
 }
 
 function enableMfaField(mfamode) {
    if (callmode = 'secondary', 'totp' === mfamode) document.querySelector('#password_container,#captcha_container,.fed_2show,#otp_container').style.display = 'none', document.querySelector('#headtitle').textContent = I18N.get('IAM.NEW.SIGNIN.TOTP')), document.querySelector('.service_name').textContent = I18N.get('IAM.NEW.SIGNIN.MFA.TOTP.HEADER')), document.querySelector('.product_text,.product_head,.MAppIcon,.OnaAuthHLink,.pwless_head,.pwless_text').style.display = 'none', document.querySelector('#product_img').classList.remove(document.querySelector('#product_img').getAttribute('class')), document.querySelector('#product_img').classList.add('tfa_totp_mode'), document.querySelector('#forgotpassword').style.display = 'none', document.querySelector('#nextbtn span').classList.remove('zeroheight'), document.querySelector('#nextbtn').classList.remove('changeloadbtn'), document.querySelector('#nextbtn').getAttribute('disabled', !1), document.querySelector('#nextbtn span').textContent = I18N.get('IAM.VERIFY')), document.querySelector('#mfa_totp_container').style.display = '', document.querySelector('.service_name').classList.add('extramargin'), document.querySelector('#mfa_totp').focus(), isFormSubmited = !1, callmode = 'secondary', goBackToProblemSignin(), signinathmode = 'totpsecauth';
 else if ('otp' === mfamode) {
    document.querySelector('#password_container,#captcha_container,.fed_2show,#otp_container').style.display = 'none';
    var isAMFA = deviceauthdetails[deviceauthdetails.resource_name].isAMFA,
       headTitle = I18N.get(isAMFA ? 'IAM.AC.CHOOSE.OTHER_MODES.MOBILE.HEADING' : 'IAM.NEW.SIGNIN.SMS.MODE');
    document.querySelector('#headtitle').textContent = headTitle);
 var descMsg = formatMessage(I18N.get('IAM.NEW.SIGNIN.OTP.HEADER'), rmobile);
 descMsg = isAMFA ? descMsg + formatMessage(I18N.get('IAM.NEW.SIGNIN.WHY.VERIFY'), suspisious_login_link) : descMsg, document.querySelector('.service_name').innerHTML = descMsg), document.querySelector('#product_img').classList.remove(document.querySelector('#product_img').getAttribute('class')), document.querySelector('#product_img').classList.add('tfa_otp_mode'), showTopNotification(formatMessage(I18N.get('IAM.NEW.SIGNIN.OTP.SENT'), rmobile)), document.querySelector('#mfa_otp_container,#mfa_otp_container .textbox_actions').style.display = '', document.querySelector('#forgotpassword').style.display = 'none', document.querySelector('.service_name').classList.add('extramargin'), document.querySelector('#nextbtn span').classList.remove('zeroheight'), document.querySelector('#nextbtn').classList.remove('changeloadbtn'), document.querySelector('#nextbtn').getAttribute('disabled', !1), document.querySelector('#nextbtn span').textContent = I18N.get('IAM.VERIFY')), document.querySelector('#mfa_otp').focus(), isFormSubmited = !1, goBackToProblemSignin(), callmode = 'secondary', signinathmode = 'otpsecauth'
 }
 return document.querySelector('.loader,.blur').style.display = 'none', isRecovery || allowedModeChecking(), !1
 }
 
 function enableMyZohoDevice(jsonStr, trymode) {
    jsonStr = isValid(jsonStr) ? jsonStr : deviceauthdetails, signinathmode = jsonStr.resource_name;
    var devicedetails = jsonStr[signinathmode].modes.mzadevice.data[parseInt(mzadevicepos)];
    deviceid = devicedetails.device_id, isSecondary = allowedmodes.length > 1 && -1 === allowedmodes.indexOf('recoverycode') && -1 === allowedmodes.indexOf('passphrase') ? !0 : !1, isSecondary = allowedmodes.length > 2 && -1 === allowedmodes.indexOf('recoverycode') && -1 === allowedmodes.indexOf('passphrase') ? !0 : isSecondary, isSecondary = -1 === allowedmodes.indexOf('recoverycode') && -1 === allowedmodes.indexOf('passphrase') && 3 === allowedmodes.length ? !1 : isSecondary, prefoption = trymode ? trymode : devicedetails.prefer_option, devicename = devicedetails.device_name, bioType = devicedetails.bio_type;
    var loginurl = '/signin/v2/' + callmode + '/' + zuid + '/device/' + deviceid + '?';
    loginurl += 'digest=' + digest + '&' + signinParams;
    var jsonData = 'primary' === callmode ? {
       deviceauth: {
          devicepref: prefoption
       }
    } : {
       devicesecauth: {
          devicepref: prefoption
       }
    };
    return sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handleMyZohoDetails), signinathmode = 'primary' === callmode ? 'deviceauth' : 'devicesecauth', !1
 }
 
 function enableOneauthDevice(jsonStr, index) {
    index = isValid(index) ? index : parseInt(oadevicepos), jsonStr = isValid(jsonStr) ? jsonStr : deviceauthdetails;
    var devicedetails = jsonStr[deviceauthdetails.resource_name].modes.oadevice.data[index];
    if (deviceid = devicedetails.device_id, prefoption = devicedetails.prefer_option, isFaceId = devicedetails.isFaceid, devicename = devicedetails.device_name, 'ONEAUTH_TOTP' === prefoption) return enableTOTPdevice(jsonStr, !1, !0), !1;
    var loginurl = '/signin/v2/' + callmode + '/' + zuid + '/oneauth/' + deviceid + '?';
    loginurl += 'digest=' + digest + '&' + signinParams;
    var jsonData = {
       oneauthsec: {
          devicepref: prefoption
       }
    };
    return sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handleOneAuthDetails), signinathmode = 'oneauthsec', !1
 }
 
 function enableYubikeyDevice(jsonStr) {
    if (signinathmode = jsonStr.resource_name, !isWebAuthNSupported()) return showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.BrowserNotSupported')), !1;
    var loginurl = '/signin/v2/' + callmode + '/' + zuid + '/yubikey/self?' + signinParams;
    return isSecondary = allowedmodes.length > 1 && -1 === allowedmodes.indexOf('recoverycode') ? !0 : !1, sendRequestWithTemptoken(loginurl, '', !0, handleYubikeyDetails), signinathmode = 'yubikeysecauth', isRecovery || allowedModeChecking(), !1
 }
 
 function enableTOTPdevice(resp, isMyZohoApp, isOneAuth) {
    document.querySelector('#password_container,#login_id_container,#captcha_container,.fed_2show,#otp_container').style.display = 'none', document.querySelector('#headtitle').textContent = I18N.get('IAM.NEW.SIGNIN.TOTP')), document.querySelector('.service_name').textContent = I18N.get('IAM.NEW.SIGNIN.MFA.TOTP.HEADER')), document.querySelector('.product_text,.product_head,.MAppIcon,.OnaAuthHLink,.pwless_head,.pwless_text').style.display = 'none', document.querySelector('#product_img').classList.remove(document.querySelector('#product_img').getAttribute('class')), document.querySelector('#product_img').classList.add('tfa_totp_mode'), document.querySelector('#forgotpassword').style.display = 'none', document.querySelector('#nextbtn span').classList.remove('zeroheight'), document.querySelector('#nextbtn').classList.remove('changeloadbtn'), document.querySelector('#nextbtn').getAttribute('disabled', !1), document.querySelector('#nextbtn span').textContent = I18N.get('IAM.VERIFY')), isMyZohoApp ? (document.querySelector('.deviceparent .devicetext').textContent = devicename), document.querySelector('.devicedetails .devicetext').textContent = devicename), document.querySelector('#mfa_device_container').style.display = '', document.querySelector('.tryanother').style.display = '', document.querySelector('.service_name').textContent = I18N.get('IAM.NEW.SIGNIN.TOTP.HEADER')), document.querySelector('#problemsignin,#recoverybtn,.loader,.blur,.deviceparent').style.display = 'none', clearCommonError('mfa_totp'), document.querySelector('.signin_container').classList.remove('mobile_signincontainer')): isOneAuth && document.querySelector('.service_name').textContent = I18N.get('IAM.NEW.SIGNIN.TOTP.HEADER')), document.querySelector('#mfa_totp_container').style.display = '', document.querySelector('#mfa_totp').focus(), document.querySelector('.service_name').classList.add('extramargin'), document.querySelector('#mfa_totp').val(''), isFormSubmited = !1;
 var mzauth = 'primary' === callmode ? 'deviceauth' : 'devicesecauth';
 return signinathmode = isMyZohoApp ? mzauth : 'oneauthsec', isMyZohoApp || isRecovery || allowedModeChecking(), !1
 }
 
 function enableOneAuthBackup() {
    changeRecoverOption(allowedmodes[0]), document.querySelector('#backup_container .backoption,#recovery_passphrase,#recovery_backup').style.display = 'none', -1 != allowedmodes.indexOf('passphrase') ? document.querySelector('#recovery_passphrase').style.display = '' : document.querySelector('#recovery_passphrase').style.display = 'none', -1 != allowedmodes.indexOf('recoverycode') ? document.querySelector('#recovery_backup').style.display = '' : document.querySelector('#recovery_backup').style.display = 'none'
 }
 
 function handleYubikeyDetails(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp),
          statusCode = jsonStr.status_code;
       if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) return 'throttles_limit_exceeded' === jsonStr.cause ? (showCommonError('yubikey', jsonStr.localized_message), !1) : (showCommonError('password', jsonStr.localized_message), !1);
       var successCode = jsonStr.code;
       return 'SI203' === successCode && (document.querySelector('.loader,.blur').style.display = 'none', showYubikeyDetails(), getAssertion(jsonStr.yubikeysecauth)), !1
    }
    var errorcontainer = 'passwordauth' === signinathmode ? 'password' : 'login_id';
    return showCommonError(errorcontainer, I18N.get(jsonStr.localized_message)), !1
 }
 
 function getAssertion(parameters) {
    var requestOptions = {};
    return requestOptions.challenge = strToBin(parameters.challenge), requestOptions.timeout = parameters.timeout, requestOptions.rpId = parameters.rpId, requestOptions.allowCredentials = credentialListConversion(parameters.allowCredentials), 'authenticatorSelection' in parameters && (requestOptions.authenticatorSelection = parameters.authenticatorSelection), requestOptions.extensions = {}, 'extensions' in parameters && 'appid' in parameters.extensions && (requestOptions.extensions.appid = parameters.extensions.appid), navigator.credentials.get({
       publicKey: requestOptions
    }).then(function (assertion) {
       var publicKeyCredential = {};
       'id' in assertion && (publicKeyCredential.id = assertion.id), 'type' in assertion && (publicKeyCredential.type = assertion.type), 'rawId' in assertion && (publicKeyCredential.rawId = binToStr(assertion.rawId)), assertion.response || (showCommonError('yubikey', formatMessage(I18N.get('IAM.WEBAUTHN.ERROR.AUTHENTICATION.InvalidResponse'), accounts_support_contact_email_id)), document.querySelector('#yubikey_container').style.display = '', showError());
       var _response = assertion.response;
       publicKeyCredential.response = {
          clientDataJSON: binToStr(_response.clientDataJSON),
          authenticatorData: binToStr(_response.authenticatorData),
          signature: binToStr(_response.signature),
          userHandle: binToStr(_response.userHandle)
       };
       var yubikey_sec_data = {};
       yubikey_sec_data.yubikeysecauth = publicKeyCredential, sendRequestWithTemptoken('/signin/v2/secondary/' + zuid + '/yubikey/self', JSON.stringify(yubikey_sec_data), !0, VerifySuccess, 'PUT')
    }).catch(function (err) {
       'NotAllowedError' == err.name ? showCommonError('yubikey', I18N.get('IAM.WEBAUTHN.ERROR.NotAllowedError')) : 'InvalidStateError' == err.name ? showCommonError('yubikey', I18N.get('IAM.WEBAUTHN.ERROR.AUTHENTICATION.InvalidStateError')) : 'AbortError' == err.name ? showCommonError('yubikey', I18N.get('IAM.WEBAUTHN.ERROR.AbortError')) : 'UnknownError' == err.name ? showCommonError('yubikey', formatMessage(I18N.get('IAM.WEBAUTHN.ERROR.UnknownError'), accounts_support_contact_email_id)) : showCommonError('yubikey', formatMessage(I18N.get('IAM.WEBAUTHN.ERROR.AUTHENTICATION.ErrorOccurred'), accounts_support_contact_email_id) + '<br>' + err.toString()), document.querySelector('#yubikey_container').style.display = '', showError()
    })
 }
 
 function showYubikeyDetails() {
    var headtitle = 'IAM.NEW.SIGNIN.YUBIKEY.TITLE',
       headerdesc = isMobile ? 'IAM.NEW.SIGNIN.YUBIKEY.HEADER.NEW.FOR.MOBILE' : 'IAM.NEW.SIGNIN.YUBIKEY.HEADER.NEW';
    return document.querySelector('#password_container,#login_id_container,#captcha_container,.fed_2show,#otp_container').style.display = 'none', document.querySelector('#headtitle').textContent = I18N.get(headtitle)), document.querySelector('.service_name').textContent = I18N.get(headerdesc)), document.querySelector('.product_text,.product_head,.MAppIcon,.OnaAuthHLink,.pwless_head,.pwless_text').style.display = 'none', document.querySelector('#product_img').classList.remove(document.querySelector('#product_img').getAttribute('class')), document.querySelector('#product_img').classList.add('tfa_yubikey_mode'), document.querySelector('#forgotpassword').style.display = 'none', document.querySelector('#nextbtn').style.display = 'none', document.querySelector('.service_name').classList.add('extramargin'), document.querySelector('.deviceparent').classList.remove('hide'), document.querySelector('.deviceparent').css('display', ''), document.querySelector('#mfa_device_container,.devicedetails').style.display = '', document.querySelector('.devices .selection').style.display = 'none', document.querySelector('#waitbtn').style.display = '', document.querySelector('.loadwithbtn').style.display = '', document.querySelector('.waitbtn .waittext').textContent = I18N.get('IAM.NEW.SIGNIN.WAITING.APPROVAL')), document.querySelector('#waitbtn').getAttribute('disabled', !0), isRecovery || allowedModeChecking(), !1
 }
 
 function handleLookupDetails(resp, isExtUserVerified, ispasskeyfailed) {
    if (document.querySelector('.blur,.loader').matches(':visible') && document.querySelector('.blur,.loader').style.display = 'none', !IsJsonString(resp)) return callback_signin_lookup(I18N.get('IAM.ERROR.GENERAL')), !1;
    var jsonStr = JSON.parse(resp),
       statusCode = jsonStr.status_code;
    if (isClientPortal && 'U300' === jsonStr.code) {
       if (isValid(jsonStr.lookup.signup_url)) {
          var form = document.createElement('form');
          form.setAttribute('id', 'signupredirection'), form.setAttribute('method', 'POST'), form.setAttribute('action', jsonStr.lookup.signup_url), form.setAttribute('target', '_self');
          var hiddenField = document.createElement('input'),
             csrfField = document.createElement('input');
          return csrfField.setAttribute('type', 'hidden'), csrfField.setAttribute('name', csrfParam), csrfField.setAttribute('value', getCookie(csrfCookieName)), hiddenField.setAttribute('type', 'hidden'), hiddenField.setAttribute('name', 'LOGIN_ID'), hiddenField.setAttribute('value', jsonStr.lookup.loginid), form.appendChild(hiddenField), form.appendChild(csrfField), document.documentElement.appendChild(form), form.submit(), !1
       }
       return !1
    }
    if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) {
       if ('throttles_limit_exceeded' === jsonStr.cause) return callback_signin_lookup(jsonStr.localized_message), !1;
       var error_resp = jsonStr.errors[0],
          errorCode = error_resp.code,
          errorMessage = jsonStr.localized_message;
       if ('U400' === errorCode) {
          var loginid = jsonStr.data.loginid;
          if (loginid && (isEmailId(loginid) || isUserName(loginid)) || isPhoneNumber(loginid.split('-')[1])) {
             var deploymentUrl = jsonStr.data.redirect_uri,
                signinParams = removeParamFromQueryString('LOGIN_ID'),
                loginurl = deploymentUrl + '/signin?' + signinParams,
                oldForm = document.getElementById('signinredirection');
             oldForm && document.documentElement.removeChild(oldForm);
             var form = document.createElement('form');
             form.setAttribute('id', 'signinredirection'), form.setAttribute('method', 'POST'), form.setAttribute('action', loginurl), form.setAttribute('target', '_parent');
             var hiddenField = document.createElement('input');
             return hiddenField.setAttribute('type', 'hidden'), hiddenField.setAttribute('name', 'LOGIN_ID'), hiddenField.setAttribute('value', loginid), form.appendChild(hiddenField), document.documentElement.appendChild(form), form.submit(), !1
          }
          return !1
       }
       return 'U201' === errorCode ? (switchto(error_resp.redirect_uri), !1) : 'IN107' === errorCode || 'IN108' === errorCode ? (document.querySelector('.fed_2show,.line').style.display = 'none', cdigest = jsonStr.cdigest, showHip(cdigest), showCaptcha(I18N.get('IAM.NEXT'), !1, 'login_id'), 'IN107' === errorCode && showCommonError('captcha', errorMessage), !1) : 'U401' === errorCode ? (callback_signin_lookup(errorMessage), !1) : 'R303' === errorCode ? (showRestrictsignin(), !1) : (callback_signin_lookup(errorMessage), !1)
    }
    if (document.querySelector('.fed_2show,.line,#signuplink,.banner_newtoold').style.display = 'none', document.querySelector('#smartsigninbtn').classList.add('hide'), digest = jsonStr[signinathmode].digest, zuid = jsonStr[signinathmode].identifier, isPhoneNumber(de('login_id').value) && document.querySelector('#login_id').val(document.querySelector('#country_code_select').value.split('+')[1] + '-' + document.querySelector('#login_id').value), deviceauthdetails = jsonStr, isExtUserVerified) document.querySelector('.externaluser_container,#continuebtn').style.display = 'none', document.querySelector('#forgotpassword,#nextbtn').style.display = '', document.querySelector('#login_id_container,#showIDPs').slideDown(200), document.querySelector('#password_container').classList.add('zeroheight'), document.querySelector('#password_container .textbox_div').style.display = '';
    else if (jsonStr[signinathmode].ext_usr) {
       document.querySelector('#forgotpassword,#nextbtn').style.display = 'none';
       var loginId = jsonStr[signinathmode].loginid ? jsonStr[signinathmode].loginid : de('login_id').value;
       return document.querySelector('#login_id_container,#showIDPs').slideUp(200), document.querySelector('#password_container').classList.remove('zeroheight'), document.querySelector('#password_container').slideDown(200), document.querySelector('.username').textContent = identifyEmailOrNum()), document.querySelector('#password_container .textbox_div').style.display = 'none', document.querySelector('.externaluser_container').innerHTML = jsonStr[signinathmode].ext_msg), document.querySelector('.externaluser_container,#continuebtn').style.display = '', !1
 }
 var adminEmail = jsonStr[signinathmode].admin;
 'undefined' != typeof adminEmail && (document.querySelector('.contact_support .option_title').innerHTML = I18N.get('IAM.NEW.SIGNIN.CONTACT.ADMIN.TITLE')), document.querySelector('.contact_support .contactsuprt').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.CONTACT.ADMIN.DESC'), adminEmail)));
 var isOTP = isSaml = isFederated = isNoPassword = isJwt = isEOTP = !1;
 if (isEmpty(jsonStr[signinathmode].modes) || !isValid(jsonStr[signinathmode].modes)) {
    changeButtonAction(I18N.get('IAM.SIGNIN'), !1), document.querySelector('#forgotpassword').style.display = 'none';
    var loginId = jsonStr[signinathmode].loginid ? jsonStr[signinathmode].loginid : de('login_id').value;
    return document.querySelector('#login_id_container,#showIDPs').slideUp(200), document.querySelector('#password_container').classList.remove('zeroheight'), document.querySelector('#password_container').slideDown(200), identifyEmailOrNum(loginId), document.querySelector('.username').textContent = identifyEmailOrNum()), document.querySelector('#password_container .textbox_div,#nextbtn').style.display = 'none', document.querySelector('.nopassword_container').css('position', 'absolute'), document.querySelector('.nopassword_container').style.display = '', document.querySelector('#captcha_container').style.display = 'none', !1
 }
 isPrimaryMode = !0, allowedmodes = jsonStr[signinathmode].modes.allowed_modes, prev_showmode = allowedmodes[0];
 var altmode = allowedmodes[1],
    isothermodeavailable = 'undefined' != typeof altmode;
 if (isNoPassword = !0, document.querySelector('.otp_actions .signinwithjwt,.otp_actions .signinwithsaml,.otp_actions .showmoresigininoption').style.display = 'none', ispasskeyfailed && (allowedmodes.splice(allowedmodes.indexOf('passkey'), 1), isPasswordless = !1), 'passkey' === allowedmodes[0]) {
    if (!isWebAuthNSupported()) return showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.BrowserNotSupported')), changeButtonAction(I18N.get('IAM.NEXT'), !1), !1;
    isPasswordless = !0, enableWebauthnDevice()
 } else {
    if ('password' === allowedmodes[0] || 'federated' === allowedmodes[0]) {
       if (isothermodeavailable) {
          var samlcount = jsonStr[signinathmode].modes && jsonStr[signinathmode].modes.saml && jsonStr[signinathmode].modes && jsonStr[signinathmode].modes.saml.count;
          if (-1 != allowedmodes.indexOf('otp') && -1 != allowedmodes.indexOf('saml') || samlcount > 1) document.querySelector('#enablemore').style.display = '', document.querySelector('#enableforgot').style.display = 'none';
          else if (-1 != allowedmodes.indexOf('otp') && -1 != allowedmodes.indexOf('jwt')) document.querySelector('#enablemore').style.display = '', document.querySelector('#enableforgot').style.display = 'none';
          else if (-1 != allowedmodes.indexOf('otp') && -1 != allowedmodes.indexOf('email')) document.querySelector('#enablemore').style.display = '', document.querySelector('#enableforgot').style.display = 'none';
          else if (-1 != allowedmodes.indexOf('saml') && -1 != allowedmodes.indexOf('email')) document.querySelector('#enablemore').style.display = '', document.querySelector('#enableforgot').style.display = 'none';
          else if (allowedmodes.length >= 2) return allowedmodes.forEach(function (usedmodes) {
             switch (usedmodes) {
                case 'otp':
                   isOTP = !0;
                   break;
                case 'saml':
                   isSaml = !0;
                   break;
                case 'jwt':
                   isJwt = !0;
                   break;
                case 'federated':
                   isFederated = !0;
                   break;
                case 'password':
                   isNoPassword = !1;
                   break;
                case 'email':
                   isEOTP = !0
             }
          }), enablePassword(jsonStr[signinathmode].loginid, isOTP, isSaml, isFederated, isNoPassword, isJwt, isEOTP), (document.querySelector('#enablemore').matches(':visible') || document.querySelector('#enableotpoption').matches(':visible')) && document.querySelector('#enableforgot').style.display = 'none', !1
       } else 'federated' === allowedmodes[0] && (isFederated = !0, isNoPassword = !0), document.querySelector('#enableforgot').style.display = '';
       return enablePassword(deviceauthdetails.lookup.loginid, isOTP, isSaml, isFederated, isNoPassword, isJwt, isEOTP), !1
    }
    if ('otp' === allowedmodes[0] || 'email' === allowedmodes[0]) return isEmailVerifyReqiured = jsonStr[signinathmode].isUserName && 'email' === allowedmodes[0] ? !0 : !1, emobile = 'otp' === allowedmodes[0] ? jsonStr[signinathmode].modes.otp.data[0].e_mobile : jsonStr[signinathmode].modes.email.data[0].e_email, rmobile = 'otp' === allowedmodes[0] ? jsonStr[signinathmode].modes.otp.data[0].r_mobile : jsonStr[signinathmode].modes.email.data[0].email, document.querySelector('#signinwithpass').style.display = 'none', isNoPassword = !0, allowedmodes.length >= 2 && allowedmodes.forEach(function (usedmodes) {
       switch (usedmodes) {
          case 'otp':
             isOTP = !0;
             break;
          case 'password':
             isNoPassword = !1;
             break;
          case 'saml':
             isSaml = !0;
             break;
          case 'jwt':
             isJwt = !0;
             break;
          case 'federated':
             isFederated = !0;
             break;
          case 'email':
             isEOTP = !0
       }
    }), enablePassword(jsonStr[signinathmode].loginid, isOTP, isSaml, isFederated, isNoPassword, isJwt, isEOTP), document.querySelector('.otp_actions .signinwithjwt,.otp_actions .signinwithsaml,.otp_actions .showmoresigininoption').style.display = 'none', enableOTP(allowedmodes[0]), isSaml && document.querySelector('#enablesaml').style.display = '', !1;
    if ('mzadevice' === allowedmodes[0]) return isPasswordless = !0, secondarymodes = allowedmodes, enableMyZohoDevice(jsonStr), handleSecondaryDevices(allowedmodes[0]), !1;
    if ('saml' === allowedmodes[0]) {
       var isMoreSaml = jsonStr[signinathmode].modes.saml.count > 1;
       if (isMoreSaml) document.querySelector('#login_id_container,#showIDPs').slideUp(200), showmoresigininoption(isMoreSaml), document.querySelector('.backoption,#forgotpassword').style.display = 'none';
       else if (allowedmodes.length > 1) enableSamlAuth();
       else {
          var redirecturi = jsonStr[signinathmode].modes.saml.data[0].redirect_uri;
          switchto(redirecturi)
       }
       return !1
    }
    if ('jwt' === allowedmodes[0]) {
       var redirecturi = jsonStr[signinathmode].modes.jwt.redirect_uri;
       return switchto(redirecturi), !1
    }
 }
 return !1
 }
 
 function enableWebauthnDevice() {
    if (!isWebAuthNSupported()) return showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.BrowserNotSupported')), !1;
    var loginurl = uriPrefix + '/signin/v2/primary/' + zuid + '/passkey/self?';
    return loginurl += 'digest=' + digest + '&' + signinParams, sendRequestWithCallback(loginurl, '', !0, handleWebauthnDevice), !1
 }
 
 function handleWebauthnDevice(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp),
          statusCode = jsonStr.status_code;
       if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) return 'throttles_limit_exceeded' === jsonStr.cause ? (showCommonError('yubikey', jsonStr.localized_message), !1) : (showCommonError('password', jsonStr.localized_message), !1);
       var successCode = jsonStr.code;
       return 'SI203' === successCode && getAssertionLookup(jsonStr.passkeyauth), !1
    }
    var errorcontainer = 'passwordauth' === signinathmode ? 'password' : 'login_id';
    return showCommonError(errorcontainer, I18N.get(jsonStr.localized_message)), !1
 }
 
 function getAssertionLookup(parameters) {
    var requestOptions = {};
    return requestOptions.challenge = strToBin(parameters.challenge), requestOptions.timeout = parameters.timeout, requestOptions.rpId = parameters.rpId, requestOptions.allowCredentials = credentialListConversion(parameters.allowCredentials), 'authenticatorSelection' in parameters && (requestOptions.authenticatorSelection = parameters.authenticatorSelection), requestOptions.extensions = {}, 'extensions' in parameters && 'appid' in parameters.extensions && (requestOptions.extensions.appid = parameters.extensions.appid), navigator.credentials.get({
       publicKey: requestOptions
    }).then(function (assertion) {
       var publicKeyCredential = {};
       'id' in assertion && (publicKeyCredential.id = assertion.id), 'type' in assertion && (publicKeyCredential.type = assertion.type), 'rawId' in assertion && (publicKeyCredential.rawId = binToStr(assertion.rawId)), assertion.response || (showTopErrNotification(formatMessage(I18N.get('IAM.WEBAUTHN.ERROR.AUTHENTICATION.PASSKEY.InvalidResponse'), accounts_support_contact_email_id)), signinathmode = 'lookup', handleLookupDetails(JSON.stringify(deviceauthdetails), !1, !0));
       var _response = assertion.response;
       publicKeyCredential.response = {
          clientDataJSON: binToStr(_response.clientDataJSON),
          authenticatorData: binToStr(_response.authenticatorData),
          signature: binToStr(_response.signature),
          userHandle: binToStr(_response.userHandle)
       };
       var passkey_data = {};
       passkey_data.passkeyauth = publicKeyCredential, sendRequestWithTemptoken('/signin/v2/primary/' + zuid + '/passkey/self?digest=' + digest + '&' + signinParams, JSON.stringify(passkey_data), !0, VerifySuccess, 'PUT')
    }).catch(function (err) {
       'NotAllowedError' == err.name ? (showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.NotAllowedError')), signinathmode = 'lookup', handleLookupDetails(JSON.stringify(deviceauthdetails), !1, !0)) : 'InvalidStateError' == err.name ? (showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.AUTHENTICATION.PASSKEY.InvalidStateError')), signinathmode = 'lookup', handleLookupDetails(JSON.stringify(deviceauthdetails), !1, !0)) : 'AbortError' == err.name ? (showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.AbortError')), signinathmode = 'lookup', handleLookupDetails(JSON.stringify(deviceauthdetails), !1, !0)) : 'TypeError' == err.name ? (showTopErrNotificationStatic(I18N.get('IAM.WEBAUTHN.ERROR.TYPE.ERROR'), formatMessage(I18N.get('IAM.WEBAUTHN.ERROR.HELP.HOWTO'), passkeyURL)), signinathmode = 'lookup', handleLookupDetails(JSON.stringify(deviceauthdetails), !1, !0)) : (showTopErrNotification(formatMessage(I18N.get('IAM.WEBAUTHN.ERROR.AUTHENTICATION.PASSKEY.ErrorOccurred'), accounts_support_contact_email_id) + '<br>' + err.toString()), signinathmode = 'lookup', handleLookupDetails(JSON.stringify(deviceauthdetails), !1, !0))
    })
 }
 
 function showmoresigininoption(isMoreSaml) {
    if (isPasswordless) return document.querySelector('#enableoptionsoneauth').matches(':visible') ? document.querySelector('#enableoptionsoneauth').style.display = 'none' : document.querySelector('#enableoptionsoneauth').style.display = '', -1 != allowedmodes.indexOf('otp') || 'otp' == prev_showmode ? document.querySelector('#signinwithotponeauth').css('display', 'block') : document.querySelector('#signinwithotponeauth').style.display = 'none', -1 != allowedmodes.indexOf('email') || 'email' == prev_showmode ? document.querySelector('#passlessemailverify').css('display', 'block') : document.querySelector('#passlessemailverify').style.display = 'none', -1 != allowedmodes.indexOf('saml') || 'saml' == prev_showmode ? document.querySelector('.signinwithsamloneauth').css('display', 'block') : document.querySelector('.signinwithsamloneauth').style.display = 'none', -1 != allowedmodes.indexOf('jwt') || 'jwt' == prev_showmode ? document.querySelector('.signinwithfedoneauth').css('display', 'block') : document.querySelector('.signinwithfedoneauth').style.display = 'none', -1 != allowedmodes.indexOf('federated') || 'federated' == prev_showmode ? document.querySelector('.signinwithfedoneauth').css('display', 'block') : document.querySelector('.signinwithfedoneauth').style.display = 'none', -1 != allowedmodes.indexOf('otp') ? document.querySelector('#signinwithotponeauth').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.PASSWORDLESS.OTP.VERIFY.TITLE'), deviceauthdetails[deviceauthdetails.resource_name].modes.email.data[0].r_mobile)): '', -1 != allowedmodes.indexOf('email') ? document.querySelector('#passlessemailverify').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.PASSWORDLESS.EMAIL.VERIFY.TITLE'), deviceauthdetails[deviceauthdetails.resource_name].modes.email.data[0].email)): '', !1;
 document.querySelector('#enablemore').style.display = 'none', isMoreSaml || (allowedmodes.splice(allowedmodes.indexOf(prev_showmode), 1), allowedmodes.unshift(prev_showmode)), document.querySelector('#emailverify_container').style.display = 'none', document.querySelector('#login').style.display = '';
 var problemsignin_con = '',
    backoption = 'getbackemailverify' === isMoreSaml ? 'getbackemailverify()' : 'hideSigninOptions()',
    i18n_msg = {
       otp: ['IAM.NEW.SIGNIN.OTP.TITLE', 'IAM.NEW.SIGNIN.OTP.HEADER'],
       saml: ['IAM.NEW.SIGNIN.SAML.TITLE', 'IAM.NEW.SIGNIN.SAML.HEADER'],
       password: ['IAM.NEW.SIGNIN.PASSWORD.TITLE', 'IAM.NEW.SIGNIN.PASSWORD.HEADER'],
       jwt: ['IAM.NEW.SIGNIN.JWT.TITLE', 'IAM.NEW.SIGNIN.SAML.HEADER'],
       email: ['IAM.NEW.SIGNIN.EMAIL.TITLE', 'IAM.NEW.SIGNIN.OTP.HEADER']
    },
    problemsigninheader = '<div class='
 problemsignin_head '><span class='
 icon - backarrow backoption ' onclick='
 '+backoption+'
 '></span>' + I18N.get('IAM.NEW.SIGNIN.CHOOSE.OTHER.WAY') + '</div>';
 return allowedmodes.forEach(function (prob_mode, position) {
    if (0 != position || isMoreSaml) {
       var saml_position, secondary_header = i18n_msg[prob_mode] ? I18N.get(i18n_msg[prob_mode][0]) : '',
          secondary_desc = i18n_msg[prob_mode] ? I18N.get(i18n_msg[prob_mode][1]) : '';
       if ('otp' === prob_mode) emobile = deviceauthdetails.lookup.modes.otp.data[0].e_mobile, rmobile = deviceauthdetails.lookup.modes.otp.data[0].r_mobile, secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), rmobile), problemsignin_con += createSigninMoreOptions(prob_mode, saml_position, secondary_header, secondary_desc);
       else if ('saml' === prob_mode) {
          var saml_modes = deviceauthdetails.lookup.modes.saml.data;
          saml_modes.forEach(function (data, index) {
             var displayname = deviceauthdetails.lookup.modes.saml.data[index].display_name,
                domainname = deviceauthdetails.lookup.modes.saml.data[index].domain;
             secondary_header = formatMessage(I18N.get(i18n_msg[prob_mode][0]), displayname), secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), domainname), saml_position = index, problemsignin_con += createSigninMoreOptions(prob_mode, saml_position, secondary_header, secondary_desc)
          })
       } else if ('jwt' === prob_mode) {
          var domainname = deviceauthdetails.lookup.modes.jwt.domain;
          secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), domainname), problemsignin_con += createSigninMoreOptions(prob_mode, saml_position, secondary_header, secondary_desc)
       } else if ('email' === prob_mode) emobile = deviceauthdetails.lookup.modes.email.data[0].e_email, rmobile = deviceauthdetails.lookup.modes.email.data[0].email, secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), rmobile), problemsignin_con += createSigninMoreOptions(prob_mode, saml_position, secondary_header, secondary_desc);
       else if ('federated' === prob_mode) {
          var count = deviceauthdetails.lookup.modes.federated.count,
             idp = deviceauthdetails.lookup.modes.federated.data[0].idp.toLocaleLowerCase(),
             secondary_header = count > 1 ? I18N.get('IAM.NEW.SIGNIN.MORE.FEDRATED.ACCOUNTS.TITLE') : '<span style='
          text - transform: capitalize;
          '>' + idp + '</span>', secondary_desc = count > 1 ? I18N.get('IAM.NEW.SIGNIN.MORE.FEDRATED.ACCOUNTS.DESC') : formatMessage(I18N.get('IAM.NEW.SIGNIN.IDENTITY.PROVIDER.TITLE'), idp);
          problemsignin_con += createSigninMoreOptions(prob_mode, count, secondary_header, secondary_desc)
       } else problemsignin_con += createSigninMoreOptions(prob_mode, saml_position, secondary_header, secondary_desc)
    }
 }), document.querySelector('#problemsigninui').innerHTML = problemsigninheader + '<div class='
 problemsignincon '>' + problemsignin_con + '</div>'), document.querySelector('#password_container,#nextbtn,.signin_head,#otp_container,#captcha_container,.fed_2show').style.display = 'none', document.querySelector('#problemsigninui').style.display = '', !1
 }
 
 function createSigninMoreOptions(prob_mode, saml_position, secondary_header, secondary_desc) {
    var prefer_icon = prob_mode,
       secondary_con = '<div class='
    optionstry options_hover ' id='
    secondary_ '+prob_mode+'
    ' onclick=showallowedmodes('
    '+prob_mode+'
    ','
    '+saml_position+'
    ')>							<div class='
    img_option_try img_option icon - '+prefer_icon+'
    '></div>							<div class='
    option_details_try decreasewidth '>								<div class='
    option_title_try '>' + secondary_header + '</div>								<div class='
    option_description '>' + secondary_desc + '</div>							</div>						</div>';
    return secondary_con
 }
 
 function handlePasswordDetails(resp) {
    if (!IsJsonString(resp)) {
       var errorfield = document.querySelector('#emailverify').matches(':visible') ? 'emailverify' : 'otpauth' === signinathmode ? 'otp' : 'password';
       return showCommonError(errorfield, I18N.get('IAM.ERROR.GENERAL')), !1
    }
    var jsonStr = JSON.parse(resp);
    signinathmode = jsonStr.resource_name;
    var statusCode = jsonStr.status_code;
    if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) {
       if ('throttles_limit_exceeded' === jsonStr.cause) {
          var errorfield = document.querySelector('#emailverify').matches(':visible') ? 'emailverify' : 'otpauth' === signinathmode ? 'otp' : 'password';
          return showCommonError(errorfield, jsonStr.localized_message), !1
       }
       var error_resp = jsonStr.errors[0],
          errorCode = error_resp.code,
          errorMessage = jsonStr.localized_message;
       if ('IN107' === errorCode || 'IN108' === errorCode) return cdigest = jsonStr.cdigest, showHip(cdigest), showCaptcha(I18N.get('IAM.NEXT'), !1, 'password'), 'IN107' === errorCode && showCommonError('captcha', errorMessage), !1;
       if ('R303' === errorCode) return showRestrictsignin(), !1;
       var errorfield = document.querySelector('#emailverify').matches(':visible') ? 'emailverify' : 'otpauth' === signinathmode ? 'otp' : 'password';
       return showCommonError(errorfield, errorMessage), !1
    }
    zuid = zuid ? zuid : jsonStr[signinathmode].identifier, restrictTrustMfa = jsonStr[signinathmode].restrict_trust_mfa || jsonStr[signinathmode].isAMFA, restrictTrustMfa || (trustMfaDays = '' + jsonStr[signinathmode].trust_mfa_days), document.querySelector('.overlapBanner,.dotHead,#emailverify_container').style.display = 'none', document.querySelector('.mfa_panel,#login').style.display = '';
    var successCode = jsonStr.code;
    return jsonStr[signinathmode].isAMFA && (document.querySelector('#problemsignin').textContent = I18N.get('IAM.AC.VIEW.OPTION')), document.querySelector('#recoverybtn').textContent = I18N.get('IAM.NEW.SIGNIN.PROBLEM.SIGNIN'))), 'SI302' === successCode || 'SI200' === successCode || 'SI300' === successCode || 'SI301' === successCode || 'SI303' === successCode ? (switchto(jsonStr[signinathmode].redirect_uri), !1) : 'P500' === successCode || 'P501' === successCode ? (temptoken = jsonStr[signinathmode].token, showPasswordExpiry(jsonStr[signinathmode].pwdpolicy), !1) : 'MFA302' === successCode ? (document.querySelector('#enablemore').style.display = 'none', isValid(digest) || (digest = jsonStr[signinathmode].digest), allowedmodes = jsonStr[signinathmode].modes.allowed_modes, void 0 == allowedmodes || -1 == allowedmodes.indexOf('yubikey') || isWebAuthNSupported() ? allowedmodes.length < 1 ? (showCantAccessDevice(), document.querySelector('#product_img').classList.remove(document.querySelector('#product_img').getAttribute('class')), document.querySelector('#product_img').classList.add('tfa_ga_mode'), document.querySelector('#recovery_container .backoption').style.display = 'none', !1) : (isPrimaryMode = !1, deviceauthdetails = jsonStr, isSecondary = allowedmodes.length > 1 && -1 === allowedmodes.indexOf('recoverycode') ? !0 : !1, temptoken = jsonStr[signinathmode].token, secondarymodes = allowedmodes, prev_showmode = allowedmodes[0], handleSecondaryDevices(prev_showmode), isPasswordless ? (callmode = 'secondary', showMoreSigninOptions(), document.querySelector('#product_img').classList.remove(document.querySelector('#product_img').getAttribute('class')), document.querySelector('#product_img').classList.add('tfa_ga_mode'), !1) : 'otp' === allowedmodes[0] || 'email' === allowedmodes[0] ? (emobile = 'otp' === allowedmodes[0] ? jsonStr[signinathmode].modes.otp && jsonStr[signinathmode].modes.otp.data[0].e_mobile : jsonStr[signinathmode].modes.email && jsonStr[signinathmode].modes.email.data[0].e_email, rmobile = 'otp' === allowedmodes[0] ? jsonStr[signinathmode].modes.otp && jsonStr[signinathmode].modes.otp.data[0].r_mobile : jsonStr[signinathmode].modes.email && jsonStr[signinathmode].modes.email.data[0].email, callmode = 'secondary', 'email' === allowedmodes[0] ? emailposition = 0 : mobposition = 0, generateOTP(), !1) : 'mzadevice' === allowedmodes[0] ? (callmode = 'secondary', enableMyZohoDevice(jsonStr), !1) : 'oadevice' === allowedmodes[0] ? (callmode = 'secondary', enableOneauthDevice(jsonStr, oadevicepos), !1) : 'yubikey' === allowedmodes[0] ? (callmode = 'secondary', enableYubikeyDevice(jsonStr), !1) : 'recoverycode' === allowedmodes[0] || 'passphrase' === allowedmodes[0] ? (callmode = 'secondary', enableOneAuthBackup(), !1) : (enableMfaField(allowedmodes[0]), !1)) : (showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.BrowserNotSupported')), changeButtonAction(I18N.get('IAM.NEXT'), !1), !1)) : !1
 }
 
 function handleTotpDetails(resp) {
    if (!IsJsonString(resp)) {
       var container = 'otpsecauth' === signinathmode ? 'mfa_otp' : 'otpauth' === signinathmode ? 'otp' : 'mfa_totp';
       return container = isTroubleSignin ? 'verify_totp' : container, showCommonError(container, I18N.get('IAM.ERROR.GENERAL')), !1
    }
    var jsonStr = JSON.parse(resp);
    signinathmode = jsonStr.resource_name;
    var statusCode = jsonStr.status_code,
       container = 'otpsecauth' === signinathmode ? 'mfa_otp' : 'otpauth' === signinathmode ? 'otp' : 'mfa_totp';
    if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) {
       if (container = isTroubleSignin ? 'verify_totp' : 'email' === prev_showmode ? 'mfa_email' : container, 'throttles_limit_exceeded' === jsonStr.cause) return showCommonError(container, jsonStr.localized_message), !1;
       var error_resp = jsonStr.errors[0],
          errorCode = error_resp.code,
          errorMessage = jsonStr.localized_message;
       return 'IN107' === errorCode || 'IN108' === errorCode ? (cdigest = jsonStr.cdigest, showHip(cdigest), showCaptcha(I18N.get('IAM.NEXT'), !1, container), 'IN107' === errorCode && showCommonError('captcha', errorMessage), !1) : 'R303' === errorCode ? (showRestrictsignin(), !1) : (showCommonError(container, errorMessage), !1)
    }
    document.querySelector('.go_to_bk_code_container').classList.remove('show_bk_pop');
    var successCode = jsonStr.code,
       statusmsg = jsonStr[signinathmode].status;
    return 'SI302' === successCode || 'SI200' === successCode || 'SI300' === successCode || 'SI301' === successCode || 'SI303' === successCode ? (switchto(jsonStr[signinathmode].redirect_uri), !1) : 'success' === statusmsg ? restrictTrustMfa ? (updateTrustDevice(!1), !1) : (showTrustBrowser(), !1) : 'P500' === successCode || 'P501' === successCode ? (temptoken = jsonStr[signinathmode].token, showPasswordExpiry(jsonStr[signinathmode].pwdpolicy), !1) : !1
 }
 
 function handleMyZohoDetails(resp) {
    if (!IsJsonString(resp)) {
       var errorcontainer = 'passwordauth' === signinathmode ? 'password' : 'login_id';
       return showCommonError(errorcontainer, I18N.get('IAM.ERROR.GENERAL')), !1
    }
    var jsonStr = JSON.parse(resp);
    signinathmode = jsonStr.resource_name;
    var statusCode = jsonStr.status_code;
    if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) {
       var errorcontainer = isPasswordless ? 'login_id' : 'totp' === prefoption ? 'mfa_totp' : document.querySelector('#password_container').matches(':visible') ? 'password' : document.querySelector('#otp_container').matches(':visible') ? 'otp' : 'yubikey';
       errorcontainer = isResend ? 'yubikey' : errorcontainer, 'yubikey' === errorcontainer ? document.querySelector('#yubikey_container').style.display = '' : document.querySelector('#yubikey_container').style.display = 'none';
       var error_resp = jsonStr.errors && jsonStr.errors[0],
          errorCode = error_resp && error_resp.code;
       if ('D105' === errorCode) return document.querySelector('.fed_2show').style.display = 'none', showCommonError(errorcontainer, jsonStr.localized_message), isRecovery || allowedModeChecking(), !1;
       if (document.querySelector('#problemsignin,#recoverybtn').style.display = 'none', 'throttles_limit_exceeded' === jsonStr.cause) return showCommonError(errorcontainer, jsonStr.localized_message), document.querySelector('.loader,.blur').style.display = 'none', !1;
       if ('pattern_not_matched' === jsonStr.cause) return changeHip(), showCommonError('captcha', jsonStr.localized_message), document.querySelector('.loader,.blur').style.display = 'none', !1;
       if ('R303' === errorCode) return showRestrictsignin(), !1;
       var error_resp = jsonStr.errors[0],
          errorCode = error_resp.code,
          errorMessage = jsonStr.localized_message;
       return showCommonError(errorcontainer, errorMessage), document.querySelector('.loader,.blur').style.display = 'none', !1
    }
    var successCode = jsonStr.code;
    if ('SI202' === successCode || 'MFA302' === successCode || 'SI302' === successCode || 'SI201' === successCode) {
       if (temptoken = jsonStr[signinathmode].token, isResend) return showResendPushInfo(), isPasswordless && void 0 != jsonStr[signinathmode].rnd && (document.querySelector('#rnd_num').innerHTML = jsonStr[signinathmode].rnd), resendpush_checking(time = 25)), !1;
    if (isTroubleSignin = !1, 'totp' === prefoption) return document.querySelector('.step_two').innerHTML = I18N.get('IAM.NEW.SIGNIN.RIGHT.PANEL.VERIFY.TOTP')), document.querySelector('.step_three').innerHTML = I18N.get('IAM.NEW.SIGNIN.RIGHT.PANEL.ALLOW.TOTP')), document.querySelector('.approved').css('background', 'url('.. / images / TOTP_Verify .7413 beaafe5ff6a598eeb58a16bad79f.svg ') no-repeat transparent'), document.querySelector('#mfa_scanqr_container,#mfa_push_container,#waitbtn,#openoneauth').style.display = 'none', enableTOTPdevice(jsonStr, !0, !1), document.querySelector('.rnd_container').style.display = 'none', !1;
 var headtitle = 'push' === prefoption ? 'IAM.NEW.SIGNIN.VERIFY.PUSH' : 'totp' === prefoption ? 'IAM.NEW.SIGNIN.TOTP' : 'scanqr' === prefoption ? 'IAM.NEW.SIGNIN.QR.CODE' : '',
    headerdesc = 'push' === prefoption ? 'IAM.NEW.SIGNIN.MFA.PUSH.HEADER' : 'totp' === prefoption ? 'IAM.NEW.SIGNIN.TOTP.HEADER' : 'scanqr' === prefoption ? 'IAM.NEW.SIGNIN.QR.HEADER' : '';
 if (document.querySelector('#password_container,#login_id_container,#captcha_container,.fed_2show,#recoverybtn,#otp_container,.deviceparent').style.display = 'none', document.querySelector('#headtitle').textContent = I18N.get(headtitle)), document.querySelector('.devices .selection').css('display', ''), headerdesc = deviceauthdetails[deviceauthdetails.resource_name].isAMFA ? I18N.get(headerdesc) + '<br>' + formatMessage(I18N.get('IAM.NEW.SIGNIN.WHY.VERIFY'), suspisious_login_link) : headerdesc, document.querySelector('.service_name').innerHTML = I18N.get(headerdesc)), document.querySelector('.product_text,.product_head,.MAppIcon,.OnaAuthHLink,.pwless_head,.pwless_text').style.display = 'none', document.querySelector('#product_img').classList.remove(document.querySelector('#product_img').getAttribute('class')), document.querySelector('#product_img').classList.add('tfa_' + prefoption + '_mode'), document.querySelector('#forgotpassword,#problemsignin,#recoverybtn').style.display = 'none', document.querySelector('#nextbtn').style.display = 'none', document.querySelector('#mfa_' + prefoption + '_container').style.display = '', document.querySelector('.service_name').classList.add('extramargin'), document.querySelector('#mfa_device_container').style.display = '', document.querySelector('.signin_container').classList.remove('mobile_signincontainer'), document.querySelector('.rnd_container').style.display = 'none', 'push' === prefoption || 'scanqr' === prefoption) {
    var wmsid = jsonStr[signinathmode].WmsId && jsonStr[signinathmode].WmsId.toString();
    isVerifiedFromDevice(prefoption, !0, wmsid)
 }
 if ('push' === prefoption && (isPasswordless && void 0 != jsonStr[signinathmode].rnd ? (document.querySelector('.rnd_container').style.display = '', document.querySelector('#rnd_num').innerHTML = jsonStr[signinathmode].rnd), document.querySelector('#waitbtn,.loadwithbtn').style.display = 'none', document.querySelector('#mfa_scanqr_container,#mfa_totp_container,#openoneauth').style.display = 'none', document.querySelector('.service_name').textContent = I18N.get('IAM.NEW.SIGNIN.PUSH.RND.DESC')), document.querySelector('.loader,.blur').style.display = 'none', resendpush_checking(time = 20)): (document.querySelector('#waitbtn,.loadwithbtn').style.display = '', document.querySelector('.rnd_container').style.display = 'none', document.querySelector('.waitbtn .waittext').textContent = I18N.get('IAM.NEW.SIGNIN.WAITING.APPROVAL')), document.querySelector('#waitbtn').getAttribute('disabled', !0), document.querySelector('#mfa_scanqr_container,#mfa_totp_container,#openoneauth').style.display = 'none', document.querySelector('.loader,.blur').style.display = 'none', window.setTimeout(function () {
 return document.querySelector('.waitbtn .waittext').textContent = I18N.get('IAM.PUSH.RESEND.NOTIFICATION')), document.querySelector('.loadwithbtn').style.display = 'none', document.querySelector('#waitbtn').getAttribute('disabled', !1), isFormSubmited = !1, !1
 }, 2e4))), 'scanqr' === prefoption) {
    document.querySelector('.step_two').innerHTML = I18N.get('IAM.NEW.SIGNIN.RIGHT.PANEL.ALLOW.SCANQR')), document.querySelector('.step_three').innerHTML = I18N.get('IAM.NEW.SIGNIN.RIGHT.PANEL.VERIFY.SCANQR')), document.querySelector('.approved').css('background', 'url('.. / images / SCANQR_Verify .823 be333b83563ed3c9e71e7eaa175e5.svg ') no-repeat transparent'), signinathmode = jsonStr.resource_name, document.querySelector('#waitbtn').style.display = 'none';
 var qrcodeurl = jsonStr[signinathmode].img;
 qrtempId = jsonStr[signinathmode].temptokenid, isValid(qrtempId) ? document.querySelector('#openoneauth').style.display = '' : document.querySelector('#openoneauth').style.display = 'none', document.querySelector('#mfa_push_container,#mfa_totp_container').style.display = 'none', document.querySelector('#qrimg').getAttribute('src', qrcodeurl), document.querySelector('.checkbox_div').classList.add('qrwidth')
 }
 return document.querySelector('.tryanother').style.display = '', isFormSubmited = !1, signinathmode = 'primary' === callmode ? 'deviceauth' : 'devicesecauth', document.querySelector('.loader,.blur').style.display = 'none', !1
 }
 return !1
 }
 
 function handleOneAuthDetails(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp);
       signinathmode = jsonStr.resource_name;
       var statusCode = jsonStr.status_code;
       if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) {
          var errorcontainer = 'totp' === prefoption || 'ONEAUTH_TOTP' === prefoption ? 'mfa_totp' : 'yubikey';
          'yubikey' === errorcontainer ? document.querySelector('#yubikey_container').style.display = '' : document.querySelector('#yubikey_container').style.display = 'none';
          var error_resp = jsonStr.errors[0],
             errorCode = error_resp.code;
          return 'D105' === errorCode ? (showCommonError(errorcontainer, jsonStr.localized_message), document.querySelector('.fed_2show').style.display = 'none', isRecovery || allowedModeChecking(), !1) : 'R303' === errorCode ? (showRestrictsignin(), !1) : 'throttles_limit_exceeded' === jsonStr.cause ? (showCommonError(errorcontainer, jsonStr.localized_message), !1) : (showCommonError(errorcontainer, jsonStr.localized_message), !1)
       }
       var successCode = jsonStr.code;
       if ('SI302' === successCode || 'MFA302' === successCode || 'SI202' === successCode || 'SI201' === successCode) {
          temptoken = jsonStr[signinathmode].token, prefoption = deviceauthdetails[deviceauthdetails.resource_name].modes.oadevice.data[oadevicepos].prefer_option;
          var devicemode = 'ONEAUTH_PUSH_NOTIF' === prefoption ? 'push' : 'ONEAUTH_TOTP' === prefoption ? 'totp' : 'ONEAUTH_SCAN_QR' === prefoption ? 'scanqr' : 'ONEAUTH_FACE_ID' === prefoption ? 'faceid' : 'ONEAUTH_TOUCH_ID' === prefoption ? 'touch' : '';
          if (isResend) return showResendPushInfo(), !1;
          var headtitle = 'ONEAUTH_PUSH_NOTIF' === prefoption ? 'IAM.NEW.SIGNIN.VERIFY.PUSH' : 'ONEAUTH_TOTP' === prefoption ? 'IAM.NEW.SIGNIN.TOTP' : 'ONEAUTH_SCAN_QR' === prefoption ? 'IAM.NEW.SIGNIN.QR.CODE' : 'ONEAUTH_FACE_ID' === prefoption ? 'IAM.NEW.SIGNIN.FACEID.TITLE' : 'ONEAUTH_TOUCH_ID' === prefoption ? 'IAM.NEW.SIGNIN.TOUCHID.TITLE' : '',
             headerdesc = 'ONEAUTH_PUSH_NOTIF' === prefoption ? 'IAM.NEW.SIGNIN.MFA.PUSH.HEADER' : 'ONEAUTH_TOTP' === prefoption ? 'IAM.NEW.SIGNIN.ONEAUTH.TOTP.HEADER' : 'ONEAUTH_SCAN_QR' === prefoption ? 'IAM.NEW.SIGNIN.QR.HEADER' : 'ONEAUTH_FACE_ID' === prefoption ? 'IAM.NEW.SIGNIN.FACEID.HEADER' : 'ONEAUTH_TOUCH_ID' === prefoption ? 'IAM.NEW.SIGNIN.TOUCHID.HEADER' : '';
          if (isFaceId === !0 && (headtitle = 'IAM.NEW.SIGNIN.FACEID.TITLE', headerdesc = 'IAM.NEW.SIGNIN.FACEID.HEADER', devicemode = 'faceid'), document.querySelector('#password_container,#login_id_container,#captcha_container,.fed_2show,#otp_container,.deviceparent').style.display = 'none', document.querySelector('#headtitle').textContent = I18N.get(headtitle)), document.querySelector('.service_name').textContent = I18N.get(headerdesc)), document.querySelector('.product_text,.product_head,.MAppIcon,.OnaAuthHLink,.pwless_head,.pwless_text').style.display = 'none', document.querySelector('#product_img').classList.remove(document.querySelector('#product_img').getAttribute('class')), document.querySelector('.devices .selection').css('display', ''), document.querySelector('#product_img').classList.add('tfa_' + devicemode + '_mode'), document.querySelector('#forgotpassword').style.display = 'none', document.querySelector('#nextbtn').style.display = 'none', document.querySelector('#mfa_' + devicemode + '_container').style.display = '', document.querySelector('.service_name').classList.add('extramargin'), document.querySelector('#mfa_device_container').style.display = '', isRecovery || allowedModeChecking(), document.querySelector('.loader,.blur').style.display = 'none', 'push' === devicemode || 'touch' === devicemode || 'faceid' === devicemode || 'scanqr' === devicemode) {
       var wmsid = jsonStr[signinathmode].WmsId && jsonStr[signinathmode].WmsId.toString();
       callmode = 'secondary', isVerifiedFromDevice(prefoption, !1, wmsid)
    }
    if (('push' === devicemode || 'touch' === devicemode || 'faceid' === devicemode) && (document.querySelector('#waitbtn').getAttribute('disabled', !0), document.querySelector('.waitbtn .waittext').textContent = I18N.get('IAM.NEW.SIGNIN.WAITING.APPROVAL')), document.querySelector('.loadwithbtn').style.display = '', document.querySelector('#waitbtn').style.display = '', document.querySelector('#openoneauth').style.display = 'none', window.setTimeout(function () {
             return document.querySelector('.waitbtn .waittext').textContent = I18N.get('IAM.PUSH.RESEND.NOTIFICATION')), document.querySelector('#waitbtn').getAttribute('disabled', !1), document.querySelector('.loadwithbtn').style.display = 'none', isFormSubmited = !1, !1
       }, 2e4)), 'scanqr' === devicemode) {
    var qrcodeurl = jsonStr[signinathmode].img;
    qrtempId = jsonStr[signinathmode].temptokenid, isValid(qrtempId) ? document.querySelector('#openoneauth').style.display = '' : document.querySelector('#openoneauth').style.display = 'none', document.querySelector('#qrimg').getAttribute('src', qrcodeurl), document.querySelector('.checkbox_div').classList.add('qrwidth')
 }
 return isFormSubmited = !1, !1
 }
 return !1
 }
 var errorcontainer = 'passwordauth' === signinathmode ? 'password' : 'login_id';
 return showCommonError(errorcontainer, I18N.get('IAM.ERROR.GENERAL')), !1
 }
 
 function handlePassphraseDetails(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp);
       signinathmode = jsonStr.resource_name;
       var statusCode = jsonStr.status_code;
       if (!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode) {
          var successCode = jsonStr.code,
             statusmsg = jsonStr.passphrasesecauth.status;
          return 'success' === statusmsg ? restrictTrustMfa ? (updateTrustDevice(!1), !1) : (showTrustBrowser(), !1) : 'P500' === successCode || 'P501' === successCode ? (temptoken = jsonStr[signinathmode].token, showPasswordExpiry(jsonStr[signinathmode].pwdpolicy), !1) : (showCommonError('passphrase', jsonStr.localized_message), !1)
       }
       if ('throttles_limit_exceeded' === jsonStr.cause) return showCommonError('passphrase', jsonStr.localized_message), !1;
       var error_resp = jsonStr.errors && jsonStr.errors[0],
          errorCode = error_resp && error_resp.code;
       return 'IN107' === errorCode || 'IN108' === errorCode ? (document.querySelector('.fed_2show,.line').style.display = 'none', cdigest = jsonStr.cdigest, showHip(cdigest, 'bcaptcha_img'), document.querySelector('#bcaptcha_container').style.display = '', document.querySelector('#bcaptcha').focus(), clearCommonError('bcaptcha'), changeButtonAction(I18N.get('IAM.VERIFY'), !1), 'IN107' === errorCode && showCommonError('bcaptcha', errorMessage), !1) : 'R303' === errorCode ? (showRestrictsignin(), !1) : (showCommonError('passphrase', jsonStr.localized_message), !1)
    }
 }
 
 function resendpush_checking(resendtiming) {
    clearInterval(resendTimer), document.querySelector('.rnd_resend').classList.add('nonclickelem'), document.querySelector('.rnd_resend').innerHTML = I18N.get('IAM.NEW.SIGNIN.RESEND.PUSH.COUNTDOWN')), document.querySelector('.rnd_resend span').textContent = resendtiming), resendTimer = setInterval(function () {
 resendtiming--, document.querySelector('.rnd_resend span').textContent = resendtiming), 0 === resendtiming && (clearInterval(resendTimer), document.querySelector('.rnd_resend').innerHTML = I18N.get('IAM.NEW.SIGNIN.RESEND.PUSH')), document.querySelector('.rnd_resend').classList.remove('nonclickelem'))
 }, 1e3)
 }
 
 function isVerifiedFromDevice(prefmode, isMyZohoApp, WmsID) {
    if (isWmsRegistered === !1 && isValid(WmsID) && 'undefined' != WmsID) {
       wmscallmode = prefmode, wmscallapp = isMyZohoApp, wmscallid = WmsID;
       try {
          WmsLite.setNoDomainChange(), WmsLite.registerAnnon('AC', WmsID), isWmsRegistered = !0
       } catch (e) {}
    }
    if (prefmode = void 0 === prefmode ? wmscallmode : prefmode, isMyZohoApp = void 0 === isMyZohoApp ? wmscallapp : isMyZohoApp, WmsID = void 0 === WmsID ? wmscallid : WmsID, clearInterval(_time), isValid(WmsID) && 'undefined' != WmsID) {
       if (wmscount++, verifyCount > 15) return !1
    } else if (verifyCount > 25) return !1;
    var loginurl = isMyZohoApp ? '/signin/v2/' + callmode + '/' + zuid + '/device/' + deviceid + '?' : '/signin/v2/' + callmode + '/' + zuid + '/oneauth/' + deviceid + '?';
    loginurl += 'digest=' + digest + '&' + signinParams + '&polling=' + !0;
    var jsonData = {
       oneauthsec: {
          devicepref: prefmode
       }
    };
    return isMyZohoApp && (jsonData = 'primary' === callmode ? {
       deviceauth: {
          devicepref: prefmode
       }
    } : {
       devicesecauth: {
          devicepref: prefmode
       }
    }), sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, VerifySuccess, 'PUT'), verifyCount++, _time = isValid(WmsID) && 'undefined' != WmsID ? 6 > wmscount ? setInterval('isVerifiedFromDevice('
       '+prefmode+'
       ',' + isMyZohoApp + ','
       '+WmsID+'
       ')', 5e3) : setInterval('isVerifiedFromDevice('
       '+prefmode+'
       ',' + isMyZohoApp + ','
       '+WmsID+'
       ')', 25e3) : setInterval('isVerifiedFromDevice('
       '+prefmode+'
       ',' + isMyZohoApp + ','
       '+WmsID+'
       ')', 5e3), !1
 }
 
 function VerifySuccess(res) {
    if (IsJsonString(res)) {
       var jsonStr = JSON.parse(res);
       signinathmode = jsonStr.resource_name;
       var statusCode = jsonStr.status_code;
       if (!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode) {
          var successCode = jsonStr.code,
             statusmsg = jsonStr[signinathmode].status;
          if ('SI302' === successCode || 'SI200' === successCode || 'SI300' === successCode || 'SI301' === successCode || 'SI303' === successCode) return switchto(jsonStr[signinathmode].redirect_uri), !1;
          if ('success' === statusmsg) return clearInterval(_time), restrictTrustMfa ? (updateTrustDevice(!1), !1) : (showTrustBrowser(), !1);
          if ('P500' === successCode || 'P501' === successCode) return temptoken = jsonStr[signinathmode].token, showPasswordExpiry(jsonStr[signinathmode].pwdpolicy), !1
       } else if ('500' == statusCode) {
          var error_resp = jsonStr.errors && jsonStr.errors[0].code;
          if ('Y401' == error_resp) {
             if (isPasswordless) return showTopErrNotification(I18N.get('IAM.SIGNIN.ERROR.YUBIKEY.VALIDATION.FAILED')), !1;
             if ('R303' === error_resp) return showRestrictsignin(), !1;
             showCommonError('yubikey', I18N.get('IAM.SIGNIN.ERROR.YUBIKEY.VALIDATION.FAILED')), document.querySelector('#yubikey_container').style.display = '', showError()
          }
       }
    }
    return !1
 }
 
 function handleSecondaryDevices(primaryMode) {
    if ('oadevice' === primaryMode || 'mzadevice' === primaryMode) {
       document.querySelector('.secondary_devices').find('option').remove().end();
       var deviceDetails = deviceauthdetails[deviceauthdetails.resource_name].modes,
          isSecondaryDevice = !1,
          optionElem = '';
       if (secondaryMode = 'oadevice', 'oadevice' == primaryMode && (secondaryMode = 'mzadevice'), deviceDetails[primaryMode]) {
          var oneauthdetails = deviceDetails[primaryMode].data;
          'push' != oneauthdetails[0].prefer_option ? (optionElem += '<option value='
             0 ' version='
             '+oneauthdetails[0].app_version+'
             '>' + oneauthdetails[0].device_name + '</option>', isSecondaryDevice = !0) : oneauthdetails.forEach(function (data, index) {
             optionElem += '<option value=' + index + ' version='
             '+data.app_version+'
             '>' + data.device_name + '</option>', isSecondaryDevice = !0
          })
       }
       if (deviceDetails[secondaryMode]) {
          var oneauthdetails = deviceDetails[secondaryMode].data;
          'push' != oneauthdetails[0].prefer_option ? (optionElem += '<option value='
             0 ' version='
             '+oneauthdetails[0].app_version+'
             '>' + oneauthdetails[0].device_name + '</option>', isSecondaryDevice = !0) : oneauthdetails.forEach(function (data, index) {
             optionElem += '<option value=' + index + ' version='
             '+data.app_version+'
             '>' + data.device_name + '</option>', isSecondaryDevice = !0
          })
       }
       if (document.getElementsByClassName('secondary_devices')[0].innerHTML = optionElem, isSecondaryDevice) try {
          document.querySelector('.secondary_devices').select2({
             allowClear: !0,
             templateResult: secondaryFormat,
             minimumResultsForSearch: 1 / 0,
             templateSelection: function (option) {
                return '<div><span class='
                icon - device select_icon '></span><span class='
                select_con options_selct ' value=' + document.querySelector(option.element).getAttribute('value') + ' version=' + document.querySelector(option.element).getAttribute('version') + '>' + option.text + '</span><span class='
                downarrow '></span></div>'
             },
             escapeMarkup: function (m) {
                return m
             }
          }), window.setTimeout(function () {
             document.querySelector('.devices .select2').classList.add('device_select'), document.querySelector('.devices .select2').style.display = '', document.querySelector('.devices .select2-selection--single').classList.add('device_selection'), document.querySelector('.devicedetails').style.display = 'none', document.querySelector('.select2-selection__arrow').classList.add('hide'), document.querySelector('.secondary_devices option').length > 1 || (document.querySelector('.downarrow').style.display = 'none', document.querySelector('.devices .selection').css('pointer-events', 'none'))
          }, 100)
       } catch (err) {
          document.querySelector('.secondary_devices').css('display', 'block'), document.querySelector('.secondary_devices option').length > 1 || document.querySelector('.secondary_device').css('pointer-events', 'none'), document.querySelector('option').forEach(function () {
                if (this.text.length > 20) {
                   var optionText = this.text,
                      newOption = optionText.substring(0, 20);
                   document.querySelector(this).textContent = newOption + '...')
             }
          })
    }
 }
 }
 
 function secondaryFormat(option) {
    return '<div><span class='
    icon - device select_icon '></span><span class='
    select_con ' value=' + document.querySelector(option.element).getAttribute('value') + ' version=' + document.querySelector(option.element).getAttribute('version') + '>' + option.text + '</span></div>'
 }
 
 function showMoreSigninOptions() {
    showproblemsignin(!0), showCantAccessDevice(), document.querySelector('.problemsignin_head,.recoveryhead .backoption').style.display = 'none', -1 != allowedmodes.indexOf('recoverycode') ? document.querySelector('#recoverOption').style.display = '' : document.querySelector('#recoverOption').style.display = 'none', -1 != allowedmodes.indexOf('passphrase') ? document.querySelector('#passphraseRecover').style.display = '' : document.querySelector('#passphraseRecover').style.display = 'none', document.querySelector('.rec_head_text').textContent = I18N.get('IAM.NEW.SIGNIN.FEDERATED.LOGIN.TITLE')), document.querySelector('.signin_head').prepend('<span class='
 icon - backarrow backoption ' onclick='
 hideCantAccessDevice()
 '></span>'), document.querySelector('.backuphead .backoption,.greytext').style.display = 'none', document.querySelector('.recoveryhead .backoption').css('cssText', 'display: none !important;'), document.querySelector('#recoverymodeContainer').innerHTML = document.querySelector('.problemsignincon').innerHTML + document.querySelector('.recoverymodes').innerHTML), document.querySelector('.recoverymodes').style.display = 'none', document.querySelector('#recoverymodeContainer').children.length - !document.querySelector('#recoverOption').matches(':visible') - !document.querySelector('#passphraseRecover').matches(':visible') > 3 && !isMobile && document.querySelector('#recoverymodeContainer').classList.add('problemsignincontainer'), isRecovery = !0, isPasswordless = !1
 }
 
 function generateOTP(isResendOnly) {
    if (isPrimaryMode) return generateOTPAuth(isResendOnly), !1;
    var loginurl = uriPrefix + '/signin/v2/' + callmode + '/' + zuid + '/otp/' + emobile,
       callback = 'email' == prev_showmode ? enableOTPForEmail : enableOTPDetails;
    if (isResendOnly) {
       loginurl += '?digest=' + digest + '&' + signinParams;
       var jsonData = {
          otpsecauth: {
             mdigest: mdigest,
             is_resend: !0
          }
       };
       return sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, showResendInfo, 'PUT'), !1
    }
    var params = 'digest=' + digest + '&' + signinParams;
    return sendRequestWithTemptoken(loginurl, params, !0, callback), !1
 }
 
 function generateOTPAuth(isResendOnly) {
    var emailID = document.querySelector('#emailcheck').value;
    if (document.querySelector('#emailcheck_container').matches(':visible') && (!isValid(emailID) || !isEmailId(emailID))) return isValid(emailID) ? showCommonError('emailcheck', I18N.get('IAM.SIGNIN.ERROR.USEREMAIL.NOT.EXIST')) : showCommonError('emailcheck', I18N.get('IAM.NEW.SIGNIN.ENTER.EMAIL.ADDRESS')), !1;
    var loginurl = uriPrefix + '/signin/v2/' + callmode + '/' + zuid + '/otp/' + emobile + '?digest=' + digest + '&' + signinParams,
       callback = isResendOnly ? showResendInfo : enableOTPDetails;
    callback = document.querySelector('#emailcheck_container').matches(':visible') ? enableEmailOTPDetails : callback;
    var jsonData = isValid(emailID) ? {
          otpauth: {
             email_id: emailID
          }
       } : {
          otpauth: {}
       },
       jsonDataResend = isResendOnly && document.querySelector('#emailverify_container').matches(':visible') ? {
          otpauth: {
             is_resend: !0,
             email_id: emailID
          }
       } : {
          otpauth: {
             is_resend: !0
          }
       };
    return isResendOnly ? sendRequestWithTemptoken(loginurl, JSON.stringify(jsonDataResend), !0, callback) : sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, callback), !1
 }
 
 function showResendInfo(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp);
       signinathmode = jsonStr.resource_name;
       var statusCode = jsonStr.status_code;
       if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) {
          if ('throttles_limit_exceeded' === jsonStr.cause) return isPrimaryDevice ? (showTopErrNotification(jsonStr.localized_message), !1) : (showCommonError('otp_container', jsonStr.localized_message), !1);
          var error_resp = jsonStr.errors && jsonStr.errors[0],
             errorCode = error_resp && error_resp.code,
             errorMessage = jsonStr.localized_message;
          return 'IN107' === errorCode || 'IN108' === errorCode ? (cdigest = jsonStr.cdigest, showHip(cdigest), showCaptcha(I18N.get('IAM.NEXT'), !1, 'otp'), 'IN107' === errorCode && showCommonError('captcha', errorMessage), !1) : 'R303' === errorCode ? (showRestrictsignin(), !1) : (showCommonError('otp_container', errorMessage), !1)
       }
       var successCode = jsonStr.code;
       if ('SI201' === successCode || 'SI200' === successCode) return mdigest = jsonStr[signinathmode].mdigest, showTopNotification(formatMessage(I18N.get('IAM.NEW.SIGNIN.OTP.SENT'), rmobile)), resendotp_checking(), -1 != allowedmodes.indexOf('recoverycode') && setTimeout(function () {
          document.querySelector('#mfa_otp_container').matches(':visible') && document.querySelector('.go_to_bk_code_container').classList.add('show_bk_pop')
       }, 3e4), !1
    }
    return !1
 }
 
 function enableOTPDetails(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp);
       signinathmode = jsonStr.resource_name;
       var statusCode = jsonStr.status_code;
       if (!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode) {
          var successCode = jsonStr.code;
          return 'SI201' === successCode || 'SI200' === successCode ? (document.querySelector('.loader,.blur').style.display = 'none', mdigest = jsonStr[signinathmode].mdigest, isSecondary = deviceauthdetails.passwordauth && deviceauthdetails.passwordauth.modes.otp.count > 1 || allowedmodes.length > 1 && -1 === allowedmodes.indexOf('recoverycode') ? !0 : !1, 'otpauth' === signinathmode ? (clearCommonError('otp'), document.querySelector('#login').style.display = '', document.querySelector('#emailcheck_container').style.display = 'none', document.querySelector('#emailcheck').val(''), showTopNotification(formatMessage(I18N.get('IAM.NEW.SIGNIN.OTP.SENT'), rmobile)), resendotp_checking(), -1 != allowedmodes.indexOf('saml') ? document.querySelector('.otp_actions .signinwithsaml').style.display = '' : document.querySelector('.otp_actions .signinwithsaml').style.display = 'none', -1 != allowedmodes.indexOf('jwt') ? document.querySelector('.otp_actions .signinwithjwt').style.display = '' : document.querySelector('.otp_actions .signinwithjwt').style.display = 'none', -1 != allowedmodes.indexOf('saml') && -1 != allowedmodes.indexOf('jwt') ? (document.querySelector('.otp_actions .showmoresigininoption').style.display = '', document.querySelector('.otp_actions .signinwithjwt,.otp_actions .signinwithsaml,.otp_actions .showmoresigininoption').style.display = 'none') : document.querySelector('.otp_actions .showmoresigininoption').style.display = 'none', showOtpDetails(), !1) : (isValid(digest) || (digest = jsonStr[signinathmode].mdigest), enableMfaField('otp'), resendotp_checking(), !1)) : !1
       }
       if (jsonStr.errors && jsonStr.errors[0] && 'AS115' == jsonStr.errors[0].code) return showTopErrNotification(jsonStr.localized_message), !1;
       var errorfield = document.querySelector('#emailcheck_container').matches(':visible') ? 'emailcheck' : 'password';
       if ('throttles_limit_exceeded' === jsonStr.cause) return showCommonError(errorfield, jsonStr.localized_message), !1;
       var errorMessage = jsonStr.localized_message;
       return showCommonError(errorfield, errorMessage), !1
    }
    return !1
 }
 
 function enableOTPForEmail(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp);
       signinathmode = jsonStr.resource_name;
       var statusCode = jsonStr.status_code;
       if (!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode) {
          {
             jsonStr.code
          }
          document.querySelector('.loader,.blur').style.display = 'none', mdigest = jsonStr[signinathmode].mdigest, goBackToProblemSignin();
          var emaillist = deviceauthdetails[deviceauthdetails.resource_name].modes && deviceauthdetails[deviceauthdetails.resource_name].modes.email;
          return isSecondary = emaillist && emaillist.count > 1 || allowedmodes.length > 1 && -1 === allowedmodes.indexOf('recoverycode'), document.querySelector('#password_container,#captcha_container,.fed_2show,#otp_container').style.display = 'none', document.querySelector('#headtitle').textContent = I18N.get('IAM.AC.CHOOSE.OTHER_MODES.EMAIL.HEADING')), document.querySelector('.service_name').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.OTP.HEADER'), rmobile) + '<br>' + formatMessage(I18N.get('IAM.NEW.SIGNIN.WHY.VERIFY'), suspisious_login_link)), document.querySelector('#product_img').classList.remove(document.querySelector('#product_img').getAttribute('class')), document.querySelector('#product_img').classList.add('tfa_otp_mode'), showTopNotification(formatMessage(I18N.get('IAM.NEW.SIGNIN.OTP.SENT'), rmobile)), document.querySelector('#mfa_email_container,#mfa_email_container .textbox_actions').style.display = '', document.querySelector('#forgotpassword').style.display = 'none', document.querySelector('.service_name').classList.add('extramargin'), document.querySelector('#nextbtn span').classList.remove('zeroheight'), document.querySelector('#nextbtn').classList.remove('changeloadbtn'), document.querySelector('#nextbtn').getAttribute('disabled', !1), document.querySelector('#nextbtn span').textContent = I18N.get('IAM.VERIFY')), document.querySelector('#mfa_otp').focus(), isFormSubmited = !1, callmode = 'secondary', resendotp_checking(), allowedModeChecking(), isValid(digest) || (digest = jsonStr[signinathmode].mdigest), signinathmode = jsonStr.resource_name, !1
 }
 if (triggeredUser) return showTopErrNotification(jsonStr.localized_message), !1;
 if ('throttles_limit_exceeded' === jsonStr.cause) return showCommonError('password', jsonStr.localized_message), !1;
 var errorMessage = jsonStr.localized_message;
 return showCommonError('password', errorMessage), !1
 }
 return !1
 }
 
 function resendotp_checking() {
    var resendtiming = 60;
    clearInterval(resendTimer), document.querySelector('.resendotp').classList.add('nonclickelem'), document.querySelector('.resendotp span').textContent = resendtiming), document.querySelector('.resendotp').innerHTML = I18N.get('IAM.TFA.RESEND.OTP.COUNTDOWN')), resendTimer = setInterval(function () {
 resendtiming--, document.querySelector('.resendotp span').textContent = resendtiming), 0 === resendtiming && (clearInterval(resendTimer), document.querySelector('.resendotp').innerHTML = I18N.get('IAM.NEW.SIGNIN.RESEND.OTP')), document.querySelector('.resendotp').classList.remove('nonclickelem'))
 }, 1e3)
 }
 
 function changeRecoverOption(recoverOption) {
    'passphrase' === recoverOption ? showPassphraseContainer() : showBackupVerificationCode(), 'passphrase' === recoverOption ? (recoverTitle = I18N.get('IAM.NEW.SIGNIN.PASSPHRASE.RECOVER.TITLE'), recoverHeader = I18N.get('IAM.NEW.SIGNIN.PASSPHRASE.RECOVER.HEADER')) : 'recoverycode' === recoverOption && (recoverTitle = I18N.get('IAM.BACKUP.VERIFICATION_CODE'), recoverHeader = I18N.get('IAM.NEW.SIGNIN.BACKUP.RECOVER.HEADER')), document.querySelector('#backup_container #backup_title').textContent = recoverTitle), document.querySelector('#backup_container .backup_desc').textContent = recoverHeader), document.querySelector('#backup_container .backoption').style.display = 'none'
 }
 
 function showError() {
    return document.querySelector('.waitbtn .waittext').textContent = I18N.get('IAM.NEW.SIGNIN.RETRY.YUBIKEY')), document.querySelector('.loadwithbtn').style.display = 'none', document.querySelector('#waitbtn').getAttribute('disabled', !1), isFormSubmited = !1, !1
 }
 
 function showMoreIdps() {
    return document.querySelector('#login,.line').style.display = 'none', document.querySelector('.small_box').classList.remove('small_box'), document.querySelector('.fed_div').classList.add('large_box'), document.querySelector('.fed_text,.fed_2show').style.display = '', document.querySelector('.zohosignin').classList.remove('hide'), document.querySelector('#showIDPs').style.display = 'none', document.querySelector('.fed_div').style.display = '', document.querySelector('.more').style.display = 'none', document.querySelector('.signin_fed_text').classList.add('signin_fedtext_bold'), document.querySelector('.signin_container').css('height', 'auto'), document.querySelector('.slackicon').classList.remove('icon-slack_small').classList.add('icon-slack_L'), document.querySelector('.linkedicon').classList.remove('icon-linkedin_small').classList.add('icon-linkedIn_L'), document.querySelector('.yahooicon').classList.remove('icon-yahoo_small').classList.add('icon-yahoo_L'), document.querySelector('.baiduicon').classList.remove('icon-baidu_small').classList.add('icon-baidu_L'), document.querySelector('.intuiticon').classList.remove('icon-intuit_small').classList.add('icon-intuit_L'), document.querySelector('.intuit_icon,.intuit_icon .fed_center').classList.remove('intuit_fed'), isneedforGverify ? void document.querySelector('#macappleicon').style.display = 'none' : (document.querySelector('.fed_center_google').css('width', 'max-content'), document.querySelector('.googleIcon').classList.remove('google_small_icon'), document.querySelector('.apple_fed').style.display = 'none', document.querySelector('#macappleicon').style.display = '', !1)
 }
 
 function showZohoSignin() {
    document.querySelector('#login,.line').style.display = '', document.querySelector('.zohosignin').classList.add('hide'), document.querySelector('.fed_text,.fed_div').style.display = 'none', document.querySelector('.signin_fed_text').classList.remove('signin_fedtext_bold'), document.querySelector('.more,.show_fed').style.display = '', de('login_id') && document.querySelector('#login_id').focus(), document.querySelector('.large_box').classList.remove('large_box'), document.querySelector('.fed_div').classList.add('small_box'), document.querySelector('.slackicon').classList.add('icon-slack_small').classList.remove('icon-slack_L'), document.querySelector('.linkedicon').classList.add('icon-linkedin_small').classList.remove('icon-linkedIn_L'), document.querySelector('.yahooicon').classList.add('icon-yahoo_small').classList.remove('icon-yahoo_L'), document.querySelector('.baiduicon').classList.add('icon-baidu_small').classList.remove('icon-baidu_L'), document.querySelector('.intuiticon').classList.add('icon-intuit_small').classList.remove('icon-intuit_L'), document.querySelector('.intuit_icon,.intuit_icon .fed_center').classList.remove('intuit_fed'), fediconsChecking()
 }
 
 function showHidePassword() {
    var passwordField = document.querySelector('#new_password').matches(':visible') ? '#new_password' : '#password';
    passwordField = document.querySelector('#passphrase').matches(':visible') ? '#passphrase' : passwordField;
    var passType = document.querySelector(passwordField).getAttribute('type');
    'password' === passType ? (document.querySelector(passwordField).getAttribute('type', 'text'), document.querySelector('.show_hide_password').classList.add('icon-show')) : (document.querySelector(passwordField).getAttribute('type', 'password'), document.querySelector('.show_hide_password').classList.remove('icon-show')), document.querySelector(passwordField).focus()
 }
 
 function changeCountryCode() {
    document.querySelector('.select_country_code').textContent = document.querySelector('#country_code_select').value)
 }
 
 function fediconsChecking() {
    document.querySelector('.large_box').classList.remove('large_box'), document.querySelector('.fed_div').classList.add('small_box'), document.querySelector('.fed_text,.fed_div').style.display = 'none';
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /Mac|iPad|iPhone|iPod/.test(navigator.platform || '');
    if (isneedforGverify ? document.querySelector('.google_icon .fed_text').style.display = '' : document.querySelector('.google_icon .fed_text').style.display = 'none', document.getElementsByClassName('fed_div').length > 0) {
       document.getElementsByClassName('fed_div')[0].style.display = 'inline-block', document.getElementsByClassName('fed_div')[0].classList.add('show_fed');
       var fed_all_width = isneedforGverify ? document.querySelector('.signin_box').getBoundingClientRect().width - 90 : document.querySelector('.signin_box').getBoundingClientRect().width,
          show_fed_length = fed_all_width % 50 === 0 ? Math.floor(fed_all_width / 50) - 1 : Math.floor(fed_all_width / 50);
       if (document.querySelector('.fed_div').length - 1 > show_fed_length) {
          show_fed_length = isneedforGverify ? show_fed_length : show_fed_length - 1;
          for (var i = 0; show_fed_length > i; i++) document.getElementsByClassName('fed_div')[i].style.display = 'inline-block', document.getElementsByClassName('fed_div')[i].classList.add('show_fed');
          document.querySelector('.more').style.display = '', document.querySelector('.fed_2show').style.display = ''
       } else document.querySelector('.fed_div,.fed_2show').style.display = '', document.querySelector('.more').style.display = 'none';
       document.querySelector('.fed_div').length < 0 && document.querySelector('.fed_2show').style.display = 'none', isneedforGverify ? 1 == document.querySelector('#macappleicon').length && (document.querySelector('#macappleicon').remove(), document.querySelector('#appleNormalIcon').style.display = '') : (document.querySelector('#appleNormalIcon').remove(), document.querySelector('#macappleicon').style.display = '')
    }
 }
 
 function onSigninReady() {
    return !isValid(loginID) && trySmartSignin && localStorage && localStorage.getItem('isZohoSmartSigninDone') ? (openSmartSignInPage(), !1) : (document.querySelector('.blur,.loader').style.display = 'none', clearInterval(_time), reload_page = setInterval(checkCookie, 5e3), isMobileonly = !1, !isMobile && enableServiceBasedBanner ? loadRightBanner() : hiderightpanel(), isPreview || (setCookie(24), -1 != document.cookie.indexOf('IAM_TEST_COOKIE') ? (setCookie(0), document.querySelector('#enableCookie').style.display = 'none') : (document.querySelector('.signin_container,#signuplink,.banner_newtoold').style.display = 'none', document.querySelector('#enableCookie').style.display = '')), isMobile || document.querySelector('#login_id').focus(), 'true' === isCaptchaNeeded && (changeHip(), document.querySelector('#captcha_container').style.display = '', document.querySelector('#login_id').getAttribute('tabindex', 1), document.querySelector('#captcha').getAttribute('tabindex', 2), document.querySelector('#nextbtn').getAttribute('tabindex', 3)), isValid(CC) && document.querySelector('#country_code_select').val(document.querySelector('#' + CC).value), isValid(reqCountry) && (reqCountry = '#' + reqCountry.toUpperCase(), document.querySelector('#country_code_select option:selected').removeAttribute('selected'), document.querySelector('#country_code_select ' + reqCountry).getAttribute('selected', !0), document.querySelector('#country_code_select ' + reqCountry).trigger('change')), document.querySelector('.select_country_code').textContent = document.querySelector('#country_code_select').value), document.querySelector('#country_code_select').select2({
       allowClear: !0,
       templateResult: format,
       templateSelection: function (option) {
          return option.text
       },
       language: {
          noResults: function () {
             return I18N.get('IAM.NO.RESULT.FOUND')
          }
       },
       escapeMarkup: function (m) {
          return m
       }
    }), document.querySelector('#select2-country_code_select-container').innerHTML = document.querySelector('#country_code_select').value), void document.querySelector('#country_code_select').addEventListener('change', function () {
 return document.querySelector('.country_code').innerHTML = document.querySelector('#country_code_select').value), document.querySelector('#select2-country_code_select-container').innerHTML = document.querySelector('#country_code_select').value), document.querySelector('#login_id').classList.remove('textindent62'), document.querySelector('#login_id').classList.remove('textintent52'), document.querySelector('#login_id').classList.remove('textindent42'), checkTestIndent(), document.querySelector('.select2-search__field').getAttribute('placeholder', I18N.get('IAM.SEARCHING')), isMobile && document.querySelector('.select_country_code').matches(':visible') ? (document.querySelector('#login_id').classList.add('textindent62'), !1) : void 0
 }))
 }
 
 function changeSecDevice(elem) {
    var version = document.querySelector(elem).children('option:selected').getAttribute('version'),
       device_index = document.querySelector(elem).children('option:selected').value;
    '1.0' === version ? oadevicepos = device_index : mzadevicepos = device_index, '1.0' === version ? enableOneauthDevice() : enableMyZohoDevice(), hideTryanotherWay(), '1.0' == version && document.querySelector('.tryanother').style.display = 'none'
 }
 
 function checkTestIndent() {
    return document.querySelector('#select2-country_code_select-container').innerHTML && '3' == document.querySelector('#select2-country_code_select-container').innerHTML.length ? (document.querySelector('#login_id').classList.add('textintent52'), !1) : document.querySelector('#select2-country_code_select-container').innerHTML && '2' == document.querySelector('#select2-country_code_select-container').innerHTML.length ? (document.querySelector('#login_id').classList.add('textindent42'), !1) : document.querySelector('#select2-country_code_select-container').innerHTML && '4' == document.querySelector('#select2-country_code_select-container').innerHTML.length ? (document.querySelector('#login_id').classList.add('textindent62'), !1) : void 0
 }
 
 function loadRightBanner() {
    var action = '/signin/v2/banner';
    'undefined' != typeof contextpath && (action = contextpath + action), $.ajax({
       url: action,
       data: signinParams,
       success: function (resp) {
          handleRightBannerDetails(resp)
       },
       headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'X-ZCSRF-TOKEN': csrfParam + '=' + euc(getCookie(csrfCookieName))
       }
    })
 }
 
//  




function handleRightBannerDetails(resp) {
    alert('hii');
    var rightboxHtml = document.querySelector('.rightside_box').innerHTML;
    if (IsJsonString(resp)) {
        resp = JSON.parse(resp);
    }
    document.querySelector('.overlapBanner').remove();
    if (resp.banner[0].template.length === 1) {
        document.querySelector('.rightside_box').innerHTML = rightboxHtml + '<div class="overlapBanner ' + resp.banner[0].template + '"></div>';
        document.querySelector('.mfa_panel').style.display = 'none';
        document.querySelector('.overlapBanner').style.display = '';
    } else if (resp.banner[0].template.length > 1) {
        var count, dottedHtml = '', bannerHtml = '', bannerDetails = resp.banner[0].template;
        bannerDetails.forEach(function (data, index) {
            bannerHtml += (index !== 0 ? '<div id="banner_' + index + '" class="rightbanner rightbannerTransition slideright">' : '<div id="banner_' + index + '" class="rightbanner rightbannerTransition">') + data + '</div>';
            dottedHtml += '<div class="dot" id="dot_' + index + '"><div></div></div>';
            count = index + 1;
        });
        document.querySelector('.rightside_box').innerHTML = rightboxHtml + '<div class="overlapBanner" style="width: 300px">' + bannerHtml + '</div><div class="dotHead">' + dottedHtml + '</div>';
        document.querySelector('.mfa_panel').style.display = 'none';
        document.querySelector('.overlapBanner, .dotHead').style.display = '';
        document.querySelector('#dot_0').setAttribute('selected', true);
        handleRightBannerAnimation(count);
    } else {
        hiderightpanel();
    }
}

 function handleRightBannerAnimation(count) {
    bannerPosition = 0, bannerTimer = setInterval(function () {
       changeBanner(!1, bannerPosition, count), bannerPosition++, bannerPosition >= count && (bannerPosition = 0)
    }, 5e3)
 }
 
 function changeBanner(elem, bannerPosition, count) {
    bannerPosition = void 0 != bannerPosition ? bannerPosition : parseInt(elem.getAttribute('bannerposition')), bannerPosition === count - 1 ? document.querySelector('#banner_0').classList.remove('slideright') : document.querySelector('#banner_' + (bannerPosition + 1)).classList.remove('slideright'), document.querySelector('#banner_' + bannerPosition).classList.add('slideright');
    var dotPosition = bannerPosition === count - 1 ? 0 : bannerPosition + 1;
    document.querySelector('.dot').getAttribute('selected', !1), document.querySelector('#dot_' + dotPosition).getAttribute('selected', !0)
 }
 
 function hiderightpanel() {
    document.querySelector('.signin_container').css('maxWidth', '500px'), document.querySelector('.rightside_box').style.display = 'none', document.querySelector('#recoverybtn, #problemsignin, .tryanother').css('right', '0px')
 }
 
 function format(option) {
    var spltext;
    if (!option.id) return option.text;
    spltext = option.text.split('(');
    var cncode = document.querySelector(option.element).getAttribute('data-num'),
       cnnumber = document.querySelector(option.element).getAttribute('value'),
       cnnum = cnnumber.substring(1),
       flagcls = 'flag_' + cnnum + '_' + cncode,
       ob = '<div class='
    pic '+flagcls+'
    ' ></div><span class='
    cn '>' + spltext[0] + '</span><span class='
    cc '>' + cnnumber + '</span>';
    return ob
 }
 
 function handleRequestCountryCode(resp) {
    IsJsonString(resp) && (resp = JSON.parse(resp)), resp.isd_code && (reqCountry = resp.country_code, reqCountry = '#' + reqCountry.toUpperCase(), document.querySelector('#country_code_select option:selected').removeAttribute('selected'), document.querySelector('#country_code_select ' + reqCountry).getAttribute('selected', !0), document.getElementById('country_code_select').value = '+' + resp.isd_code, document.querySelector('#country_code_select ' + reqCountry).trigger('change'), document.querySelector('#login_id').classList.remove('textindent62'), document.querySelector('#login_id').classList.remove('textintent52'), document.querySelector('#login_id').classList.remove('textindent42'))
 }
 
 function checking() {
    var a = document.querySelector('#login_id').value,
       check = /^(?:[0-9] ?){2,1000}[0-9]$/.test(a);
    if (document.querySelector('.select2-selection--single').getAttribute('tabindex', '-1'), !isCountrySelected) {
       var reqUrl = uriPrefix + '/accounts/public/api/locate';
       sendRequestWithCallback(reqUrl, '', !0, handleRequestCountryCode), isCountrySelected = !0
    }
    if (1 == check && a) try {
       checkTestIndent(), document.querySelector('.selection').classList.add('showcountry_code'), isMobile ? (document.querySelector('.select_country_code,#country_code_select').style.display = '', document.querySelector('#country_code_select').select2('destroy')) : document.querySelector('.select2').style.display = ''
    } catch (err) {
       document.querySelector('.select_country_code,#country_code_select').css('display', 'block'), document.querySelector('#login_id').classList.add('textindent62')
    } else 0 == check && (document.querySelector('#login_id').classList.remove('textindent62'), document.querySelector('#login_id').classList.remove('textintent52'), document.querySelector('#login_id').classList.remove('textindent42'), document.querySelector('.selection').classList.remove('showcountry_code'), document.querySelector('.select_country_code,#country_code_select,.select2').style.display = 'none');
    isMobile || document.querySelector('.domainselect').matches(':visible') || document.querySelector('#portaldomain .select2').css('display', 'block')
 }
 
 function IsJsonString(str) {
    try {
       $.JSON.parse(str)
    } catch (e) {
       return !1
    }
    return !0
 }
 
 function isValid(instr) {
    return null != instr && '' != instr && 'null' != instr
 }
 
 function de(id) {
    return document.getElementById(id)
 }
 
 function euc(i) {
    return encodeURIComponent(i)
 }
 
 function getCookie(cookieName) {
    for (var nameEQ = cookieName + '=', ca = document.cookie.split(';'), i = 0; i < ca.length; i++) {
       var c = ca[i].trim();
       if (0 == c.indexOf(nameEQ)) return c.substring(nameEQ.length, c.length)
    }
    return null
 }
 
 function clearCommonError(field) {
    var container = field + '_container';
    document.querySelector('#' + field).classList.remove('errorborder'), document.querySelector('#' + container + ' .fielderror').slideUp(100), document.querySelector('#' + container + ' .fielderror').classList.remove('errorlabel'), document.querySelector('#' + container + ' .fielderror').textContent = '')
 }
 
 function clearFieldValue(fieldvalue) {
    document.querySelector('#' + fieldvalue).val('')
 }
 
 function resetForm() {
    document.querySelector('#login_id_container').slideDown(200), document.querySelector('#captcha_container,.textbox_actions,#mfa_device_container,#backupcode_container,#recoverybtn,#waitbtn,.textbox_actions_more,#openoneauth,.textbox_actions_saml,#problemsignin,.nopassword_container,.externaluser_container,#continuebtn').style.display = 'none', document.querySelector('#password_container').classList.add('zeroheight'), document.querySelector('#password_container,#otp_container').slideUp(200), document.querySelector('#forgotpassword,#nextbtn,#password_container .textbox_div').style.display = '', document.querySelector('#smartsigninbtn').classList.remove('hide'), document.querySelector('.fed_div_text span').textContent = ''), document.querySelector('.facebook_fed').classList.remove('fed_div_text'), document.querySelector('.signin_fed_text').style.display = '', document.querySelector('#nextbtn span').textContent = I18N.get('IAM.NEXT')), document.querySelector('.backbtn').style.display = 'none', document.querySelector('.fielderror').classList.remove('errorlabel'), document.querySelector('.fielderror').textContent = '');
 var userId = document.querySelector('#login_id').value;
 if (document.querySelector('.select2-selection__arrow').classList.remove('hide'), changeButtonAction(I18N.get('IAM.NEXT'), !1), -1 != userId.indexOf('-')) {
    var phoneId = userId.split('-');
    isPhoneNumber(phoneId[1]) && (document.querySelector('#login_id').val(phoneId[1]), document.querySelector('#select2-country_code_select-container').innerHTML = '+' + phoneId[0]), document.querySelector('#country_code_select').val('+' + phoneId[0]), checking())
 }
 return document.querySelector('#headtitle').textContent = I18N.get('IAM.SIGNIN')), document.querySelector('.service_name').classList.remove('extramargin'), document.querySelector('.service_name').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.SERVICE.NAME.TITLE'), displayname)), document.querySelector('.line ,.fed_2show,#signuplink,#showIDPs,.banner_newtoold,.show_fed').style.display = '', de('forgotpassword') && document.querySelector('#forgotpassword').classList.remove('nomargin'), de('password').value = '', document.querySelector('#login_id').focus(), isFormSubmited = !1, signinathmode = 'lookup', callmode = 'primary', 0 === isHideFedOptions ? document.querySelector('.fed_2show,.line').style.display = 'none' : fediconsChecking(), isClientPortal ? !1 : void(de('otp').value = '')
 }
 
 function switchto(url) {
    if (clearTimeout(reload_page), 0 != url.indexOf('http')) {
       var serverName = window.location.origin;
       window.location.origin || (serverName = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')), 0 != url.indexOf('/') && (url = '/' + url), url = serverName + url
    }
    isClientPortal && load_iframe && (window.location.href = url), window.top.location.href = url
 }
 
 function showAndGenerateOtp(enablemode) {
    return prev_showmode = enablemode = void 0 != enablemode ? enablemode : -1 != allowedmodes.indexOf('email') ? 'email' : 'otp', isPasswordless && 'undefined' != typeof enablemode && (emobile = 'email' === enablemode ? deviceauthdetails[deviceauthdetails.resource_name].modes.email.data[0].e_email : deviceauthdetails[deviceauthdetails.resource_name].modes.otp.data[0].e_mobile, rmobile = 'email' === enablemode ? deviceauthdetails[deviceauthdetails.resource_name].modes.email.data[0].email : deviceauthdetails[deviceauthdetails.resource_name].modes.otp.data[0].r_mobile), isEmailVerifyReqiured ? (checkEmailOTPInitiate(), !1) : (generateOTP(), !1)
 }
 
 function showOtpDetails() {
    document.querySelector('#password_container').slideUp(300);
    deviceauthdetails && deviceauthdetails.lookup.loginid ? deviceauthdetails.lookup.loginid : de('login_id').value;
    if (document.querySelector('.textbox_actions').style.display = '', document.querySelector('#enablemore').matches(':visible') && (document.querySelector('.textbox_actions').style.display = 'none', document.querySelector('.textbox_actions,.blueforgotpassword').style.display = 'none', goBackToCurrentMode(!0)), document.querySelector('#otp_container .username').textContent = identifyEmailOrNum()), document.querySelector('#otp_container').slideDown(300), document.querySelector('#captcha_container,#enableforgot').style.display = 'none', document.querySelector('#otp').val(''), document.querySelector('#otp').focus(), changeButtonAction(I18N.get('IAM.VERIFY'), !1), isPasswordless && (document.querySelector('#signinwithpass,#enableoptionsoneauth').style.display = 'none', document.querySelector('.signin_head').css('margin-bottom', '10px'), document.querySelector('#nextbtn span').textContent = I18N.get('IAM.SIGNIN')), document.querySelector('.username').textContent = identifyEmailOrNum()), resendotp_checking(), isRecovery || allowedModeChecking(), document.querySelector('#problemsignin,#recoverybtn,.tryanother').style.display = 'none', document.querySelector('#enablemore #resendotp').style.display = '', document.querySelector('#enablemore #blueforgotpassword').style.display = 'none', secondarymodes.length > 1 && document.querySelector('.otp_actions').style.display = 'none', isPasswordless)) {
    var showingmodes = secondarymodes;
    return 3 == showingmodes.length ? (-1 != showingmodes.indexOf('password') ? document.querySelector('#signinwithpass').style.display = '' : -1 != showingmodes.indexOf('saml') ? document.querySelector('#enablesaml').style.display = '' : document.querySelector('#enablejwt').style.display = '', document.querySelector('.otp_actions').style.display = '') : (document.querySelector('#enableoptionsoneauth').style.display = 'none', -1 != allowedmodes.indexOf('password') ? document.querySelector('#signinwithpassoneauth').css('display', 'block') : document.querySelector('#signinwithpassoneauth').style.display = 'none', -1 != allowedmodes.indexOf('otp') ? document.querySelector('#signinwithotponeauth').css('display', 'block') : document.querySelector('#signinwithotponeauth').style.display = 'none', -1 != allowedmodes.indexOf('email') ? document.querySelector('#passlessemailverify').css('display', 'block') : document.querySelector('#passlessemailverify').style.display = 'none', -1 != allowedmodes.indexOf('saml') ? document.querySelector('.signinwithsamloneauth').css('display', 'block') : document.querySelector('.signinwithsamloneauth').style.display = 'none', -1 != allowedmodes.indexOf('jwt') ? document.querySelector('.signinwithfedoneauth').css('display', 'block') : document.querySelector('.signinwithfedoneauth').style.display = 'none', -1 != allowedmodes.indexOf('federated') ? document.querySelector('.signinwithfedoneauth').css('display', 'block') : document.querySelector('.signinwithfedoneauth').style.display = 'none', -1 != allowedmodes.indexOf('otp') ? document.querySelector('#signinwithotponeauth').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.PASSWORDLESS.OTP.VERIFY.TITLE'), deviceauthdetails[deviceauthdetails.resource_name].modes.email.data[0].r_mobile)): '', -1 != allowedmodes.indexOf('email') ? document.querySelector('#passlessemailverify').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.PASSWORDLESS.EMAIL.VERIFY.TITLE'), deviceauthdetails[deviceauthdetails.resource_name].modes.email.data[0].email)): '', 'otp' == prev_showmode && document.querySelector('#signinwithotponeauth').style.display = 'none', 'email' == prev_showmode && document.querySelector('#passlessemailverify').style.display = 'none'), !1
 }
 }
 
 function showPassword() {
    if (document.querySelector('#password_container').classList.remove('zeroheight'), document.querySelector('#otp_container').slideUp(300), document.querySelector('#password_container').slideDown(300), changeButtonAction(I18N.get('IAM.SIGNIN'), !1), signinathmode = 'passwordauth', document.querySelector('.mobile_message').style.display = 'none', document.querySelector('#captcha_container').style.display = 'none', document.querySelector('#password').focus(), document.querySelector('.service_name,#blueforgotpassword').style.display = '', isPasswordless) {
       document.querySelector('#enableotpoption,#enablesaml,#enablejwt,#enablemore .resendotp,#enableoptionsoneauth,#signinwithpassoneauth').style.display = 'none';
       var showingmodes = secondarymodes;
       3 == showingmodes.length ? -1 != showingmodes.indexOf('otp') || -1 != showingmodes.indexOf('email') ? document.querySelector('#enableotpoption').style.display = '' : -1 != showingmodes.indexOf('smal') ? document.querySelector('#enablesaml').style.display = '' : -1 != showingmodes.indexOf('jwt') ? document.querySelector('#enablejwt').style.display = '' : '' : showingmodes.length > 2 && document.querySelector('#enablemore').style.display = ''
    }
 }
 
 function showTryanotherWay() {
    if (clearInterval(_time), clearCommonError('yubikey'), document.querySelector('.optionmod').style.display = '', isMobileonly && 'mzadevice' === prev_showmode) return document.querySelector('.signin_container').classList.add('mobile_signincontainer'), document.querySelector('#try' + prefoption).style.display = 'none', document.querySelector('.blur').style.display = '', document.querySelector('.blur').classList.add('dark_blur'), allowedModeChecking_mob(), !1;
    document.querySelector('.signin_head').css('margin-bottom', '10px'), document.querySelector('.addaptivetfalist,.borderlesstry,#trytitle').style.display = '', document.querySelector('#nextbtn,.service_name,.fieldcontainer,#headtitle,#problemsignin,#recoverybtn_mob,#problemsignin_mob,.verify_title,.tryanother,#totpverifybtn .loadwithbtn').style.display = 'none', document.querySelector('#trytitle').innerHTML = '<span class='
    icon - backarrow backoption ' onclick='
    hideTryanotherWay()
    '></span>' + I18N.get('IAM.NEW.SIGNIN.TRY.ANOTHERWAY.HEADER'));
 var preferoption = deviceauthdetails[deviceauthdetails.resource_name].modes.mzadevice.data[mzadevicepos].prefer_option;
 return 'totp' === preferoption && document.querySelector('#trytotp').style.display = 'none', 'scanqr' === preferoption && document.querySelector('#tryscanqr').style.display = 'none', tryAnotherway('totp' === preferoption ? 'qr' : 'totp'), isRecovery || allowedModeChecking(), isTroubleSignin = !0, !1
 }
 
 function allowedModeChecking_mob() {
    return document.querySelector('.addaptivetfalist').classList.add('heightChange'), document.querySelector('#recoverybtn,#recoverybtn_mob,#recoverybtn_mob,#recoverybtn').style.display = 'none', -1 != allowedmodes.indexOf('recoverycode') ? document.querySelector('#recoverOption').style.display = '' : document.querySelector('#recoverOption').style.display = 'none', isSecondary = deviceauthdetails[deviceauthdetails.resource_name].modes.otp && deviceauthdetails[deviceauthdetails.resource_name].modes.otp.count > 1 ? !0 : isSecondary, isSecondary ? document.querySelector('#problemsignin_mob').style.display = '' : document.querySelector('#recoverybtn_mob').style.display = '', isSecondary ? document.querySelector('#recoverybtn_mob').style.display = 'none' : document.querySelector('#problemsignin_mob').style.display = 'none', !1
 }
 
 function showmzadevicemodes() {
    document.querySelector('.devices .selection').css('display', ''), showTryanotherWay(), document.querySelector('#problemsigninui,#recoverybtn').style.display = 'none', isRecovery || allowedModeChecking()
 }
 
 function showproblemsignin(isBackup) {
    if (document.querySelector('.devices .selection,.devicedetails').style.display = 'none', isPasswordless && !isBackup) return showCurrentMode(allowedmodes[1], 0, !0), !1;
    clearInterval(_time), document.querySelector('.signin_container').classList.remove('mobile_signincontainer'), window.setTimeout(function () {
       document.querySelector('.blur').style.display = 'none', document.querySelector('.blur').classList.remove('dark_blur')
    }, 100), isMobileonly ? document.querySelector('.addaptivetfalist').classList.remove('heightChange') : document.querySelector('.addaptivetfalist').style.display = 'none', document.querySelector('#trytitle').innerHTML = ''), secondarymodes.splice(secondarymodes.indexOf(prev_showmode), 1);
 var currentmode = 'mzadevice' !== prev_showmode || isMobileonly ? 'goBackToCurrentMode()' : 'showmzadevicemodes()';
 secondarymodes.unshift(prev_showmode);
 var i18n_content = {
       totp: ['IAM.NEW.SIGNIN.VERIFY.VIA.AUTHENTICATOR', 'IAM.NEW.SIGNIN.VERIFY.VIA.AUTHENTICATOR.DESC'],
       otp: ['IAM.NEW.SIGNIN.VERIFY.VIA.OTP', 'IAM.NEW.SIGNIN.OTP.HEADER'],
       yubikey: ['IAM.NEW.SIGNIN.VERIFY.VIA.YUBIKEY', 'IAM.NEW.SIGNIN.VERIFY.VIA.YUBIKEY.DESC'],
       password: ['IAM.NEW.SIGNIN.MFA.PASSWORD.HEADER', 'IAM.NEW.SIGNIN.MFA.PASSWORD.DESC'],
       saml: ['IAM.NEW.SIGNIN.SAML.TITLE', 'IAM.NEW.SIGNIN.SAML.HEADER'],
       jwt: ['IAM.NEW.SIGNIN.JWT.TITLE', 'IAM.NEW.SIGNIN.SAML.HEADER'],
       email: ['IAM.NEW.SIGNIN.EMAIL.TITLE', 'IAM.NEW.SIGNIN.OTP.HEADER']
    },
    i18n_recover = {
       otp: ['IAM.AC.CHOOSE.OTHER_MODES.MOBILE.HEADING', 'IAM.NEW.SIGNIN.OTP.HEADER'],
       email: ['IAM.AC.CHOOSE.OTHER_MODES.EMAIL.HEADING', 'IAM.NEW.SIGNIN.OTP.HEADER']
    },
    jsonPackage = deviceauthdetails[deviceauthdetails.resource_name],
    headingcontent = jsonPackage.isAMFA ? 'IAM.SIGNIN.AMFA.VERIFICATION.HEADER' : 'IAM.NEW.SIGNIN.PROBLEM.SIGNIN',
    problemsigninheader = '<div class='
 problemsignin_head '><span class='
 icon - backarrow backoption ' onclick=\'' + currentmode + '\'></span><span class='
 rec_head_text '>' + I18N.get(headingcontent) + '</span></div>', allowedmodes_con = '', noofmodes = 0, i18n_msg = jsonPackage.isAMFA ? i18n_recover : i18n_content;
 secondarymodes.forEach(function (prob_mode, position) {
    var listofmob = jsonPackage.modes.otp && jsonPackage.modes.otp.data;
    isValid(listofmob) && listofmob.length > 1 && 0 === position && 'otp' === prob_mode && listofmob.forEach(function (data, index) {
       if (index != mobposition) {
          rmobile = data.r_mobile;
          var secondary_header = I18N.get(i18n_msg[prob_mode][0]),
             secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), rmobile);
          allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc, index), noofmodes++
       }
    });
    var listofemail = jsonPackage.modes.email && jsonPackage.modes.email.data;
    if (isValid(listofemail) && listofemail.length > 1 && 0 === position && 'email' === prob_mode && listofemail.forEach(function (data, index) {
          if (index != emailposition) {
             rmobile = data.email;
             var secondary_header = I18N.get(i18n_msg[prob_mode][0]),
                secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), rmobile);
             allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc, index), noofmodes++
          }
       }), 0 != position || isBackup)
       if ('recoverycode' != prob_mode && 'passphrase' != prob_mode) {
          if ('oadevice' === prob_mode) {
             var oadevice_modes = jsonPackage.modes.oadevice.data;
             oadevice_modes.forEach(function (data, index) {
                var oadevice_option = data.prefer_option,
                   device_name = data.device_name,
                   oneauthmode = 'ONEAUTH_PUSH_NOTIF' === oadevice_option ? 'push' : 'ONEAUTH_TOTP' === oadevice_option ? 'totp' : 'ONEAUTH_SCAN_QR' === oadevice_option ? 'scanqr' : 'ONEAUTH_FACE_ID' === oadevice_option ? 'faceid' : 'ONEAUTH_TOUCH_ID' === oadevice_option ? 'touchid' : '',
                   secondary_header = I18N.get('IAM.NEW.SIGNIN.VERIFY.VIA.ONEAUTH'),
                   secondary_desc = formatMessage(I18N.get('IAM.NEW.SIGNIN.VERIFY.VIA.ONEAUTH.DESC'), oneauthmode, device_name);
                allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc, index), noofmodes++
             })
          } else if ('mzadevice' === prob_mode) {
             var mzadevice_modes = jsonPackage.modes.mzadevice.data;
             mzadevice_modes.forEach(function (data, index) {
                var mzadevice_option = data.prefer_option,
                   device_name = data.device_name,
                   secondary_header = I18N.get(deviceauthdetails[deviceauthdetails.resource_name].isAMFA ? 'IAM.AC.CHOOSE.OTHER_MODES.DEVICE.HEADING' : 'IAM.NEW.SIGNIN.VERIFY.VIA.ONEAUTH'),
                   secondary_desc = formatMessage(I18N.get('IAM.NEW.SIGNIN.VERIFY.VIA.ONEAUTH.DESC'), mzadevice_option, device_name);
                allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc, index), noofmodes++
             })
          } else if ('otp' === prob_mode) listofmob.forEach(function (data, index) {
             if (index != mobposition) {
                rmobile = data.r_mobile;
                var secondary_header = I18N.get(i18n_msg[prob_mode][0]),
                   secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), rmobile);
                allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc, index), noofmodes++
             }
          });
          else if ('email' === prob_mode) listofemail.forEach(function (data, index) {
             if (index != emailposition) {
                rmobile = data.email;
                var secondary_header = I18N.get(i18n_msg[prob_mode][0]),
                   secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), rmobile);
                allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc, index), noofmodes++
             }
          });
          else if ('federated' === prob_mode) {
             var count = jsonPackage.modes.federated.count,
                idp = jsonPackage.modes.federated.data[0].idp.toLocaleLowerCase(),
                secondary_header = count > 1 ? I18N.get('IAM.NEW.SIGNIN.MORE.FEDRATED.ACCOUNTS.TITLE') : '<span style='
             text - transform: capitalize;
             '>' + idp + '</span>', secondary_desc = count > 1 ? I18N.get('IAM.NEW.SIGNIN.MORE.FEDRATED.ACCOUNTS.DESC') : formatMessage(I18N.get('IAM.NEW.SIGNIN.IDENTITY.PROVIDER.TITLE'), idp);
             allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc, count), noofmodes++
          } else if ('email' === prob_mode) {
             rmobile = jsonPackage.modes.email.data[0].email;
             var secondary_header = I18N.get(i18n_msg[prob_mode][0]),
                secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), rmobile);
             allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc), noofmodes++
          } else if ('saml' === prob_mode) {
             var saml_option = jsonPackage.modes.saml.data;
             saml_option.forEach(function (data, index) {
                var secondary_header = formatMessage(I18N.get(i18n_msg[prob_mode][1]), data.auth_domain),
                   secondary_desc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), data.domain);
                allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc, index), noofmodes++
             })
          } else if ('yubikey' === prob_mode) {
             var secondary_header = I18N.get(i18n_msg[prob_mode][0]),
                secondary_desc = I18N.get(i18n_msg[prob_mode][1]);
             allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc), noofmodes++
          } else if (i18n_msg[prob_mode]) {
             var jwtDesc;
             if ('jwt' === prob_mode) {
                var domainname = deviceauthdetails[deviceauthdetails.resource_name].modes.jwt.domain;
                jwtDesc = formatMessage(I18N.get(i18n_msg[prob_mode][1]), domainname)
             }
             var secondary_header = I18N.get(i18n_msg[prob_mode][0]),
                secondary_desc = 'jwt' === prob_mode ? jwtDesc : I18N.get(i18n_msg[prob_mode][1]);
             allowedmodes_con += problemsigninmodes(prob_mode, secondary_header, secondary_desc), noofmodes++
          }
       } else 'recoverycode' === prob_mode && document.querySelector('#recoverOption').style.display = ''
 }), document.querySelector('#problemsigninui').innerHTML = problemsigninheader + '<div class='
 problemsignincon '>' + allowedmodes_con + '</div>'), document.querySelector('.tryanother').matches(':visible') && document.querySelector('.tryanother').style.display = 'none', noofmodes > 3 && !isMobile && !isBackup && document.querySelector('.problemsignincon').classList.add('problemsignincontainer'), document.querySelector('.optionstry').classList.add('optionmod'), document.querySelector('#recoverybtn').style.display = '';
 allowedmodes[0];
 document.querySelector('#problemsignin,#headtitle,.service_name,.fieldcontainer,#nextbtn').style.display = 'none', document.querySelector('#problemsigninui').style.display = ''
 }
 
 function problemsigninmodes(prob_mode, secondary_header, secondary_desc, index) {
    return '<div class='
    optionstry options_hover ' id='
    secondary_ '+prob_mode+'
    ' onclick=showCurrentMode('
    '+prob_mode+'
    ',' + index + ')>			<div class='
    img_option_try img_option icon - '+prob_mode+'
    '></div>			<div class='
    option_details_try '>				<div class='
    option_title_try '>' + secondary_header + '</div>				<div class='
    option_description '>' + secondary_desc + '</div>			</div>			</div>'
 }
 
 function showallowedmodes(enablemode, mode_index) {
    document.querySelector('#enablemore').style.display = '';
    var lastviewed_mode = prev_showmode;
    if (prev_showmode = 'federated' === enablemode ? prev_showmode : enablemode, 'saml' === enablemode) {
       document.querySelector('#enablemore').style.display = 'none', document.querySelector('.blur,.loader').style.display = '';
       var samlAuthDomain = deviceauthdetails.lookup.modes.saml.data[mode_index].auth_domain;
       return enableSamlAuth(samlAuthDomain), document.querySelector('.blur,.loader').style.display = 'none', !1
    }
    if ('jwt' === enablemode) {
       document.querySelector('.blur,.loader').style.display = '';
       var redirectURI = deviceauthdetails.lookup.modes.jwt.redirect_uri;
       return switchto(redirectURI), document.querySelector('.blur,.loader').style.display = 'none', !1
    }
    if ('otp' === enablemode || 'email' === enablemode) return emobile = 'email' === enablemode ? deviceauthdetails[deviceauthdetails.resource_name].modes.email.data[0].e_email : deviceauthdetails[deviceauthdetails.resource_name].modes.otp.data[0].e_mobile, rmobile = 'email' === enablemode ? deviceauthdetails[deviceauthdetails.resource_name].modes.email.data[0].email : deviceauthdetails[deviceauthdetails.resource_name].modes.otp.data[0].r_mobile, deviceauthdetails.lookup.isUserName && 'email' === enablemode ? (checkEmailOTPInitiate(), prev_showmode = lastviewed_mode, !1) : (document.querySelector('#resendotp').style.display = '', enableOTP(enablemode), !1);
    if ('password' === enablemode) document.querySelector('#enableotpoption,#resendotp').style.display = 'none', document.querySelector('.blueforgotpassword').style.display = '', showPassword(), goBackToCurrentMode(!0);
    else if ('federated' === enablemode) {
       var idp = deviceauthdetails.lookup.modes.federated.data[0].idp.toLowerCase();
       return 1 == mode_index ? createandSubmitOpenIDForm(idp) : showMoreFedOptions(), !1
    }
    return !1
 }
 
 function goBackToCurrentMode(isLookup) {
    document.querySelector('#headtitle,.signin_head,.service_name,.fieldcontainer,#nextbtn').style.display = '', document.querySelector('.devices .selection,.devicedetails').style.display = 'none', document.querySelector('#problemsigninui,#recoverybtn').style.display = 'none', 'mzadevice' === prev_showmode ? document.querySelector('.tryanother,.devices .selection').style.display = '' : document.querySelector('.rnd_container').style.display = 'none', isLookup || document.querySelector('.addaptivetfalist').matches(':visible') || isRecovery || allowedModeChecking(), (document.querySelector('#waitbtn').matches(':visible') || document.querySelector('#mfa_scanqr_container').matches(':visible')) && document.querySelector('#nextbtn').style.display = 'none'
 }
 
 function hideTryanotherWay() {
    return document.querySelector('#trytitle,.borderlesstry,#recoverybtn,#problemsignin,#verify_totp_container,#verify_qr_container').style.display = 'none', isMobileonly ? document.querySelector('.addaptivetfalist').classList.remove('heightChange') : document.querySelector('.addaptivetfalist').style.display = 'none', document.querySelector('.service_name,.fieldcontainer,#headtitle').style.display = '', prefoption = deviceauthdetails[deviceauthdetails.resource_name].modes.mzadevice.data[mzadevicepos].prefer_option, 'totp' === prefoption && document.querySelector('#nextbtn').style.display = '', document.querySelector('.tryanother').style.display = '', document.querySelector('.signin_container').classList.remove('mobile_signincontainer'), window.setTimeout(function () {
       document.querySelector('.blur').style.display = 'none', document.querySelector('.blur').classList.remove('dark_blur')
    }, 250), isTroubleSignin = !1, document.querySelector('#verify_qrimg').getAttribute('src', ''), !1
 }
 
 function showCaptcha(btnstatus, isSubmitted, submit_id) {
    if (document.querySelector('#captcha_container').style.display = '', document.querySelector('#captcha').focus(), clearCommonError('captcha'), changeButtonAction(btnstatus, isSubmitted), document.querySelector('#' + submit_id).getAttribute('tabindex', 1), document.querySelector('#captcha').getAttribute('tabindex', 2), document.querySelector('#nextbtn').getAttribute('tabindex', 3), isClientPortal) {
       var iFrame = parent.document.getElementById('zs_signin_iframe');
       iFrame && (iFrame.style.height = iFrame.contentWindow.document.body.scrollHeight + 'px')
    }
    return !1
 }
 
 function changeHip(cImg, cId) {
    cId = isValid(cId) ? cId : 'captcha';
    var captchaReqUrl = 'webclient/v1/captcha?';
    sendRequestWithCallback(captchaReqUrl, '{'
       captcha ':{'
       digest ':'
       '+cdigest+'
       ','
       usecase ':'
       signin '}}', !1, handleChangeHip), showHip(cdigest, cImg), de(cId).value = ''
 }
 
 function showHip(cdigest, cImg) {
    var captcha_resp = isValid(cdigest) ? doGet('webclient/v1/captcha/' + cdigest) : '';
    IsJsonString(captcha_resp) && (captcha_resp = JSON.parse(captcha_resp));
    var captchimgsrc = 'throttles_limit_exceeded' !== captcha_resp.cause && isValid(cdigest) ? captcha_resp.captcha.image_bytes : '../v2/components/images/hiperror.gif';
    cImg = isValid(cImg) ? cImg : 'captcha_img', de('captcha').value = '';
    var hipRow = de(cImg),
       captchaImgEle = document.createElement('img');
    captchaImgEle.setAttribute('name', 'hipImg'), captchaImgEle.setAttribute('id', 'hip'), document.querySelector('.reloadcaptcha').getAttribute('title', I18N.get('IAM.NEW.SIGNIN.TITLE.RANDOM')), captchaImgEle.setAttribute('align', 'left'), captchaImgEle.setAttribute('src', captchimgsrc), isMobile || document.querySelector(captchaImgEle).css('mix-blend-mode', 'multiply'), document.querySelector(hipRow).innerHTML = captchaImgEle)
 }
 
 function handleChangeHip(resp) {
    if (IsJsonString(resp)) {
       {
          var jsonStr = JSON.parse(resp);
          jsonStr.status_code
       }
       if ('throttles_limit_exceeded' === jsonStr.cause) return cdigest = '', showHip(cdigest), showCaptcha(I18N.get('IAM.NEXT'), !1), !1;
       cdigest = jsonStr.digest
    }
    return !1
 }
 
 function handleMfaForIdpUsers(idpdigest) {
    if (isValid(idpdigest)) {
       document.querySelector('.blur,.loader').style.display = '', document.querySelector('#smartsigninbtn').style.display = 'none', window.setTimeout(function () {
          document.querySelector('.blur,.loader').style.display = 'none'
       }, 1e3);
       var loginurl = 'signin/v2/lookup/' + idpdigest + '?mode=secondary',
          params = signinParams;
       isValid(csrfParam) && (params = params + '&' + csrfParam + '=' + getCookie(csrfCookieName));
       var resp = getPlainResponse(loginurl, params);
       if (IsJsonString(resp)) {
          var jsonStr = JSON.parse(resp),
             statusCode = jsonStr.status_code;
          return !isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode ? (document.querySelector('.fed_2show,.line,#signuplink,#login_id').style.display = 'none', document.querySelector('#login_id_container,#showIDPs').slideUp(200), signinathmode = jsonStr.resource_name, restrictTrustMfa = jsonStr[signinathmode].restrict_trust_mfa, restrictTrustMfa || (trustMfaDays = '' + jsonStr[signinathmode].trust_mfa_days), allowedmodes = jsonStr[signinathmode].modes.allowed_modes, 'mzadevice' === allowedmodes[0] ? (prev_showmode = allowedmodes[0], secondarymodes = allowedmodes, callmode = 'secondary', zuid = jsonStr.lookup.identifier, temptoken = jsonStr.lookup.token, deviceauthdetails = jsonStr, enableMyZohoDevice(jsonStr), handleSecondaryDevices(allowedmodes[0]), !1) : (handlePasswordDetails(resp), !1)) : 'throttles_limit_exceeded' === jsonStr.cause ? (showCommonError('login_id', jsonStr.localized_message), !1) : (showCommonError('login_id', jsonStr.localized_message), !1)
       }
       return !1
    }
    return !1
 }
 
 function tryAnotherway(trymode) {
    return document.querySelector('#verify_' + trymode + '_container').matches(':visible') || (document.querySelector('#verify_totp').val(''), clearCommonError('verify_totp'), prefoption = 'qr' === trymode ? 'scanqr' : trymode, document.querySelector('.verify_totp,.verify_qr').slideUp(200), document.querySelector('.verify_' + trymode).slideDown(200), document.querySelector('.optionstry').classList.remove('toggle_active'), document.querySelector('.verify_' + trymode).parentNode.classList.add('toggle_active'), document.querySelector('#verify_totp').focus(), 'qr' === trymode && '' === document.querySelector('#verify_qrimg').getAttribute('src') && (document.querySelector('.verify_qr .loader,.verify_qr .blur').style.display = '', enableQRCodeimg())), !1
 }
 
 function showResendPushInfo() {
    return document.querySelector('.loadwithbtn').style.display = '', document.querySelector('.waitbtn .waittext').textContent = I18N.get('IAM.NEW.SIGNIN.WAITING.APPROVAL')), document.querySelector('#waitbtn').getAttribute('disabled', !0), showTopNotification(formatMessage(I18N.get('IAM.RESEND.PUSH.MSG'))), window.setTimeout(function () {
    return document.querySelector('.waitbtn .waittext').textContent = I18N.get('IAM.PUSH.RESEND.NOTIFICATION')), document.querySelector('.loadwithbtn').style.display = 'none', document.querySelector('#waitbtn').getAttribute('disabled', !1), isFormSubmited = !1, !1
 }, 25e3), !1
 }
 
 function showTrustBrowser() {
    return prefoption = 'ONEAUTH_PUSH_NOTIF' === prefoption ? 'push' : 'ONEAUTH_TOTP' === prefoption ? 'totp' : 'ONEAUTH_SCAN_QR' === prefoption ? 'scanqr' : 'ONEAUTH_FACE_ID' === prefoption ? 'faceid' : 'ONEAUTH_TOUCH_ID' === prefoption ? 'touchid' : prefoption, prefoption = isValid(prefoption) ? prefoption : allowedmodes[0], document.querySelector('.mod_sername').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.TRUST.HEADER.' + prefoption.toUpperCase()), trustMfaDays)), document.querySelector('#signin_div,.rightside_box,.zoho_logo,.loadwithbtn').style.display = 'none', document.querySelector('.trustbrowser_ui,.trustbrowser_ui #headtitle,.zoho_logo,.mod_sername').style.display = '', document.querySelector('.signin_container').classList.add('trustdevicebox'), document.querySelector('.signin_box').css('minHeight', 'auto'), document.querySelector('.signin_box').css('padding', '40px'), !1
 }
 
 function checkEmailOTPInitiate() {
    return document.querySelector('#login,#enablemore').style.display = 'none', document.querySelector('.emailcheck_head').style.display = '', document.querySelector('#emailcheck').val(''), document.querySelector('#emailcheck_container').style.display = '', document.querySelector('#emailverify_desc').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.VERIFY.EMAIL.DESC'), rmobile)), clearCommonError('emailcheck'), !1
 }
 
 function hideEmailOTPInitiate() {
    return document.querySelector('#login').style.display = '', document.querySelector('#emailcheck_container').style.display = 'none', !1
 }
 
 function verifyEmailValid() {
    return generateOTPAuth(), !1
 }
 
 function enableEmailOTPDetails(resp) {
    var jsonStr = JSON.parse(resp);
    signinathmode = jsonStr.resource_name;
    var statusCode = jsonStr.status_code;
    if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) {
       if ('throttles_limit_exceeded' === jsonStr.cause) return showCommonError('emailcheck', jsonStr.localized_message), !1;
       var errorMessage = jsonStr.localized_message;
       return showCommonError('emailcheck', errorMessage), !1
    }
    var successCode = jsonStr.code;
    ('SI201' === successCode || 'SI200' === successCode) && (mdigest = jsonStr[signinathmode].mdigest, document.querySelector('.emailverify_head .backup_desc').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.VERIFY.EMAIL.OTP.TITLE'), rmobile)), document.querySelector('#emailverify_container,.emailverify_head').style.display = '', document.querySelector('#emailcheck_container').style.display = 'none', showTopNotification(formatMessage(I18N.get('IAM.NEW.SIGNIN.OTP.SENT'), rmobile)), document.querySelector('#emailverify_container .showmoresigininoption').style.display = '', document.querySelector('#emailverify_container .signinwithjwt,#emailverify_container .signinwithsaml,#emailverify_container #signinwithpass').style.display = 'none', document.querySelector('.resendotp').style.display = '', resendotp_checking())
 }
 
 function verifyEmailOTP() {
    var OTP_CODE = document.querySelector('#emailverify').value;
    if (!isWebAuthNSupported()) return showTopErrNotification(I18N.get('IAM.WEBAUTHN.ERROR.BrowserNotSupported')), changeButtonAction(I18N.get('IAM.VERIFY'), !1), !1;
    if (!isValid(OTP_CODE)) return showCommonError('emailverify', I18N.get('IAM.NEW.SIGNIN.INVALID.OTP.MESSAGE.EMPTY')), !1;
    if (isNaN(OTP_CODE) || 7 != OTP_CODE.length) {
       var error_msg = I18N.get('email' === prev_showmode ? 'IAM.NEW.SIGNIN.INVALID.EMAIL.MESSAGE.NEW' : 'IAM.NEW.SIGNIN.INVALID.OTP.MESSAGE.NEW');
       return showCommonError('emailverify', error_msg), !1
    }
    if (/[^0-9\-\/]/.test(OTP_CODE)) return showCommonError('emailverify', I18N.get('IAM.SIGNIN.ERROR.INVALID.VERIFICATION.CODE')), !1;
    var loginurl = uriPrefix + '/signin/v2/' + callmode + '/' + zuid + '/otp/' + emobile + '?';
    loginurl += 'digest=' + digest + '&' + signinParams;
    var jsonData = {
       otpauth: {
          code: OTP_CODE,
          is_resend: !1
       }
    };
    return sendRequestWithCallback(loginurl, JSON.stringify(jsonData), !0, handlePasswordDetails, 'PUT'), !1
 }
 
 function hideEmailOTPVerify() {
    return document.querySelector('#emailverify_container').style.display = 'none', document.querySelector('#emailcheck_container').style.display = '', !1
 }
 
 function getbackemailverify() {
    return document.querySelector('#emailcheck_container,.emailverify_head').style.display = '', clearCommonError('emailcheck'), document.querySelector('#login').style.display = 'none', !1
 }
 
 function updateTrustDevice(trust) {
    trust ? document.querySelector('.trustbtn .loadwithbtn').style.display = '' : document.querySelector('.notnowbtn .loadwithbtn').style.display = '', trust ? document.querySelector('.trustbtn .waittext').classList.add('loadbtntext') : document.querySelector('.notnowbtn .waittext').classList.add('loadbtntext'), document.querySelector('.trustdevice').getAttribute('disabled', !0);
    var loginurl = uriPrefix + '/signin/v2/secondary/' + zuid + '/trust?',
       jsonData = {
          trustmfa: {
             trust: trust
          }
       };
    return sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handleTrustDetails), !1
 }
 
 function handleTrustDetails(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp),
          statusCode = jsonStr.status_code;
       if (!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode) {
          signinathmode = jsonStr.resource_name;
          var successCode = jsonStr.code;
          return 'SI302' === successCode || 'SI200' === successCode || 'SI300' === successCode || 'SI301' === successCode || 'SI303' === successCode ? (switchto(jsonStr[signinathmode].redirect_uri), !1) : !1
       }
       return document.querySelector('.trustdevice').getAttribute('disabled', !1), document.querySelector('.trustbtn .loadwithbtn,.notnowbtn .loadwithbtn').style.display = 'none', document.querySelector('.trustbtn .waittext,.notnowbtn .waittext').classList.remove('loadbtntext'), showTopErrNotification(jsonStr.localized_message), !1
    }
 }
 
 function getQueryParams(queryStrings) {
    var vars = {};
    queryStrings = queryStrings.substring(queryStrings.indexOf('?') + 1);
    for (var params = queryStrings.split('&'), i = 0; i < params.length; i++) {
       var pair = params[i].split('=');
       vars[pair[0]] = 2 == pair.length ? decodeURIComponent(pair[1]) : ''
    }
    return vars
 }
 
 function createandSubmitOpenIDForm(idpProvider) {
    if (isValid(idpProvider)) {
       var oldForm = document.getElementById(idpProvider + 'form');
       oldForm && document.documentElement.removeChild(oldForm);
       var form = document.createElement('form'),
          idpurl = isClientPortal ? uriPrefix + '/clientidprequest' : '/accounts/fsrequest';
       form.setAttribute('id', idpProvider + 'form'), form.setAttribute('method', 'POST'), form.setAttribute('action', idpurl), form.setAttribute('target', '_parent');
       var hiddenField = document.createElement('input');
       hiddenField.setAttribute('type', 'hidden'), hiddenField.setAttribute('name', 'provider'), hiddenField.setAttribute('value', idpProvider.toUpperCase()), form.appendChild(hiddenField), hiddenField = document.createElement('input'), hiddenField.setAttribute('type', 'hidden'), hiddenField.setAttribute('name', csrfParam), hiddenField.setAttribute('value', getCookie(csrfCookieName)), form.appendChild(hiddenField);
       var params = getQueryParams(location.search);
       for (var key in params) isValid(params[key]) && (hiddenField = document.createElement('input'), hiddenField.setAttribute('type', 'hidden'), hiddenField.setAttribute('name', key), hiddenField.setAttribute('value', params[key]), form.appendChild(hiddenField));
       document.documentElement.appendChild(form), form.submit()
    }
 }
 
 function goToForgotPassword() {
    var tmpResetPassUrl = getRecoveryURL(),
       LOGIN_ID = de('login_id').value.trim();
    if (de('login_id') && (isUserName(LOGIN_ID) || isEmailId(LOGIN_ID) || isPhoneNumber(LOGIN_ID.split('-')[1]))) {
       var oldForm = document.getElementById('recoveryredirection');
       oldForm && document.documentElement.removeChild(oldForm);
       var login_id = isPhoneNumber(LOGIN_ID) ? document.querySelector('#country_code_select').value.split('+')[1] + '-' + LOGIN_ID : LOGIN_ID,
          form = document.createElement('form');
       form.setAttribute('id', 'recoveryredirection'), form.setAttribute('method', 'POST'), form.setAttribute('action', tmpResetPassUrl), isClientPortal ? form.setAttribute('target', '_self') : form.setAttribute('target', '_parent');
       var hiddenField = document.createElement('input');
       return hiddenField.setAttribute('type', 'hidden'), hiddenField.setAttribute('name', 'LOGIN_ID'), hiddenField.setAttribute('value', login_id), form.appendChild(hiddenField), document.documentElement.appendChild(form), form.submit(), !1
    }
    window.location.href = tmpResetPassUrl
 }
 
 function iamMovetoSignUp(signupUrl, login_id) {
    if (isDarkMode && -1 == signupUrl.indexOf('darkmode=true') && (signupUrl += '&darkmode=true'), !isValid(login_id)) return window.location.href = signupUrl, !1;
    var xhr = new XMLHttpRequest;
    xhr.open('POST', signupUrl, !0), xhr.setRequestHeader('Content-Type', 'application/json'), xhr.setRequestHeader('X-ZCSRF-TOKEN', csrfParam + '=' + euc(getCookie(csrfCookieName))), xhr.onreadystatechange = function () {
       if (4 == xhr.readyState) {
          if (200 === xhr.status) {
             var oldForm = document.getElementById('signupredirection');
             oldForm && document.documentElement.removeChild(oldForm);
             var form = document.createElement('form');
             form.setAttribute('id', 'signupredirection'), form.setAttribute('method', 'POST'), form.setAttribute('action', signupUrl), form.setAttribute('target', '_parent');
             var hiddenField = document.createElement('input');
             return hiddenField.setAttribute('type', 'hidden'), hiddenField.setAttribute('name', 'LOGIN_ID'), hiddenField.setAttribute('value', login_id), form.appendChild(hiddenField), hiddenField = document.createElement('input'), hiddenField.setAttribute('type', 'hidden'), hiddenField.setAttribute('name', csrfParam), hiddenField.setAttribute('value', getCookie(csrfCookieName)), form.appendChild(hiddenField), document.documentElement.appendChild(form), form.submit(), !1
          }
          return window.location.href = signupUrl, !1
       }
    }, xhr.send()
 }
 
 function register() {
    return window.location.href = signup_url, !1
 }
 
 function showBackupVerificationCode() {
    return document.querySelector('#login,.fed_2show,#recovery_container,#passphrase_container,#bcaptcha_container').style.display = 'none', hideBkCodeRedirection(), document.querySelector('#backup_container,.backuphead,#backupcode_container').style.display = '', document.querySelector('#backupcode').focus(), document.querySelector('#backup_title').innerHTML = '<span class='
    icon - backarrow backoption ' onclick='
    hideCantAccessDevice()
    '></span>' + I18N.get('IAM.TFA.USE.BACKUP.CODE')), document.querySelector('.backup_desc').innerHTML = I18N.get('IAM.NEW.SIGNIN.BACKUP.HEADER')), signinathmode = 'recoverycodesecauth', -1 != allowedmodes.indexOf('passphrase') ? document.querySelector('#recovery_passphrase').style.display = '' : document.querySelector('#recovery_passphrase').style.display = 'none', !1
 }
 
 function goBackToProblemSignin() {
    return document.querySelector('.devices .selection').css('display', ''), document.querySelector('.fed_2show,#recovery_container,#backup_container').style.display = 'none', isSecondary && (isMobileonly ? document.querySelector('.addaptivetfalist').classList.remove('heightChange') : document.querySelector('.addaptivetfalist').style.display = 'none'), signinathmode = oldsigninathmode, document.querySelector('#login').style.display = '', isClientPortal && document.querySelector('.alt_signin_head').style.display = '', !1
 }
 
 function showCantAccessDevice() {
    return document.querySelector('.devices .selection,.devicedetails').style.display = 'none', document.querySelector('.signin_container').classList.remove('mobile_signincontainer'), -1 === allowedmodes.indexOf('passphrase') ? document.querySelector('#passphraseRecover').style.display = 'none' : document.querySelector('#passphraseRecover').style.display = '', window.setTimeout(function () {
       document.querySelector('.blur').style.display = 'none', document.querySelector('.blur').classList.remove('dark_blur')
    }, 100), oldsigninathmode = signinathmode, document.querySelector('#login,.fed_2show,#backup_container,.backuphead').style.display = 'none', isClientPortal && document.querySelector('.alt_signin_head').style.display = 'none', document.querySelector('#recovery_container,#recoverytitle,.recoveryhead').style.display = '', !1
 }
 
 function hideCantAccessDevice() {
    return document.querySelector('#recovery_container').style.display = '', document.querySelector('#backup_container').style.display = 'none', !1
 }
 
 function verifyBackupCode() {
    var isBcaptchaNeeded = document.querySelector('#bcaptcha_container').matches(':visible');
    if (isBcaptchaNeeded) {
       var bcaptchavalue = de('bcaptcha').value.trim();
       if (!isValid(bcaptchavalue)) return showCommonError('bcaptcha', I18N.get('IAM.SIGNIN.ERROR.CAPTCHA.REQUIRED')), !1;
       if (/[^a-zA-Z0-9\-\/]/.test(bcaptchavalue)) return changeHip('bcaptcha_img', 'bcaptcha'), showCommonError('bcaptcha', I18N.get('IAM.SIGNIN.ERROR.CAPTCHA.INVALID')), !1
    }
    if ('passphrasesecauth' === signinathmode) {
       var passphrase = document.querySelector('#passphrase').value.trim();
       if (!isValid(passphrase)) return showCommonError('passphrase', I18N.get('IAM.NEW.SIGNIN.ENTER.VALID.PASSPHRASE.CODE')), !1;
       var loginurl = uriPrefix + '/signin/v2/secondary/' + zuid + '/passphrase?' + signinParams;
       isBcaptchaNeeded && (loginurl += '&captcha=' + bcaptchavalue + '&cdigest=' + cdigest);
       var recsalt = deviceauthdetails[deviceauthdetails.resource_name].modes.passphrase && deviceauthdetails[deviceauthdetails.resource_name].modes.passphrase.rec_salt;
       if ('undefined' != typeof recsalt) var derivedKey = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(passphrase, sjcl.codec.base64.toBits(recsalt), 1e5, 256)),
          jsonData = {
             passphrasesecauth: {
                secret_key: derivedKey
             }
          };
       else var jsonData = {
          passphrasesecauth: {
             pass_phrase: passphrase
          }
       };
       return sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handlePassphraseDetails), !1
    }
    var backupcode = document.querySelector('#backupcode').value.trim();
    backupcode = backupcode.replace(/\s/g, '');
    var objRegExp = /^([a-zA-Z0-9]{12})$/;
    if (!isValid(backupcode)) return showCommonError('backupcode', I18N.get('IAM.EMPTY.BACKUPCODE.ERROR')), !1;
    if (!objRegExp.test(backupcode)) return showCommonError('backupcode', I18N.get('IAM.NEW.SIGNIN.ENTER.VALID.BACKUP.CODE')), !1;
    var loginurl = uriPrefix + '/signin/v2/secondary/' + zuid + '/recovery?' + signinParams;
    isBcaptchaNeeded && (loginurl += '&captcha=' + bcaptchavalue + '&cdigest=' + cdigest);
    var jsonData = {
       recoverycodesecauth: {
          code: backupcode
       }
    };
    return sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handleBackupVerificationDetails), !1
 }
 
 function handleBackupVerificationDetails(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp),
          statusCode = jsonStr.status_code;
       if (signinathmode = jsonStr.resource_name, !isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode) {
          var successCode = jsonStr.code,
             statusmsg = jsonStr.recoverycodesecauth.status;
          return 'success' === statusmsg ? restrictTrustMfa ? (updateTrustDevice(!1), !1) : (showTrustBrowser(), !1) : 'P500' === successCode || 'P501' === successCode ? (temptoken = jsonStr[signinathmode].token, showPasswordExpiry(jsonStr[signinathmode].pwdpolicy), !1) : (showCommonError('backupcode', jsonStr.localized_message), !1)
       }
       if ('throttles_limit_exceeded' === jsonStr.cause) return showCommonError('backupcode', jsonStr.localized_message), !1;
       var error_resp = jsonStr.errors[0],
          errorCode = error_resp.code,
          errorMessage = jsonStr.localized_message;
       return 'IN107' === errorCode || 'IN108' === errorCode ? (document.querySelector('.fed_2show,.line').style.display = 'none', cdigest = jsonStr.cdigest, showHip(cdigest, 'bcaptcha_img'), document.querySelector('#bcaptcha_container').style.display = '', document.querySelector('#bcaptcha').focus(), clearCommonError('bcaptcha'), changeButtonAction(I18N.get('IAM.VERIFY'), !1), 'IN107' === errorCode && showCommonError('bcaptcha', errorMessage), !1) : 'R303' === errorCode ? (showRestrictsignin(), !1) : (showCommonError('backupcode', errorMessage), !1)
    }
 }
 
 function removeParamFromQueryString(param) {
    if (isValid(queryString)) {
       for (var prefix = encodeURIComponent(param), pars = queryString.split(/[&;]/g), i = pars.length; i-- > 0;) {
          var paramObj = pars[i].split(/[=;]/g);
          prefix === paramObj[0] && pars.splice(i, 1)
       }
       if (pars.length > 0) return pars.join('&')
    }
    return ''
 }
 
 function allowedModeChecking() {
    return 1 == secondarymodes.length || 'recoverycode' == secondarymodes[1] && 2 == secondarymodes.length ? ('recoverycode' == secondarymodes[1] && document.querySelector('#recoverOption').style.display = '', document.querySelector('#recoverybtn').style.display = '', document.querySelector('#problemsignin').style.display = 'none') : (document.querySelector('#problemsignin').style.display = '', document.querySelector('#recoverybtn').style.display = 'none'), isSecondary && (document.querySelector('#problemsignin').style.display = '', document.querySelector('#recoverybtn').style.display = 'none'), -1 != secondarymodes.indexOf('passphrase') && secondarymodes.length <= 3 && (document.querySelector('#recoverybtn').style.display = '', document.querySelector('#problemsignin').style.display = 'none'), !1
 }
 
 function showCurrentMode(pmode, index) {
    mobposition = emailposition = void 0, document.querySelector('.devices .selection,.devicedetails').style.display = 'none', document.querySelector('#mfa_totp_container,#mfa_otp_container,#mfa_email_container,#waitbtn,#nextbtn,#mfa_scanqr_container,#mfa_push_container,#openoneauth,#yubikey_container').style.display = 'none', clearInterval(_time), document.querySelector('.tryanother').style.display = 'none', prev_showmode = 'federated' === pmode ? prev_showmode : pmode, clearCommonError(pmode);
    var authenticatemode = void 0 === deviceauthdetails.passwordauth ? 'lookup' : 'passwordauth';
    if ('otp' === pmode || 'email' === pmode) {
       triggeredUser = !0, document.querySelector('.loader,.blur').style.display = '';
       var jsonPack = deviceauthdetails[deviceauthdetails.resource_name];
       if (emobile = 'otp' === pmode ? jsonPack.modes.otp.data[index].e_mobile : jsonPack.modes.email.data[index].e_email, rmobile = 'otp' === pmode ? jsonPack.modes.otp.data[index].r_mobile : jsonPack.modes.email.data[index].email, isPasswordless && deviceauthdetails.lookup.isUserName) return checkEmailOTPInitiate(), !1;
       if (isPasswordless ? showAndGenerateOtp(pmode) : generateOTP(), 'email' === pmode ? emailposition = index : mobposition = index, isPrimaryDevice = !0, isPasswordless) {
          var showingmodes = secondarymodes;
          1 == showingmodes ? 'otp' == showingmodes[0] || 'email' == showingmodes[0] ? document.querySelector('#enableotpoption').style.display = '' : 'saml' == showingmodes[0] ? document.querySelector('#enablesaml').style.display = '' : document.querySelector('#enablejwt').style.display = '' : document.querySelector('#enablemore').style.display = ''
       }
    }
    if (goBackToProblemSignin(), 'totp' === pmode) enableTOTPdevice(deviceauthdetails, !1, !1), signinathmode = 'totpsecauth';
    else if ('oadevice' === pmode) document.querySelector('.loader,.blur').style.display = '', isResend = !1, signinathmode = authenticatemode, oadevicepos = index, enableOneauthDevice(deviceauthdetails, oadevicepos);
    else if ('yubikey' === pmode) document.querySelector('.loader,.blur').style.display = '', signinathmode = authenticatemode, enableYubikeyDevice(deviceauthdetails);
    else if ('mzadevice' === pmode) {
       if (document.querySelector('.loader,.blur').style.display = '', isResend = !1, mzadevicepos = index, prefoption = deviceauthdetails[deviceauthdetails.resource_name].modes.mzadevice.data[mzadevicepos].prefer_option, enableMyZohoDevice(deviceauthdetails, prefoption), 'totp' === prefoption) return goBackToCurrentMode(!0), isRecovery && document.querySelector('#problemsignin,#recoverybtn,.tryanother').style.display = 'none', !1
    } else if ('password' === pmode) showPasswordContainer();
    else {
       if ('federated' === pmode) {
          var idp = deviceauthdetails.lookup.modes.federated.data[0].idp.toLowerCase();
          return 1 === index ? createandSubmitOpenIDForm(idp) : showMoreFedOptions(), !1
       }
       if ('saml' === pmode) {
          document.querySelector('.blur,.loader').style.display = '';
          var samlAuthDomain = deviceauthdetails[deviceauthdetails.resource_name].modes.saml.data[index].auth_domain;
          return enableSamlAuth(samlAuthDomain), document.querySelector('.blur,.loader').style.display = 'none', !1
       }
       if ('jwt' === pmode) {
          var redirectURI = deviceauthdetails[deviceauthdetails.resource_name].modes.jwt.redirect_uri;
          switchto(redirectURI)
       }
    }
    return 'mzadevice' != pmode && 'oadevice' != pmode && document.querySelector('.deviceparent').classList.add('hide'), goBackToCurrentMode(), isPasswordless && (document.querySelector('#headtitle').innerHTML = I18N.get('IAM.NEW.SIGNIN.PROBLEM.SIGNIN')), document.querySelector('.service_name').innerHTML = I18N.get('IAM.NEW.SIGNIN.PASSWORDLESS.PROBLEM.SIGNIN.HEADER')), document.querySelector('.service_name').classList.add('extramargin'), hideTryanotherWay(), document.querySelector('#problemsignin,#recoverybtn,.tryanother,#enableoptionsoneauth').style.display = 'none'), isRecovery && document.querySelector('#problemsignin,#recoverybtn,.tryanother').style.display = 'none', !1
 }
 
 function showPasswordContainer() {
    document.querySelector('#nextbtn').getAttribute('disabled', !1), document.querySelector('#password').val(''), prev_showmode = 'password', document.querySelector('#password_container,#enableforgot').style.display = '', document.querySelector('#enablesaml,#enableotpoption,.textbox_actions,#otp_container').style.display = 'none', document.querySelector('#password_container').classList.remove('zeroheight'), document.querySelector('#nextbtn').classList.remove('changeloadbtn'), document.querySelector('#headtitle').textContent = I18N.get('IAM.SIGNIN')), document.querySelector('.service_name').classList.remove('extramargin'), document.querySelector('.service_name').innerHTML = formatMessage(I18N.get('IAM.NEW.SIGNIN.SERVICE.NAME.TITLE'), displayname)), document.querySelector('#nextbtn span').classList.remove('zeroheight'), document.querySelector('#nextbtn span').textContent = I18N.get('IAM.SIGNIN')), document.querySelector('.username').textContent = identifyEmailOrNum()), isPasswordless && !isRecovery && allowedModeChecking(), document.querySelector('.signin_head').css('margin-bottom', '30px'), document.querySelector('#password').focus(), signinathmode = 'passwordauth', document.querySelector('#enableotpoption,#enablesaml,#enablejwt,#enablemore').style.display = 'none';
 var showingmodes = secondarymodes;
 3 == showingmodes.length ? -1 != showingmodes.indexOf('otp') || -1 != showingmodes.indexOf('email') ? document.querySelector('#enableotpoption').style.display = '' : -1 != showingmodes.indexOf('smal') ? document.querySelector('#enablesaml').style.display = '' : -1 != showingmodes.indexOf('jwt') ? document.querySelector('#enablejwt').style.display = '' : '' : showingmodes.length > 2 && document.querySelector('#enablemore').style.display = '', isFormSubmited = !1
 }
 
 function showMoreFedOptions() {
    var idps = deviceauthdetails[deviceauthdetails.resource_name].modes.federated.data,
       backFunction = isPrimaryMode ? 'showmoresigininoption()' : 'showproblemsignin()',
       problemsigninheader = '<div class='
    problemsignin_head '><span class='
    icon - backarrow backoption ' onclick=' + backFunction + '></span><span class='
    rec_head_text '>' + I18N.get('IAM.NEW.SIGNIN.FEDERATED.LOGIN.TITLE') + '</span></div>', idp_con = '';
    return idps.forEach(function (idps) {
       isValid(idps) && (idp = idps.idp.toLowerCase(), idp_con += '<div class='
          optionstry options_hover ' id='
          secondary_ '+idp+'
          ' onclick=createandSubmitOpenIDForm('
          '+idp+'
          ')>							<div class='
          img_option_try img_option icon - federated '></div>							<div class='
          option_details_try '>								<div class='
          option_title_try '><span style='
          text - transform: capitalize;
          '>' + idp + '<span></div>								<div class='
          option_description '>' + formatMessage(I18N.get('IAM.NEW.SIGNIN.IDENTITY.PROVIDER.TITLE'), idp) + '</div>							</div>							</div>')
    }), document.querySelector('#problemsigninui').innerHTML = problemsigninheader + '<div class='
    problemsignincon '>' + idp_con + '</div>'), document.querySelector('#password_container,#nextbtn,.signin_head,#otp_container,#captcha_container,.fed_2show').style.display = 'none', document.querySelector('#problemsigninui').style.display = '', !1
 }
 
 function enableQRCodeimg() {
    var prefoption = 'scanqr',
       deviceid = deviceauthdetails[deviceauthdetails.resource_name].modes.mzadevice.data[mzadevicepos].device_id,
       loginurl = '/signin/v2/' + callmode + '/' + zuid + '/device/' + deviceid + '?';
    loginurl += 'digest=' + digest + '&' + signinParams;
    var jsonData = 'primary' === callmode ? {
       deviceauth: {
          devicepref: prefoption
       }
    } : {
       devicesecauth: {
          devicepref: prefoption
       }
    };
    sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handleQRCodeImg), signinathmode = 'primary' === callmode ? 'deviceauth' : 'devicesecauth'
 }
 
 function handleQRCodeImg(resp) {
    if (!IsJsonString(resp)) return showTopErrNotification(I18N.get('IAM.ERROR.GENERAL')), !1;
    var jsonStr = JSON.parse(resp);
    signinathmode = jsonStr.resource_name;
    var statusCode = jsonStr.status_code;
    if (!(!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode)) {
       if ('throttles_limit_exceeded' === jsonStr.cause) return showTopErrNotification(jsonStr.localized_message), !1;
       var error_resp = jsonStr.errors && jsonStr.errors[0],
          errorCode = error_resp && error_resp.code;
       return 'R303' === errorCode ? (showRestrictsignin(), !1) : (showTopErrNotification(jsonStr.localized_message), !1)
    }
    var successCode = jsonStr.code;
    if ('SI202' === successCode || 'MFA302' === successCode || 'SI302' === successCode || 'SI201' === successCode) {
       temptoken = jsonStr[signinathmode].token;
       var qrcodeurl = jsonStr[signinathmode].img;
       qrtempId = jsonStr[signinathmode].temptokenid, isValid(qrtempId) ? document.querySelector('#verify_qr_container #openoneauth').style.display = '' : document.querySelector('#verify_qr_container #openoneauth').style.display = 'none';
       var wmsid = jsonStr[signinathmode].WmsId && jsonStr[signinathmode].WmsId.toString();
       isVerifiedFromDevice(prefoption, !0, wmsid), document.querySelector('#verify_qrimg').getAttribute('src', qrcodeurl), document.querySelector('.verify_qr .loader,.verify_qr .blur').style.display = 'none'
    }
    return !1
 }
 
 function showPassphraseContainer() {
    document.querySelector('#login,.fed_2show,#backupcode_container,#recovery_container,#bcaptcha_container').style.display = 'none', document.querySelector('#passphrase_container,#backup_container,.backuphead').style.display = '', signinathmode = 'passphrasesecauth', document.querySelector('#backup_title').innerHTML = '<span class='
    icon - backarrow backoption ' onclick='
    hideCantAccessDevice()
    '></span>' + I18N.get('IAM.NEW.SIGNIN.PASS.PHRASE.TITLE')), document.querySelector('.backup_desc').innerHTML = I18N.get('IAM.NEW.SIGNIN.PASS.PHRASE.DESC')), -1 != allowedmodes.indexOf('recoverycode') ? document.querySelector('#recovery_backup').style.display = '' : document.querySelector('#recovery_backup').style.display = 'none'
 }
 
 function hideSigninOptions() {
    document.querySelector('#enablemore').style.display = '', document.querySelector('#nextbtn,.signin_head').style.display = '';
    var show_mode = 'email' === prev_showmode ? 'otp' : prev_showmode;
    return 'password' != prev_showmode && (signinathmode = 'passwordauth', document.querySelector('.resendotp').style.display = 'none'), document.querySelector('#' + show_mode + '_container').style.display = '', document.querySelector('#problemsigninui').style.display = 'none', !1
 }
 
 function QrOpenApp() {
    var qrCodeString = 'code=' + qrtempId + '&zuid=' + zuid + '&url=' + iamurl;
    return document.location = UrlScheme + '://?' + qrCodeString, !1
 }
 
 function showRestrictsignin() {
    return document.querySelector('#signin_div,.rightside_box,.banner_newtoold').style.display = 'none', document.querySelector('#smartsigninbtn').classList.add('hide'), document.querySelector('#restict_signin').style.display = '', document.querySelector('.zoho_logo').classList.add('applycenter'), document.querySelector('.signin_container').classList.add('mod_container'), !1
 }
 
 function setCookie(x) {
    var dt = new Date;
    dt.setDate(dt.getYear() * x);
    var cookieStr = 'IAM_TEST_COOKIE=IAM_TEST_COOKIE;expires=' + dt.toGMTString() + ';path=/;';
    'null' != cookieDomain && (cookieStr += 'domain=' + cookieDomain), document.cookie = cookieStr
 }
 
 function submitbackup(event) {
    13 === event.keyCode && verifyBackupCode()
 }
 
 function setPassword(event) {
    13 === event.keyCode && updatePassword()
 }
 
 function updatePassword(min_Len, max_Len, login_name) {
    remove_error();
    var newpass = document.querySelector('#new_password').value.trim(),
       confirmpass = document.querySelector('#new_repeat_password').value.trim(),
       passwordErr = validatePasswordPolicy.getErrorMsg(newpass);
    if (isEmpty(newpass)) return document.querySelector('#npassword_container').append('<div class='
       field_error '>' + I18N.get('IAM.ERROR.ENTER.NEW.PASS') + '</div>'), document.querySelector('#new_password').val(''), document.querySelector('#new_repeat_password').val(''), document.querySelector('#new_password').focus(), !1;
    if (passwordErr) return document.querySelector('#new_password').focus(), !1;
    if (newpass == login_name) return document.querySelector('#npassword_container').append('<div class='
       field_error '>' + I18N.get('IAM.PASSWORD.POLICY.LOGINNAME') + '</div>'), document.querySelector('#new_password').focus(), !1;
    if (isEmpty(confirmpass) || newpass != confirmpass) return document.querySelector('#rpassword_container').append('<div class='
       field_error '>' + I18N.get('IAM.ERROR.WRONG.CONFIRMPASS') + '</div>'), document.querySelector('#new_repeat_password').val(''), document.querySelector('#new_repeat_password').focus(), !1;
    var loginurl = uriPrefix + '/signin/v2/password/' + zuid + '/expiry?',
       jsonData = {
          expiry: {
             newpwd: newpass
          }
       };
    return sendRequestWithTemptoken(loginurl, JSON.stringify(jsonData), !0, handlePasswordExpiry), document.querySelector('#changepassword span').classList.add('zeroheight'), document.querySelector('#changepassword').classList.add('changeloadbtn'), document.querySelector('#changepassword').getAttribute('disabled', !0), !1
 }
 
 function handlePasswordExpiry(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp),
          statusCode = jsonStr.status_code;
       !isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode ? 'success' === jsonStr.expiry.status && (document.querySelector('#termin_mob').classList.remove('show_oneauth'), document.querySelector('.oneAuthLable').style.display = 'none', void 0 != jsonStr.expiry.sess_term_tokens && jsonStr.expiry.sess_term_tokens.length > 0 ? (-1 == jsonStr.expiry.sess_term_tokens.indexOf('rmwebses') && document.querySelector('#terminate_web_sess').style.display = 'none', -1 == jsonStr.expiry.sess_term_tokens.indexOf('rmappses') ? document.querySelector('#terminate_mob_apps').style.display = 'none' : -1 == jsonStr.expiry.sess_term_tokens.indexOf('inconeauth') ? document.querySelector('#termin_mob').classList.remove('show_oneauth') : document.querySelector('#termin_mob').classList.add('show_oneauth'), -1 == jsonStr.expiry.sess_term_tokens.indexOf('rmapitok') && document.querySelector('#terminate_api_tok').style.display = 'none', document.querySelector('.password_expiry_container').style.display = 'none', document.querySelector('.terminate_session_container').style.display = '') : send_terminate_session_request(document.terminate_session_container)) : showCommonError('npassword', jsonStr.localized_message)
    } else showTopErrNotification(I18N.get('IAM.ERROR.GENERAL'));
    return document.querySelector('#changepassword span').classList.remove('zeroheight'), document.querySelector('#changepassword').classList.remove('changeloadbtn'), document.querySelector('#changepassword').getAttribute('disabled', !1), !1
 }
 
 function send_terminate_session_request(formElement) {
    var terminate_web = document.querySelector('#' + formElement.id).find('input[name='
          signoutfromweb ']').matches(':checked'),
       terminate_mob = document.querySelector('#' + formElement.id).find('input[name='
          signoutfrommobile ']').matches(':checked'),
       terminate_api = document.querySelector('#' + formElement.id).find('input[name='
          signoutfromapiToken ']').matches(':checked'),
       include_oneAuth = document.querySelector('#' + formElement.id).find('#include_oneauth').matches(':checked'),
       jsonData = {
          expirysessionterminate: {
             rmwebses: terminate_web,
             rmappses: terminate_mob,
             inconeauth: include_oneAuth,
             rmapitok: terminate_api
          }
       },
       terminate_session_url = uriPrefix + '/signin/v2/password/' + zuid + '/expiryclosesession';
    return sendRequestWithTemptoken(terminate_session_url, JSON.stringify(jsonData), !0, handle_terminate_session, 'PUT'), document.querySelector('#terminate_session_submit span').classList.add('zeroheight'), document.querySelector('#terminate_session_submit').classList.add('changeloadbtn'), document.querySelector('#terminate_session_submit').getAttribute('disabled', !0), !1
 }
 
 function handle_terminate_session(resp) {
    if (IsJsonString(resp)) {
       var jsonStr = JSON.parse(resp),
          statusCode = jsonStr.status_code;
       if (!isNaN(statusCode) && statusCode >= 200 && 299 >= statusCode) {
          if ('SES200' == jsonStr.code) {
             var terminate_web = document.querySelector('#termin_web').matches(':checked'),
                terminate_mob = document.querySelector('#termin_mob').matches(':checked'),
                terminate_api = document.querySelector('#termin_api').matches(':checked');
             return terminate_web || terminate_mob || terminate_api ? (showTopNotification(jsonStr.localized_message), setTimeout(function () {
                window.location.reload()
             }, 3e3)) : window.location.reload(), !1
          }
          showTopErrNotification(jsonStr.message), document.querySelector('#terminate_session_submit span').classList.remove('zeroheight'), document.querySelector('#terminate_session_submit').classList.remove('changeloadbtn'), document.querySelector('#terminate_session_submit').getAttribute('disabled', !1)
       } else if ('throttles_limit_exceeded' === jsonStr.cause) showTopErrNotification(jsonStr.message);
       else {
          {
             var error_resp = jsonStr.errors[0];
             error_resp.code, jsonStr.message
          }
          showTopErrNotification(jsonStr.message)
       }
    } else showTopErrNotification(I18N.get('IAM.ERROR.GENERAL'));
    return document.querySelector('#terminate_session_submit span').classList.remove('zeroheight'), document.querySelector('#terminate_session_submit').classList.remove('changeloadbtn'), document.querySelector('#terminate_session_submit').getAttribute('disabled', !1), !1
 }
 
 function showOneAuthTerminate(ele) {
    document.querySelector('#include_oneauth').getAttribute('checked', !1), ele.checked && document.querySelector('#termin_mob').classList.contains('show_oneauth') ? (document.querySelector('.oneAuthLable').slideDown(300).classList.add('displayOneAuth'), document.querySelector('#terminate_session_weband_mobile_desc').style.display = 'none', document.querySelector(ele).parents('.checkbox_div').classList.add('showOneAuthLable'), document.querySelector('.showOneAuthLable').classList.add('displayBorder')) : (document.querySelector('.oneAuthLable').classList.remove('displayOneAuth'), document.querySelector('.showOneAuthLable').classList.remove('displayBorder'), document.querySelector('#terminate_session_weband_mobile_desc').style.display = '', document.querySelector('.oneAuthLable').slideUp(300, function () {
       document.querySelector(ele).parents('.checkbox_div').classList.remove('showOneAuthLable')
    }))
 }
 
 function showTopNotification(msg) {
    document.querySelector('.alert_message').innerHTML = msg), document.querySelector('.Alert').css('top', '20px'), window.setTimeout(function () {
    document.querySelector('.Alert').css('top', '-100px')
 }, 5e3)
 }
 
 function showTopErrNotification(msg, help) {
    document.querySelector('.error_message').innerHTML = msg), document.querySelector('.Errormsg').css('top', '20px'), window.setTimeout(function () {
 document.querySelector('.Errormsg').css('top', '-100px')
 }, 5e3), void 0 != help && '' != help && (document.querySelector('.error_help').css('display', 'inline-block'), document.querySelector('.error_help').innerHTML = help), document.querySelector('.error_message').classList.add('error_help_in'), window.setTimeout(function () {
 document.querySelector('.error_message').classList.remove('error_help_in'), document.querySelector('.error_help').innerHTML = '')
 }, 5500))
 }
 
 function showTopErrNotificationStatic(msg, help) {
    document.querySelector('.error_message').innerHTML = msg), document.querySelector('.Errormsg').css('top', '20px'), document.querySelector('.topErrClose').classList.remove('hide'), document.querySelector('.error_icon').classList.add('err-icon-help'), void 0 != help && '' != help && (document.querySelector('.error_help').css('display', 'inline-block'), document.querySelector('.error_help').innerHTML = help), document.querySelector('.error_message').classList.add('error_help_in'))
 }
 
 function closeTopErrNotification() {
    document.querySelector('.Errormsg').css('top', '-100px'), document.querySelector('error_message').classList.remove('error_help_in'), document.querySelector('.error_message').classList.remove('error_help_in'), document.querySelector('.error_help').css('display', 'none'), document.querySelector('.error_help').innerHTML = ''), document.querySelector('.error_icon').classList.remove('err-icon-help'), document.querySelector('.topErrClose').matches(':visible') && document.querySelector('.topErrClose').classList.add('hide')
 }
 
 function showPasswordExpiry(pwdpolicy) {
    if (document.querySelector('#signin_div,.rightside_box').style.display = 'none', document.querySelector('.password_expiry_container').style.display = '', document.querySelector('.signin_container').classList.add('mod_container'), void 0 != pwdpolicy) {
       document.querySelector('#password_desc').innerHTML = void 0 != pwdpolicy.expiry_days && -1 != pwdpolicy.expiry_days ? formatMessage(I18N.get('IAM.NEW.SIGNIN.PASSWORD.EXPIRED.ORG.DESC'), pwdpolicy.expiry_days.toString()) : I18N.get('IAM.NEW.SIGNIN.PASSWORD.EXPIRED.ORG.DESC.NOW')), validatePasswordPolicy.init(pwdpolicy, '#npassword_container input'), document.querySelector('#npassword_container').getAttribute('onkeyup', 'check_pp()');
    var loginName = de('login_id').value;
    document.querySelector('#changepassword').getAttribute('onclick', 'updatePassword(' + pwdpolicy.min_length + ',' + pwdpolicy.max_length + ','
       '+loginName+'
       ')')
 }
 return !1
 }
 
 function checkCookie() {
    isValid(getCookie(iam_reload_cookie_name)) && window.location.reload()
 }
 
 function check_pp() {
    validatePasswordPolicy.validate('#npassword_container input')
 }
 
 function remove_error() {
    document.querySelector('.field_error').remove(), clearCommonError('npassword')
 }
 
 function handleCrossDcLookup(loginID) {
    document.querySelector('.blur,.loader').style.display = '', isValid(CC) && document.querySelector('#country_code_select').val(document.querySelector('#' + CC).value), isValid(CC) && (loginID = -1 != loginID.indexOf('-') ? loginID : document.querySelector('#' + CC).value.split('+')[1] + '-' + loginID);
    var loginurl = '/signin/v2/lookup/' + loginID,
       params = 'mode=primary&' + signinParams;
    return sendRequestWithCallback(loginurl, params, !0, handleLookupDetails), !1
 }
 
 function handleConnectionError() {
    return document.querySelector('#nextbtn span').classList.remove('zeroheight'), document.querySelector('#nextbtn').classList.remove('changeloadbtn'), document.querySelector('#nextbtn').getAttribute('disabled', !1), isFormSubmited = !1, showTopErrNotification(I18N.get('IAM.PLEASE.CONNECT.INTERNET')), !1
 }
 
 function isEmailId(str) {
    if (!str) return !1;
    var objRegExp = new XRegExp('^[\\p{L}\\p{N}\\p{M}\\_]([\\p{L}\\p{N}\\p{M}\\_\\+\\-\\.\\'\\ & \\!\\ * ] * ) @( ? = . {
       4,
       256
    }
    $)(([\\p {
       L
    }\\
    p {
       N
    }\\
    p {
       M
    }
 ] + )(([\\-\\_] * [\\p {
       L
    }\\
    p {
       N
    }\\
    p {
       M
    }
 ]) * )[\\.]) + [\\p {
       L
    }\\
    p {
       M
    }
 ] {
    2,
    22
 }
 $ ','
 i ');return XRegExp.test(str.trim(),objRegExp)}function isPhoneNumber(str){if(!str)return!1;str=str.trim();var objRegExp=/^([0-9]{7,14})$/;return objRegExp.test(str)}function formatMessage(){var msg=arguments[0];if(void 0!=msg)for(var i=1;i<arguments.length;i++)msg=msg.replace(' {
    '+(i-1)+'
 }
 ',escapeHTML(arguments[i]));return msg}function escapeHTML(value){return value&&(value=value.replace(' < ',' & lt;
 '),value=value.replace(' > ',' & gt;
 '),value=value.replace('
 '', '"'), value = value.replace(''
    ',' & #x27;
    '),value=value.replace(' / ',' & #x2F;
    ')),value}function isEmpty(str){return str?!1:!0}function getPlainResponse(action,params){'
    undefined '!=typeof contextpath&&(action=contextpath+action),0===params.indexOf(' & ')&&(params=params.substring(1));var objHTTP;return objHTTP=xhr(),objHTTP.open('
    POST ',action,!1),objHTTP.setRequestHeader('
    Content - Type ','
    application / x - www - form - urlencoded; charset = UTF - 8 '),objHTTP.setRequestHeader('
    Content - length ',params.length),objHTTP.send(params),objHTTP.responseText}function xhr(){var xmlhttp;if(window.XMLHttpRequest)xmlhttp=new XMLHttpRequest;else if(window.ActiveXObject)try{xmlhttp=new ActiveXObject('
    Msxml2.XMLHTTP ')}catch(e){xmlhttp=new ActiveXObject('
    Microsoft.XMLHTTP ')}return xmlhttp}function sendRequestWithCallback(action,params,async,callback,method){'
    undefined '!=typeof contextpath&&(action=contextpath+action);var objHTTP=xhr();objHTTP.open(method?method:'
    POST ',action,async),objHTTP.setRequestHeader('
    Content - Type ','
    application / x - www - form - urlencoded; charset = UTF - 8 '),objHTTP.setRequestHeader('
    X - ZCSRF - TOKEN ',csrfParam+' = '+euc(getCookie(csrfCookieName))),async&&(objHTTP.onreadystatechange=function(){if(4==objHTTP.readyState){if(0===objHTTP.status)return handleConnectionError(),!1;callback&&callback(objHTTP.responseText)}}),objHTTP.send(params),async||callback&&callback(objHTTP.responseText)}function isUserName(str){if(!str)return!1;var objRegExp=new XRegExp(' ^ [\\p {
          L
       }\\
       p {
          N
       }\\
       p {
          M
       }\\
       _\\.\\
       ']+$', 'i');
    return XRegExp.test(str.trim(), objRegExp)
 }
 
 function doGet(action, params) {
    'undefined' != typeof contextpath && (action = contextpath + action);
    var objHTTP;
    return objHTTP = xhr(), isEmpty(params) && (params = '__d=e'), objHTTP.open('GET', action + '?' + params, !1), objHTTP.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8'), objHTTP.send(params), objHTTP.responseText
 }
 
 function handleDomainForPortal(domains) {
    document.querySelector('#login_id').getAttribute('placeholder', ''), document.querySelector('#login_id').css('borderRadius', '2px 0px 0px 2px'), document.querySelector('#portaldomain').style.display = '', document.querySelector('#login_id').css('width', '55%'), document.querySelector('#portaldomain').css('width', '45%'), document.querySelector('#login_id').css('display', 'inline-block'), $.forEach(domains, function (i, v) {
          var optVal = '@' + v;
          document.querySelector('#domaincontainer').append(document.querySelector('<option></option>').getAttribute('value', optVal).textContent = optVal))
    }), 1 === domains.length ? document.querySelector('#portaldomain').append('<span onclick='
 handleDomainChange(true)
 ' class='
 close '> </span>') : (document.querySelector('#domaincontainer').append(document.querySelector('<option class='
 removedomain '></option>').getAttribute('value', 'removedomain').textContent = I18N.get('IAM.SIGNIN.REMOVE.DOMAIN'))), document.querySelector('.domainselect').select2({
 allowClear: !0,
 width: '100%',
 theme: 'domain_select',
 minimumResultsForSearch: 1 / 0,
 templateSelection: function (option) {
    return option.text
 },
 escapeMarkup: function (m) {
    return m
 }
 })), isMobile && (document.querySelector('.domainselect').classList.contains('select2-hidden-accessible') && document.querySelector('.domainselect').select2('destroy'), document.querySelector('.domainselect').style.display = ''), 1 === domains.length ? (document.querySelector('.domainselect').style.display = '', document.querySelector('#domaincontainer').getAttribute('disabled', 'disabled'), document.querySelector('.domainselect').classList.add('hidearrow')) : (document.querySelector('#portaldomain .select2-selection').classList.add('select2domain'), document.querySelector('#portaldomain .select2').css('width', '196px !important'), document.querySelector('#portaldomain .select2').style.display = '')
 }
 
 function handleDomainChange(isClose) {
    ('removedomain' === document.querySelector('#domaincontainer').value || isClose === !0) && (document.querySelector('#login_id').css('borderRadius', '2px'), document.querySelector('#portaldomain').hide(0, function () {
       document.querySelector('#login_id').css('width', '100%'), document.querySelector('#login_id').focus()
    }), document.querySelector('.doaminat').style.display = '')
 }
 
 function enableDomain() {
    document.querySelector('#login_id').css('width', '55%'), setTimeout(function () {
          document.querySelector('.domainselect').val(document.querySelector('.domainselect option:first').value), document.querySelector('#select2-domaincontainer-container').textContent = document.querySelector('.domainselect').value), document.querySelector('#portaldomain').css('width', '45%'), document.querySelector('#login_id').css('display', 'inline-block'), document.querySelector('#login_id').css('borderRadius', '2px 0px 0px 2px'), document.querySelector('.doaminat').style.display = 'none', document.querySelector('#portaldomain').style.display = ''
    }, 200)
 }
 
 function hideBkCodeRedirection() {
    document.querySelector('.go_to_bk_code_container').classList.remove('show_bk_pop')
 }
 
 function openSmartSignInPage() {
    var smartsigninURL = '/signin?' + signinParams; - 1 != smartsigninURL.indexOf('QRLogin=false') ? smartsigninURL = smartsigninURL.replace('QRLogin=false', 'QRLogin=true') : -1 != !smartsigninURL.indexOf('QRLogin=true') && (smartsigninURL += -1 != smartsigninURL.indexOf('?') ? '&QRLogin=true' : '?QRLogin=true'), isDarkMode && -1 != !smartsigninURL.indexOf('darkmode=true') && (smartsigninURL += '&darkmode=true'), switchto(smartsigninURL)
 }
 
 function WmsliteImpl() {}
 var signinathmode = 'lookup',
    reload_page = '',
    isFormSubmited = isPasswordless = isSecondary = isPrimaryDevice = isTroubleSignin = isRecovery = isCountrySelected = isFaceId = isPrimaryMode = isEmailVerifyReqiured = triggeredUser = !1,
    allowedmodes, digest, rmobile, zuid, temptoken, mdigest, deviceid, prefoption, devicename, emobile, deviceauthdetails, cdigest, isResend, redirectUri, secondarymodes, prev_showmode, qrtempId, mobposition, bioType, restrictTrustMfa, resendTimer, trustMfaDays, bannerTimer, oldsigninathmode, emailposition, callmode = 'primary',
    oadevicepos = mzadevicepos = 0;
 document.addEventListener('click', select2_open_listener, !0);
 var wmscount = 0,
    _time, verifyCount = 0,
    totalCount = 0,
    isWmsRegistered = !1,
    wmscallmode, wmscallapp, wmscallid, I18N = {
       data: {},
       load: function (arr) {
          return $.extend(this.data, arr), this
       },
       get: function (key, args) {
          if ('object' == typeof key) {
             for (var i in key) key[i] = I18N.get(key[i]);
             return key
          }
          var msg = this.data[key] || key;
          return args ? (arguments[0] = msg, Util.format.apply(this, arguments)) : msg
       }
    },
    validatePasswordPolicy = function () {
       var passwordPolicy = void 0,
          initCallback = function (id, msg) {
             var li = document.createElement('li');
             return li.setAttribute('id', 'pp_' + id), li.setAttribute('class', 'pass_policy_rule'), li.textContent = msg, li
          },
          setErrCallback = function (id) {
             return document.querySelector('#pp_' + id).classList.remove('success'), id
          };
       return {
          getErrorMsg: function (value, callback) {
             if (passwordPolicy) {
                var isInit = value ? !1 : !0;
                value = value || '', callback = callback || setErrCallback;
                var rules = ['MIN_MAX', 'SPL', 'NUM', 'CASE'],
                   err_rules = [];
                isInit || document.querySelector('.pass_policy_rule').classList.add('success');
                for (var i = 0; i < rules.length; i++) switch (rules[i]) {
                   case 'MIN_MAX':
                      (value.length < passwordPolicy.min_length || value.length > passwordPolicy.max_length) && err_rules.push(callback(rules[i], isInit ? formatMessage(I18N.get('IAM.PASS_POLICY.MIN_MAX'), passwordPolicy.min_length.toString(), passwordPolicy.max_length.toString()) : void 0));
                      break;
                   case 'SPL':
                      passwordPolicy.min_spl_chars > 0 && (value.match(new RegExp('[^a-zA-Z0-9]', 'g')) || []).length < passwordPolicy.min_spl_chars && err_rules.push(callback(rules[i], isInit ? formatMessage(I18N.get(1 === passwordPolicy.min_spl_chars ? 'IAM.PASS_POLICY.SPL_SING' : 'IAM.PASS_POLICY.SPL'), passwordPolicy.min_spl_chars.toString()) : void 0));
                      break;
                   case 'NUM':
                      passwordPolicy.min_numeric_chars > 0 && (value.match(new RegExp('[0-9]', 'g')) || []).length < passwordPolicy.min_numeric_chars && err_rules.push(callback(rules[i], isInit ? formatMessage(I18N.get(1 === passwordPolicy.min_numeric_chars ? 'IAM.PASS_POLICY.NUM_SING' : 'IAM.PASS_POLICY.NUM'), passwordPolicy.min_numeric_chars.toString()) : void 0));
                      break;
                   case 'CASE':
                      !passwordPolicy.mixed_case || new RegExp('[A-Z]', 'g').test(value) && new RegExp('[a-z]', 'g').test(value) || err_rules.push(callback(rules[i], isInit ? I18N.get('IAM.PASS_POLICY.CASE') : void 0))
                }
                return err_rules.length && err_rules
             }
          },
          init: function (policy, passInputID) {
             passwordPolicy = policy, document.querySelector('.hover-tool-tip').remove();
             var tooltip = document.createElement('div');
             tooltip.setAttribute('class', isMobile ? 'hover-tool-tip no-arrow' : 'hover-tool-tip');
             var p = document.createElement('p');
             p.textContent = I18N.get('IAM.PASS_POLICY.HEADING');
             var ul = document.createElement('ul'),
                errList = this.getErrorMsg(void 0, initCallback);
             errList && (errList.forEach(function (forEachLi) {
                ul.appendChild(forEachLi)
             }), tooltip.appendChild(p), tooltip.appendChild(ul), document.querySelector('body').appendChild(tooltip), document.querySelector(passInputID).on('focus blur', function (e) {
                if ('focus' === e.type) {
                   var offset = document.querySelector(passInputID).getBoundingClientRect();
                   document.querySelector('.hover-tool-tip').css(isMobile ? {
                      top: offset.bottom + document.querySelector(window).scrollTop() + 8,
                      left: offset.x,
                      width: offset.width - 40
                   } : {
                      top: offset.y + document.querySelector(window).scrollTop(),
                      left: offset.x + offset.width + 15
                   }), document.querySelector('.hover-tool-tip').css('opacity', 1)
                } else {
                   document.querySelector('.hover-tool-tip').css('opacity', 0);
                   var offset = document.querySelector('.hover-tool-tip').getBoundingClientRect();
                   document.querySelector('.hover-tool-tip').css({
                      top: -offset.height,
                      left: -(offset.width + 15)
                   })
                }
             }))
          },
          validate: function (passInputID) {
             remove_error();
             var str = document.querySelector(passInputID).value;
             this.getErrorMsg(str, setErrCallback)
          }
       }
    }();
 WmsliteImpl.serverdown = function () {}, WmsliteImpl.serverup = function () {}, WmsliteImpl.handleLogout = function () {
    document.querySelector(window).unbind('beforeunload'), sendRequestWithCallback(contextpath + '/u/clearusercache', 'nocache=' + (new Date).getTime(), !0, function () {
       window.location.reload()
    })
 }, WmsliteImpl.handleMessage = function (mtype, msgObj) {
    mtype && '37' === mtype ? sendRequestWithCallback(contextpath + '/u/clearusercache', 'nocache=' + (new Date).getTime(), !0, function () {}) : mtype && '2' == mtype && ('checkStatus' == msgObj ? isVerifiedFromDevice() : 'checkisDisableApproved' == msgObj && isDisableApproved())
 }, WmsliteImpl.handleAccountDisabled = function () {}, WmsliteImpl.handleServiceMessage = function () {};
 F