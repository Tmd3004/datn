import React from "react";
import classNames from "classnames/bind";
import Styles from "./Footer.module.scss";
import Image from "../../components/Image/Image";
import images from "../../assets/images/images";
import { MdOutlineEmail } from "react-icons/md";

const cx = classNames.bind(Styles);

const Footer = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("left")}>
        <div className={cx("contact")}>
          <span className={cx("contact-title")}>Contactanos</span>
          <MdOutlineEmail className={cx("contact-icon")}/>
        </div>
        <div className={cx("desc")}>
          <div className={cx("desc-item")}>
            <p>Un proyecto de</p>
            <div className={cx("logo-imgs")}>
              <Image
                src={images.ATLogo}
                alt="AT Logo"
                className={cx("logo-item")}
              />
              <Image
                src={images.hekateLogo}
                alt="Hekate Logo"
                className={cx("logo-item")}
              />
            </div>
          </div>

          <div className={cx("desc-item")}>
            <p>acompañado por</p>
            <div className={cx("logo-imgs")}>
              <Image
                src={images.ATLogo}
                alt="AT Logo"
                className={cx("logo-item")}
              />
              <Image
                src={images.hekateLogo}
                alt="Hekate Logo"
                className={cx("logo-item")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={cx("right")}>
        <Image src={images.logo} alt="Logo" className={cx("logo-img")} />
      </div>
    </div>
  );
};

export default Footer;
