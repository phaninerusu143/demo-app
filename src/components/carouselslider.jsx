import React, { Component } from 'react';

class CarouselSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
  }

  handleDotClick = (index) => {
    this.setState({ activeIndex: index });
  }

  render() {
    const { activeIndex } = this.state;

    const banners = [
      {
        id: 0,
        img: "url('https://accounts.zoho.in/v2/components/images/passwordless_illustration2x.png')",
        heading: "Passwordless sign-in",
        content: "Move away from risky passwords and experience one-tap access to Zoho. Download and Install OneAuth.",
        href: "https://zoho.to/za_signin_oa_rp"
      },
      {
        id: 1,
        img: "url('https://accounts.zoho.in/v2/components/images/mfa_illustration2x.png')",
        heading: "MFA for all accounts",
        content: "Secure online accounts with OneAuth 2FA. Back up OTP secrets and never lose access to your accounts.",
        href: "https://zoho.to/za_signin_oa_rp"
      },
      {
        id: 2,
        img: "url('https://accounts.zoho.in/v2/components/images/recovery_illustration2x.png')",
        heading: "Easy recovery modes",
        content: "Lost access to OneAuth? Worry not. Set up passphrase and backup number to recover OneAuth easily.",
        href: "https://zoho.to/za_signin_oa_rp"
      }
    ];

    return (
      <div className="rightside_box">
        <div className="overlapBanner" style={{width: "300px",display: "block"}}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              id={`banner_${banner.id}`}
              className={`rightbanner rightbannerTransition ${index === activeIndex ? "" : "slideright"}`}
            >
              <div className="container">
                <div className="banner1_img" style={{backgroundImage: banner.img}}></div>
                <div className="banner1_heading">{banner.heading}</div>
                <div className="banner1_content">{banner.content}</div>
                <a className="banner1_href" href={banner.href} target="_blank">Learn More</a>
              </div>
            </div>
          ))}
        </div>
        <div className="dotHead">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              id={`dot_${banner.id}`}
              className={`dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => this.handleDotClick(index)}
            >
              <div></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CarouselSlider;
