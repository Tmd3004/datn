import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Styles from "./ProgramScreen.module.scss";
import classNames from "classnames/bind";
import { Helmet } from "react-helmet-async";

const cx = classNames.bind(Styles);

const ProgramScreen = () => {
  return (
    <div style={{ padding: "0 15px" }}>
      <Helmet>
        <title>Danh sách đề tài đang mở</title>
      </Helmet>
      <div style={{ backgroundColor: "#fff", marginBottom: "5px" }}>
        <h3
          style={{ color: "#0054a6", fontSize: "20px", padding: "10px 20px" }}
        >
          <img
            src="/assets/circled-right.png"
            alt="logo-title"
            style={{ width: "25px", height: "25px" }}
          />
          Danh sách đề tài đang mở
        </h3>
      </div>

      <div
        style={{
          height: "100vh",
          backgroundColor: "#fff",
          padding: "10px 20px",
        }}
      >
        <div className={cx("box-content")}>
          <table width="100%" style={{ fontSize: "14px" }}>
            <thead>
              <tr>
                <td width="5%">
                  <b>#</b>
                </td>
                <td width="5%">
                  <b>Năm</b>
                </td>
                <td width="40%">
                  <b>Tên chương trình</b>
                </td>
                <td width="20%">
                  <b>Hạn thu hồ sơ</b>
                </td>
                <td width="10%">
                  <b>Đợt thu hồ sơ</b>
                </td>
                <td width="20%">
                  <b>Đăng ký</b>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2024</td>
                <td>Đề tài cấp trường</td>
                <td>17:00, 30/05/2024</td>
                <td>1</td>
                <td>
                  <button className={cx("link-btn")}>
                    <Link to="/program/school" className={cx("item-link")}>
                      Đăng ký chương trình
                    </Link>
                  </button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>2024</td>
                <td>Đề tài cấp khoa</td>
                <td>17:00, 30/05/2024</td>
                <td>1</td>
                <td>
                  <button className={cx("link-btn")}>
                    <Link to="/program/faculty" className={cx("item-link")}>
                      Đăng ký chương trình
                    </Link>
                  </button>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>2024</td>
                <td>Đề tài khác</td>
                <td>17:00, 30/05/2024</td>
                <td>1</td>
                <td>
                  <button className={cx("link-btn")}>
                    <Link to="/program/other" className={cx("item-link")}>
                      Đăng ký chương trình
                    </Link>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgramScreen;
