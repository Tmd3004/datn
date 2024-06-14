import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import Styles from "./ConfirmTopicScreen.module.scss";
import classNames from "classnames/bind";
import { IoMdEye } from "react-icons/io";
import { Store } from "../../Store";
import axios from "axios";
import { baseUrl } from "../../config";
import { getError } from "../../utils";
import { Helmet } from "react-helmet-async";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const cx = classNames.bind(Styles);

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}

const ConfirmTopic = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${baseUrl}/project`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        setData(data);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  const [activeNav, setActiveNav] = useState("");

  useEffect(() => {
    setActiveNav(window.location.href.slice(40));
  }, [window.location.reload]);

  const dataAccept = data.filter((item) => item.status === "handle");

  return (
    <div style={{ padding: "0 15px" }}>
      <Helmet>
        <title>Xác nhận đề tài</title>
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
          Đánh giá hồ sơ
        </h3>
      </div>

      <div
        style={{
          height: "100vh",
          backgroundColor: "#fff",
          padding: "10px 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px 5px",
          }}
        >
          <div className={cx("box-content")}>
            <table width="100%" style={{ fontSize: "14px" }}>
              <thead>
                <tr>
                  <td width="3%">
                    <b>#</b>
                  </td>
                  <td width="4%">
                    <b>Năm</b>
                  </td>
                  <td width="10%">
                    <b>Mã số</b>
                  </td>
                  <td width="25%">
                    <b> Thông tin về công trình khoa học</b>
                  </td>
                  <td width="15%">
                    <b>Chương trình</b>
                  </td>
                  <td width="15%">
                    <b>Tổ chức chủ trì</b>
                  </td>

                  <td width="10%">
                    <b>Trạng thái</b>
                  </td>
                  <td width="10%">
                    <b>Thao tác</b>
                  </td>
                </tr>
              </thead>
              <tbody>
                {dataAccept.length > 0
                  ? dataAccept.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>2024</td>
                        <td>
                          {item._id} {item.inforGeneral._id}
                        </td>
                        <td>{item.inforGeneral.topicNameVi}</td>
                        <td>
                          {item.topic === "school"
                            ? "Đề tài cấp trường"
                            : item.topic === "faculty"
                            ? "Đề tài cấp khoa"
                            : "Đề tài khác"}
                        </td>
                        <td>
                          {
                            item.inforGeneral?.hostOrganization
                              ?.organizationName
                          }
                        </td>
                        <td>
                          {item.status === "propose"
                            ? "Đang chỉnh sửa"
                            : item.status === "handle"
                            ? "Đang xử lý"
                            : "Đã xác nhận"}
                        </td>
                        <td>
                          <button className={cx("view-btn")}>
                            <Link
                              to={`/confirm-topic/${item._id}`}
                              className={cx("item-link")}
                            >
                              <IoMdEye
                                size={20}
                                style={{ marginRight: "4px" }}
                              />
                              Xem
                            </Link>
                          </button>
                        </td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTopic;
