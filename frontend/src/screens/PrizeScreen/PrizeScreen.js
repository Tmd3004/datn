import React, { useContext, useEffect, useReducer, useState } from "react";
import Styles from "./PrizeScreen.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { TiPlus } from "react-icons/ti";
import { FaSave } from "react-icons/fa";
import { TiMinus } from "react-icons/ti";
import { Store } from "../../Store";
import axios from "axios";
import { baseUrl } from "../../config";
import { getError } from "../../utils";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

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

const PrizeScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [modalShow, setModalShow] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [content, setContent] = useState("");
  const [year, setYear] = useState("");
  const [edit, setEdit] = useState(false);
  const [selectEditId, setSelectEditId] = useState("");
  const [deleteClick, setDeleteClick] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-prizes/${userInfo._id}`
        );
        setDataUser(data.prizes);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [modalShow || edit || deleteClick]);

  const handleAddPrize = async (e) => {
    const prizeData = {
      content,
      year,
    };
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.post(
        `${baseUrl}/users/user-prizes/${userInfo._id}`,
        prizeData,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setModalShow(false);
      setContent("");
      setYear("");
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Add Training Process Successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const handleEditPrize = async (e) => {
    const prizeData = {
      content,
      year,
    };
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.put(
        `${baseUrl}/users/user-prizes/${userInfo._id}/${selectEditId}`,
        prizeData,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setModalShow(false);
      setEdit(false);
      setContent("");
      setYear("");
      setSelectEditId("");
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Add Training Process Successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const handleDelete = async (data) => {
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.delete(
        `${baseUrl}/users/user-prizes/${userInfo._id}/${data._id}`,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Delete Prize Successfully");
      setDeleteClick(!deleteClick);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  return (
    <div style={{ padding: "0 15px", height: "100vh" }}>
      <Helmet>
        <title>Thông tin giải thưởng</title>
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
          Lý lịch khoa học
        </h3>
      </div>
      <div style={{ backgroundColor: "#fff", padding: "10px 20px" }}>
        <div style={{ fontSize: "14px" }}>
          <ul className={cx("nav")}>
            <li className={cx("nav-item")}>
              <Link to="/manage_profile" className={cx("nav-link")}>
                <img
                  src="/assets/information.png"
                  alt="information"
                  style={{
                    width: "22px",
                    height: "22px",
                    marginRight: "4px",
                  }}
                />
                Thông tin cá nhân
              </Link>
            </li>
            <li className={cx("nav-item")}>
              <Link to="/manage_profile_1" className={cx("nav-link")}>
                <img
                  src="/assets/education.png"
                  alt="education"
                  style={{
                    width: "22px",
                    height: "22px",
                    marginRight: "4px",
                  }}
                />
                Quá trình đào tạo
              </Link>
            </li>
            <li className={cx("nav-item")}>
              <Link to="/manage_profile_2" className={cx("nav-link")}>
                <img
                  src="/assets/work.png"
                  alt="work"
                  style={{
                    width: "22px",
                    height: "22px",
                    marginRight: "8px",
                  }}
                />
                Quá trình công tác
              </Link>
            </li>
            <li className={cx("nav-item")}>
              <Link to="/manage_profile_3" className={cx("nav-link")}>
                <img
                  src="/assets/publication.png"
                  alt="publication"
                  style={{
                    width: "22px",
                    height: "22px",
                    marginRight: "8px",
                  }}
                />
                Hoạt động nghiên cứu
              </Link>
            </li>
            <li className={cx("nav-item", "active")}>
              <Link to="/manage_profile_4" className={cx("nav-link")}>
                <img
                  src="/assets/prize.png"
                  alt="prize"
                  style={{
                    width: "22px",
                    height: "22px",
                    marginRight: "8px",
                  }}
                />
                Thông tin giải thưởng
              </Link>
            </li>
            <li className={cx("nav-item")}>
              <Link to="/manage_profile_5" className={cx("nav-link")}>
                <img
                  src="/assets/print.png"
                  alt="print"
                  style={{
                    width: "22px",
                    height: "22px",
                    marginRight: "8px",
                  }}
                />
                Xem và in
              </Link>
            </li>
          </ul>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #0d6efd",
            borderRadius: "4px",
          }}
        >
          <div className={cx("panel-heading")}>
            <span className={cx("panel-title")}>Thông tin giải thưởng</span>
          </div>

          <div className={cx("panel-body")}>
            <table className={cx("table")}>
              <thead>
                <tr>
                  <td width="5%">
                    <b>#</b>
                  </td>
                  <td width="55%">
                    <b>Hình thức và nội dung giải thưởng</b>
                  </td>

                  <td width="20%">
                    <b>Năm tặng thưởng</b>
                  </td>
                  <td width="10%">
                    <b>sửa</b>
                  </td>
                  <td width="10%">
                    <b>Xoá</b>
                  </td>
                </tr>
              </thead>
              <tbody>
                {dataUser
                  ? dataUser.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.content}</td>
                        <td>{item.year}</td>
                        <td>
                          <span
                            className={cx("link-edit")}
                            onClick={() => {
                              setSelectEditId(item._id);
                              setContent(item.content);
                              setYear(item.year);
                              setEdit(true);
                              setModalShow(true);
                            }}
                          >
                            Sửa
                          </span>
                        </td>
                        <td>
                          <span
                            className={cx("link-delete")}
                            onClick={() => handleDelete(item)}
                          >
                            Xoá
                          </span>
                        </td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #0d6efd",
            borderRadius: "4px",
            marginTop: "20px",
          }}
        >
          <div className={cx("panel-heading")}>
            <span className={cx("panel-title")}>Thông tin giải thưởng</span>
            {modalShow ? (
              <button
                className={cx("add-btn")}
                onClick={() => setModalShow(!modalShow)}
              >
                <TiMinus fontSize={20} style={{ marginBottom: "2px" }} />
                Ẩn
              </button>
            ) : (
              <button
                className={cx("add-btn")}
                onClick={() => setModalShow(!modalShow)}
              >
                <TiPlus fontSize={20} style={{ marginBottom: "2px" }} />
                Thêm
              </button>
            )}
          </div>

          <div className={cx("panel-body", modalShow ? "show" : "hide")}>
            <div
              className={cx("form-group")}
              style={{ borderBottom: "1px solid #eee" }}
            >
              <label
                htmlFor="training-facility-vi"
                className={cx("col-sm-3", "control-label")}
                style={{ textAlign: "left" }}
              >
                <b>Thêm thông tin giải thưởng mới</b>
              </label>
            </div>

            <div
              className={cx("form-group")}
              style={{ borderBottom: "1px solid #eee" }}
            >
              <label
                htmlFor="training-facility-vi"
                className={cx("col-sm-3", "control-label")}
                style={{ textAlign: "center" }}
              >
                Hình thức và nội dung giải thưởng
              </label>
              <div className="col-sm-6 d-flex flex-column">
                <textarea
                  className={cx("form-control")}
                  style={{ width: "100%", height: "80px" }}
                  cols={50}
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>

            <div
              className={cx("form-group")}
              style={{ borderBottom: "1px solid #eee" }}
            >
              <label
                htmlFor="training-facility-vi"
                className={cx("col-sm-3", "control-label")}
                style={{ textAlign: "center" }}
              >
                Năm tặng thưởng
              </label>
              <div className="col-sm-2 d-flex flex-column">
                <input
                  className={cx("form-control")}
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>

            <div
              className="d-flex justify-content-center"
              style={{ paddingTop: "15px" }}
            >
              {edit ? (
                <button className={cx("save-btn")} onClick={handleEditPrize}>
                  <FaSave style={{ marginRight: "4px" }} /> Lưu lại
                </button>
              ) : (
                <button className={cx("save-btn")} onClick={handleAddPrize}>
                  <FaSave style={{ marginRight: "4px" }} /> Lưu lại
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeScreen;
