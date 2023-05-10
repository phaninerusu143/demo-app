import React, { Component } from 'react'
const Data = () => {<React.Fragment>
    return (  <div ClassName="signin_fed_text signin_fedtext_bold">Sign in using</div>
								
    <span ClassName="fed_div google_icon google_fed show_fed large_box" onclick="createandSubmitOpenIDForm('google');" title="Sign in using Google" style="display: inline-block;">
        <div ClassName="fed_center_google">
            <span ClassName="icon-google_small fedicon">
                <span ClassName="path1"></span><span ClassName="path2"></span><span ClassName="path3"></span><span ClassName="path4"></span>
            </span>
            <span ClassName="fed_text" style="">Google</span>
        </div>
    </span>
    <span ClassName="fed_div fb_fed_box facebook_fed show_fed large_box" onclick="createandSubmitOpenIDForm('facebook');" title="Sign in using Facebook" style="display: inline-block;">
        <div ClassName="fed_center">
            <div ClassName="icon-facebook_small fedicon"></div>
            <span ClassName="fed_text" style="">Facebook</span>
        </div>
    </span>
     <span ClassName="fed_div linkedin_fed_box linkedin_fed show_fed large_box" onclick="createandSubmitOpenIDForm('linkedin');" title="Sign in using Linkedin" style="display: inline-block;">
        <div ClassName="fed_center">
            <span ClassName="fedicon linkedicon icon-linkedIn_L"></span>
        </div>
    </span>
    <span ClassName="fed_div twitter_fed_box twitter_fed show_fed large_box" onclick="createandSubmitOpenIDForm('twitter');" title="Sign in using Twitter" style="display: inline-block;">
        <div ClassName="fed_center">
            <span ClassName="icon-twitter_small fedicon"></span>
            <span ClassName="fed_text" style="">Twitter</span>
        </div>
    </span>
    <span ClassName="fed_div MS_icon azure_fed show_fed large_box" onclick="createandSubmitOpenIDForm('azure');" title="Sign in using Microsoft" style="display: inline-block;">
        <div ClassName="fed_center">
            <span ClassName="icon-azure_small fedicon">
                    <span ClassName="path1"></span><span ClassName="path2"></span><span ClassName="path3"></span><span ClassName="path4"></span>
            </span>
            <span ClassName="fed_text" style="">Microsoft</span>
        </div>
    </span>
    <span ClassName="fed_div apple_normal_icon apple_fed large_box" id="appleNormalIcon" onclick="createandSubmitOpenIDForm('apple');" title="Sign in using Apple" style="display: inline;">
         <div ClassName="fed_center">
            <span ClassName="icon-apple_small fedicon"></span>
            <span ClassName="fed_text" style="">Sign in with Apple</span>
        </div>
    </span>
<span ClassName="fed_div more large_box" id="showIDPs" title="More" onclick="showMoreIdps();" style="display: none;"> <span ClassName="morecircle"></span> <span ClassName="morecircle"></span> <span ClassName="morecircle"></span></span>
<div ClassName="zohosignin" onclick="showZohoSignin()">Sign in with Zoho<span ClassName="fedarrow"></span></div>);
</React.Fragment>}
 
export default Data;