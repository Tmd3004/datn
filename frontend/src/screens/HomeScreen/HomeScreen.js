import { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { baseUrl } from "../../config";
import Styles from "./HomeScreen.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { IoMdEye } from "react-icons/io";
import { Store } from "../../Store";
import { getError } from "../../utils";
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

function HomeScreen() {
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
        const { data } = await axios.get(
          `${baseUrl}/project/user-project/${userInfo._id}`,
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
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

  const dataAccept = data.filter((item) => item.status === "accept")

  return (
    <div style={{ padding: "0 15px" }}>
       <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <div style={{ backgroundColor: "#fff", marginBottom: "5px" }}>
        <h3
          style={{
            color: "#0054a6",
            fontSize: "20px",
            padding: "10px 20px",
          }}
        >
          <img
            src="/assets/circled-right.png"
            alt="logo-title"
            style={{ width: "25px", height: "25px", marginRight: "10px" }}
          />
          Bảng điều khiển của nhà khoa học
        </h3>
      </div>

      <div className={cx("wrapper")}>
        <div className={cx("list")}>
          <div className="col-md-8" style={{ marginRight: "30px" }}>
            <div className={cx("panel")}>
              <div className={cx("panel-heading")}>
                <b>Danh sách đề tài đang mở</b>
              </div>
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
                        <button
                          onClick={() =>
                            (window.location.href = "/program/school")
                          }
                          className={cx("link-btn")}
                        >
                          <div to="/program/school" className={cx("item-link")}>
                            Đăng ký chương trình
                          </div>
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
                        <button
                          onClick={() =>
                            (window.location.href = "/program/school")
                          }
                          className={cx("link-btn")}
                        >
                          <div to="/program/school" className={cx("item-link")}>
                            Đăng ký chương trình
                          </div>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>2024</td>
                      <td>Đề tài khác</td>
                      <td>17:00, 30/05/2024</td>
                      <td>1</td>
                      <td>
                        <button
                          onClick={() =>
                            (window.location.href = "/program/school")
                          }
                          className={cx("link-btn")}
                        >
                          <div to="/program/school" className={cx("item-link")}>
                            Đăng ký chương trình
                          </div>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={cx("list-item")}>
            <div className={cx("panel")}>
              <div className={cx("box-content")}>
                <button className={cx("total-file")}>
                  <Link to="/topic_review" className={cx("link-file")}>
                    <div className={cx("count")}>{dataAccept.length}</div>
                    <p>Tổng số hồ sơ được mời phản biện</p>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={cx("file")}>
          <div className={cx("panel")}>
            <div className={cx("panel-heading")}>
              <b style={{ paddingRight: "8px" }}>Theo dõi hồ sơ</b>
              <span
                className={cx("view-all")}
                onClick={() => (window.location.href = "/track_topic_status")}
              >
                Xem tất cả
              </span>
            </div>
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
                    <td width="8%">
                      <b>Vai trò</b>
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
                  {data.length > 0
                    ? data.map((item, index) => (
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
                            {
                              item.members.find(
                                (value) => value.userId === userInfo._id
                              ).role
                            }
                          </td>
                          <td>
                            {
                              item.status === "propose" ? "Đang chỉnh sửa" :
                              item.status === "handle" ? "Đang xử lý" :
                              "Đã xác nhận"
                            }
                          </td>
                          <td>
                            {item.status === "handle" ||
                            item.status === "accept" ? (
                              <button className={cx("view-btn")}>
                                <Link to={`/program/school/${item._id}`} className={cx("item-link")}>
                                  <IoMdEye
                                    size={20}
                                    style={{ marginRight: "4px" }}
                                  />
                                  Xem
                                </Link>
                              </button>
                            ) : (
                              <>
                                <button className={cx("edit-btn")}>
                                  <Link className={cx("item-link")}>
                                    <FaRegEdit
                                      size={20}
                                      style={{ marginRight: "4px" }}
                                    />{" "}
                                    Sửa
                                  </Link>
                                </button>
                                <button className={cx("delete-btn")}>
                                  <Link className={cx("item-link")}>
                                    <MdDeleteOutline
                                      size={20}
                                      style={{ marginRight: "4px" }}
                                    />{" "}
                                    Xoá
                                  </Link>
                                </button>
                              </>
                            )}
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
    </div>
  );
}
export default HomeScreen;
