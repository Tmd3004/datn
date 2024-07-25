import React from "react";
import classNames from "classnames/bind";
import Styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import Image from "../../components/Image/Image";
import images from "../../assets/images/images";

const cx = classNames.bind(Styles);

const Header = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <Link to="/user/login" className={cx("login-btn")}>
          Iniciar sesión
        </Link>
      </div>
      <div className={cx("logo-wrapper")}>
          <Image src={images.logo} alt="Logo" className={cx("logo-img")}/>
      </div>
    </div>
  );
};

export default Header;
