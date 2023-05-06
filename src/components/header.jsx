import React, { Component } from "react";
class Header extends Component {
  state = {};
  render() {
    alert("header calling");
    return (
      <header>
        <div className="zw-promo-top">
          <div className="ztopstrip-container"></div>
        </div>
        <div className="zw-product-header">
          <div className="content-wrap bottom-animated middle-animated animated top-animated">
            <div className="product-title">
              <a href="/people/">
                <img
                  className="product-icon"
                  alt="Zoho people Logo"
                  src="https://www.zohowebstatic.com/sites/zweb/images/producticon/people.svg"
                  width="44"
                  height="44"
                />
                <span className="zprd-display-name">People</span>
              </a>
            </div>
            <div className="zgh-accounts">
              <a
                href="/people/signup.html"
                className="zgh-signup"
                style={{ display: "inline-block" }}
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
