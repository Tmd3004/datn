import React, { useContext, useEffect, useReducer, useState } from "react";
import Styles from "./WorkingProcessScreen.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { baseUrl } from "../../config";
import { getError } from "../../utils";
import { toast } from "react-toastify";
import { Store } from "../../Store";
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

function MyVerticallyCenteredModal(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [workingAgency, setWorkingAgency] = useState({
    vi: "",
    en: "",
    address: "",
    phone: "",
    time: {
      begin: "",
      end: "",
    },
  });

  const [position, setPosition] = useState({
    vi: "",
    en: "",
  });

  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    const workingData = {
      workingAgency,
      position,
      note,
    };
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.post(
        `${baseUrl}/users/user-workings/${userInfo._id}`,
        workingData,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Add Training Process Successfully");
      props.onHide();
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className={cx("model-header")}>
        <span className={cx("model-title")}>BKDN</span>

        <button className={cx("close-btn")} onClick={props.onHide}>
          <img
            src="/assets/icon-close.png"
            alt="close-btn"
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "16px" }}>
        <span>
          <b>Cập nhật quá trình công tác</b>
        </span>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>Cơ quan công tác</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={workingAgency.vi}
                onChange={(e) =>
                  setWorkingAgency({ ...workingAgency, vi: e.target.value })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={workingAgency.en}
                onChange={(e) =>
                  setWorkingAgency({ ...workingAgency, en: e.target.value })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Địa chỉ
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={workingAgency.address}
                onChange={(e) =>
                  setWorkingAgency({
                    ...workingAgency,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Số điện thoại
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={workingAgency.phone}
                onChange={(e) =>
                  setWorkingAgency({ ...workingAgency, phone: e.target.value })
                }
              />
            </div>

            <div className="col-sm-12 d-flex">
              <label className={cx("col-sm-2", "control-label")}>
                Thời gian công tác
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <div className="d-flex flex-row">
                <span className={cx("time-title")}>
                  Từ
                  <input
                    type="text"
                    className={cx("form-control")}
                    style={{ width: "120px", marginLeft: "10px" }}
                    value={workingAgency.time.begin}
                    onChange={(e) =>
                      setWorkingAgency({
                        ...workingAgency,
                        time: { ...workingAgency.time, begin: e.target.value },
                      })
                    }
                  />
                </span>
                <span className={cx("time-title")}>
                  Đến
                  <input
                    type="text"
                    className={cx("form-control")}
                    style={{ width: "120px", marginLeft: "10px" }}
                    value={workingAgency.time.end}
                    onChange={(e) =>
                      setWorkingAgency({
                        ...workingAgency,
                        time: { ...workingAgency.time, end: e.target.value },
                      })
                    }
                  />
                </span>
                <span className={cx("time-title")}>
                  (dd/mm/YYYY đến dd/mm/YYYY hoặc Nay)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>Chức vụ</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={position.vi}
                onChange={(e) =>
                  setPosition({ ...position, vi: e.target.value })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={position.en}
                onChange={(e) =>
                  setPosition({ ...position, en: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>Ghi chú</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}></label>
              <textarea
                className={cx("form-control")}
                rows={4}
                cols={50}
                style={{ width: "100%", height: "90px" }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button className={cx("save-btn")} onClick={handleSubmit}>
            <FaSave style={{ marginRight: "4px" }} /> Lưu lại
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function EditedModal(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [workingAgency, setWorkingAgency] = useState({
    vi: "",
    en: "",
    address: "",
    phone: "",
    time: {
      begin: "",
      end: "",
    },
  });

  const [position, setPosition] = useState({
    vi: "",
    en: "",
  });

  const [note, setNote] = useState("");

  useEffect(() => {
    if (props.editData) {
      setWorkingAgency(
        props.editData.workingAgency || {
          vi: "",
          en: "",
          address: "",
          phone: "",
          time: {
            begin: "",
            end: "",
          },
        }
      );
      setPosition(
        props.editData.position || {
          vi: "",
          en: "",
        }
      );
      setNote(props.editData.note || "");
    }
  }, [props.editData]);

  const handleSubmit = async (e) => {
    const workingData = {
      workingAgency,
      position,
      note,
    };
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.put(
        `${baseUrl}/users/user-workings/${userInfo._id}/${props.editData?._id}`,
        workingData,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Add Working Process Successfully");
      props.onHide();
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className={cx("model-header")}>
        <span className={cx("model-title")}>BKDN</span>

        <button className={cx("close-btn")} onClick={props.onHide}>
          <img
            src="/assets/icon-close.png"
            alt="close-btn"
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "16px" }}>
        <span>
          <b>Cập nhật quá trình công tác</b>
        </span>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>Cơ quan công tác</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={workingAgency.vi}
                onChange={(e) =>
                  setWorkingAgency({ ...workingAgency, vi: e.target.value })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={workingAgency.en}
                onChange={(e) =>
                  setWorkingAgency({ ...workingAgency, en: e.target.value })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Địa chỉ
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={workingAgency.address}
                onChange={(e) =>
                  setWorkingAgency({
                    ...workingAgency,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Số điện thoại
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={workingAgency.phone}
                onChange={(e) =>
                  setWorkingAgency({ ...workingAgency, phone: e.target.value })
                }
              />
            </div>

            <div className="col-sm-12 d-flex">
              <label className={cx("col-sm-2", "control-label")}>
                Thời gian công tác
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <div className="d-flex flex-row">
                <span className={cx("time-title")}>
                  Từ
                  <input
                    type="text"
                    className={cx("form-control")}
                    style={{ width: "120px", marginLeft: "10px" }}
                    value={workingAgency.time.begin}
                    onChange={(e) =>
                      setWorkingAgency({
                        ...workingAgency,
                        time: { ...workingAgency.time, begin: e.target.value },
                      })
                    }
                  />
                </span>
                <span className={cx("time-title")}>
                  Đến
                  <input
                    type="text"
                    className={cx("form-control")}
                    style={{ width: "120px", marginLeft: "10px" }}
                    value={workingAgency.time.end}
                    onChange={(e) =>
                      setWorkingAgency({
                        ...workingAgency,
                        time: { ...workingAgency.time, end: e.target.value },
                      })
                    }
                  />
                </span>
                <span className={cx("time-title")}>
                  (dd/mm/YYYY đến dd/mm/YYYY hoặc Nay)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>Chức vụ</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={position.vi}
                onChange={(e) =>
                  setPosition({ ...position, vi: e.target.value })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={position.en}
                onChange={(e) =>
                  setPosition({ ...position, en: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>Ghi chú</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}></label>
              <textarea
                className={cx("form-control")}
                rows={4}
                cols={50}
                style={{ width: "100%", height: "90px" }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button className={cx("save-btn")} onClick={handleSubmit}>
            <FaSave style={{ marginRight: "4px" }} /> Lưu lại
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const WorkingProcessScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [modalShow, setModalShow] = useState(false);
  const [dataUser, setDataUser] = useState([]);

  const [editModelShow, setEditModelShow] = useState(false);
  const [selectWorking, setSelectWorking] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-workings/${userInfo._id}`
        );
        setDataUser(data.working);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [modalShow || editModelShow]);

  const handleEditClick = (data) => {
    setSelectWorking(data);
    setEditModelShow(true);
  };

  return (
    <div style={{ padding: "0 15px", height: "100vh" }}>
      <Helmet>
        <title>Quá trình công tác</title>
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
            <li className={cx("nav-item", "active")}>
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
            <li className={cx("nav-item")}>
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
            <span className={cx("panel-title")}>Quá trình đào tạo</span>
            <button
              className={cx("add-btn")}
              onClick={() => setModalShow(true)}
            >
              <MdAdd fontSize={20} />
              Thêm mới
            </button>
          </div>

          <div className={cx("panel-body")}>
            <table className={cx("table")}>
              <thead>
                <tr>
                  <td width="5%">
                    <b>#</b>
                  </td>
                  <td width="20%">
                    <b>Thời gian</b>
                  </td>
                  <td width="25%">
                    <b>Cơ quan công tác</b>
                  </td>
                  <td width="25%">
                    <b>Địa chỉ và Số điện thoại</b>
                  </td>
                  <td width="15%">
                    <b>Chức vụ</b>
                  </td>
                  <td width="10%">
                    <b>Thao tác</b>
                  </td>
                </tr>
              </thead>
              <tbody>
                {dataUser
                  ? dataUser.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {item.workingAgency.time.begin} -{" "}
                          {item.workingAgency.time.end}
                        </td>
                        <td>{item.workingAgency.vi}</td>
                        <td>
                          {item.workingAgency.address} -{" "}
                          {item.workingAgency.phone}
                        </td>
                        <td>{item.position.vi}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <button className={cx("edit-btn")} onClick={() => handleEditClick(item)}>
                              <FaRegEdit /> Sửa
                            </button>
                            <button className={cx("delete-btn")}>
                              <MdDeleteOutline /> Xoá
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <EditedModal
        show={editModelShow}
        onHide={() => setEditModelShow(false)}
        editData={selectWorking}
      />
    </div>
  );
};

export default WorkingProcessScreen;
