import React from "react";

import logo from "../../assets/img/logo.svg";
import "./Popup.css";

const Popup = () => {
  return (
    <div className={"App"}>
      <header className={"App-header"}>
        <img src={logo} className={"App-logo"} alt={"logo"} />
        <a
          className={"App-link"}
          href={"https://github.com/ArkeeAgency/ninja-ytg"}
          target={"_blank"}
          rel={"noopener noreferrer"}
        >
          {"Give me a star on GitHub ⭐"}
        </a>
      </header>
    </div>
  );
};

export default Popup;
