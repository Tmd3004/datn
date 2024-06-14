import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Styles from "./TrainingProcessScreen.module.scss";
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
import { Store } from "../../Store";
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

function MyVerticallyCenteredModal(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const [trainingFacilityVi, setTrainingFacilityVi] = useState("");
  const [trainingFacilityEn, setTrainingFacilityEn] = useState("");
  const [address, setAddress] = useState("");
  const [time, setTime] = useState({
    begin: "",
    end: "",
  });
  const [majorVi, setMajorVi] = useState("");
  const [majorEn, setMajorEn] = useState("");
  const [degree, setDegree] = useState({
    Vi: "",
    En: "",
  });
  const [proofOfDegree, setProofDegree] = useState("");
  const [namePdf, setNamePdf] = useState("");

  const handleSubmit = async (e) => {
    const trainingData = {
      trainingFacilityVi,
      trainingFacilityEn,
      address,
      time,
      majorVi,
      majorEn,
      degree,
      proofOfDegree,
      namePdf,
    };
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.post(
        `${baseUrl}/users/user-trainings/${userInfo._id}`,
        trainingData,
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

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        `${baseUrl}/upload/upload-pdf`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });
      setNamePdf(data.name);
      setProofDegree(data.url);
      toast.success("Pdf uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  const fileInputRef = useRef(null);
  const handleButtonClickPdf = () => {
    fileInputRef.current.click();
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
          <b>Cập nhật quá trình đào tạo</b>
        </span>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Tên cở sở đào tạo (Tiếng Việt)
          </label>
          <input
            type="text"
            id="training-facility-vi"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            onChange={(e) => setTrainingFacilityVi(e.target.value)}
            value={trainingFacilityVi}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-en"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Tên cở sở đào tạo (Tiếng Anh)
          </label>
          <input
            type="text"
            id="training-facility-en"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            value={trainingFacilityEn}
            onChange={(e) => setTrainingFacilityEn(e.target.value)}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="address"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Thời gian
          </label>
          <div className="d-flex flex-row col-sm-9">
            <span className={cx("time-title")}>
              Từ
              <input
                type="text"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "10px" }}
                value={time.begin}
                onChange={(e) => setTime({ ...time, begin: e.target.value })}
              />
            </span>
            <span className={cx("time-title")}>
              Đến
              <input
                type="text"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "10px" }}
                value={time.end}
                onChange={(e) => setTime({ ...time, end: e.target.value })}
              />
            </span>
            <span className={cx("time-title")}>
              (dd/mm/YYYY đến dd/mm/YYYY hoặc Nay)
            </span>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="major-vi"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Chuyên ngành (Tiếng Việt)
          </label>
          <input
            type="text"
            id="major-vi"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            value={majorVi}
            onChange={(e) => setMajorVi(e.target.value)}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="major-en"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Chuyên ngành (Tiếng Anh)
          </label>
          <input
            type="text"
            id="major-en"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            value={majorEn}
            onChange={(e) => setMajorEn(e.target.value)}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Học hàm/Học vị
          </label>
          <div className="d-flex flex-row col-sm-9">
            <span className={cx("time-title")}>
              Tiếng Việt
              <input
                type="text"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "10px" }}
                value={degree.Vi}
                onChange={(e) => setDegree({ ...degree, Vi: e.target.value })}
              />
            </span>
            <span className={cx("time-title")}>
              Tiếng Anh
              <input
                type="text"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "10px" }}
                value={degree.En}
                onChange={(e) => setDegree({ ...degree, En: e.target.value })}
              />
            </span>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="major-en"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center",
              "control-label"
            )}
          >
            Tải lên minh chứng bằng cấp
          </label>
          <div className="d-flex flex-column justify-content-end col-sm-9">
            <div className="col-sm-3">
              {namePdf ? (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    fontStyle: "italic",
                    paddingBottom: "10px",
                  }}
                >
                  {namePdf}
                </div>
              ) : (
                ""
              )}
              <button className={cx("add-btn")} onClick={handleButtonClickPdf}>
                Chọn file PDF
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={uploadFileHandler}
              />
            </div>
            <div
              className="col-sm-12"
              style={{ paddingTop: "6px", fontSize: "14px" }}
            >
              <span className={cx("warning")}>
                Tải lên quyết định công nhận nghiên cứu sinh nếu chưa bảo vệ
                luận án tiến sỹ cấp nhà nước
              </span>
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

  const [trainingFacilityVi, setTrainingFacilityVi] = useState("");
  const [trainingFacilityEn, setTrainingFacilityEn] = useState("");
  const [address, setAddress] = useState("");
  const [time, setTime] = useState({
    begin: "",
    end: "",
  });
  const [majorVi, setMajorVi] = useState("");
  const [majorEn, setMajorEn] = useState("");
  const [degree, setDegree] = useState({
    Vi: "",
    En: "",
  });
  const [proofOfDegree, setProofDegree] = useState("");
  const [namePdf, setNamePdf] = useState("");

  useEffect(() => {
    if (props.editData) {
      setTrainingFacilityVi(props.editData.trainingFacilityVi || "");
      setTrainingFacilityEn(props.editData.trainingFacilityEn || "");
      setAddress(props.editData.address || "");
      setTime(props.editData.time || { begin: "", end: "" });
      setMajorVi(props.editData.majorVi || "");
      setMajorEn(props.editData.majorEn || "");
      setDegree(props.editData.degree || { Vi: "", En: "" });
      setProofDegree(props.editData.proofOfDegree || "");
      setNamePdf(props.editData.namePdf || "");
    }
  }, [props.editData]);

  console.log(trainingFacilityVi);

  const handleSubmit = async (e) => {
    const trainingData = {
      trainingFacilityVi,
      trainingFacilityEn,
      address,
      time,
      majorVi,
      majorEn,
      degree,
      proofOfDegree,
    };
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.put(
        `${baseUrl}/users/user-trainings/${userInfo._id}/${props.editData?._id}`,
        trainingData,
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

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        `${baseUrl}/upload/upload-pdf`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });
      setNamePdf(data.name);
      setProofDegree(data.url);
      toast.success("Pdf uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  const fileInputRef = useRef(null);
  const handleButtonClickPdf = () => {
    fileInputRef.current.click();
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

        <button className={cx("close-btn")}>
          <img
            src="/assets/icon-close.png"
            alt="close-btn"
            style={{ width: "30px", height: "30px" }}
            onClick={props.onHide}
          />
        </button>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "16px" }}>
        <span>
          <b>Cập nhật quá trình đào tạo</b>
        </span>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Tên cở sở đào tạo (Tiếng Việt)
          </label>
          <input
            type="text"
            id="training-facility-vi"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            value={trainingFacilityVi}
            onChange={(e) => setTrainingFacilityVi(e.target.value)}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-en"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Tên cở sở đào tạo (Tiếng Anh)
          </label>
          <input
            type="text"
            id="training-facility-en"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            value={trainingFacilityEn}
            onChange={(e) => setTrainingFacilityEn(e.target.value)}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="address"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Thời gian
          </label>
          <div className="d-flex flex-row col-sm-9">
            <span className={cx("time-title")}>
              Từ
              <input
                type="text"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "10px" }}
                value={time.begin}
                onChange={(e) => setTime({ ...time, begin: e.target.value })}
              />
            </span>
            <span className={cx("time-title")}>
              Đến
              <input
                type="text"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "10px" }}
                value={time.end}
                onChange={(e) => setTime({ ...time, end: e.target.value })}
              />
            </span>
            <span className={cx("time-title")}>
              (dd/mm/YYYY đến dd/mm/YYYY hoặc Nay)
            </span>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="major-vi"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Chuyên ngành (Tiếng Việt)
          </label>
          <input
            type="text"
            id="major-vi"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            value={majorVi}
            onChange={(e) => setMajorVi(e.target.value)}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="major-en"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Chuyên ngành (Tiếng Anh)
          </label>
          <input
            type="text"
            id="major-en"
            className={cx("form-control")}
            style={{ width: "100%" }}
            required
            value={majorEn}
            onChange={(e) => setMajorEn(e.target.value)}
          />
        </div>

        <div className={cx("form-group")}>
          <label
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center align-items-center",
              "control-label"
            )}
          >
            Học hàm/Học vị
          </label>
          <div className="d-flex flex-row col-sm-9">
            <span className={cx("time-title")}>
              Tiếng Việt
              <input
                type="text"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "10px" }}
                value={degree.Vi}
                onChange={(e) => setDegree({ ...degree, Vi: e.target.value })}
              />
            </span>
            <span className={cx("time-title")}>
              Tiếng Anh
              <input
                type="text"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "10px" }}
                value={degree.En}
                onChange={(e) => setDegree({ ...degree, En: e.target.value })}
              />
            </span>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="major-en"
            className={cx(
              "col-sm-3",
              "d-flex justify-content-center",
              "control-label"
            )}
          >
            Tải lên minh chứng bằng cấp
          </label>
          <div className="d-flex flex-column justify-content-end col-sm-9">
            <div className="col-sm-3">
              {namePdf ? (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    fontStyle: "italic",
                    paddingBottom: "10px",
                  }}
                >
                  {namePdf}
                </div>
              ) : (
                ""
              )}
              <button className={cx("add-btn")} onClick={handleButtonClickPdf}>
                Chọn file PDF
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={uploadFileHandler}
              />
            </div>
            <div
              className="col-sm-12"
              style={{ paddingTop: "6px", fontSize: "14px" }}
            >
              <span className={cx("warning")}>
                Tải lên quyết định công nhận nghiên cứu sinh nếu chưa bảo vệ
                luận án tiến sỹ cấp nhà nước
              </span>
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

const TrainingProcessScreen = () => {
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
  const [selectTraining, setSelectTraining] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-trainings/${userInfo._id}`
        );
        setDataUser(data.training);
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
    setSelectTraining(data);
    setEditModelShow(true);
  };

  return (
    <div style={{ padding: "0 15px", height: "100vh" }}>
      <Helmet>
        <title>Quá trình đào tạo</title>
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
            <li className={cx("nav-item", "active")}>
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
              onClick={() => {
                setModalShow(true);
              }}
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
                  <td width="15%">
                    <b>Thời gian</b>
                  </td>
                  <td width="25%">
                    <b>Tên cơ sở đào tạo</b>
                  </td>
                  <td width="16%">
                    <b>Chuyên ngành</b>
                  </td>
                  <td width="15%">
                    <b>Học hàm/Học vị</b>
                  </td>
                  <td width="12%">
                    <b>
                      Minh chứng <br /> Bằng cấp
                    </b>
                  </td>
                  <td width="12%">
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
                          {item.time.begin} - {item.time.end}
                        </td>
                        <td>{item.trainingFacilityVi}</td>
                        <td>{item.majorVi}</td>
                        <td>{item.degree.Vi}</td>
                        {item.proofOfDegree ? (
                          <td>
                            <Link to={item.proofOfDegree} target="_blank">
                              Xem
                            </Link>
                          </td>
                        ) : (
                          <td>Chưa có</td>
                        )}
                        <td>
                          <div className="d-flex justify-content-center">
                            <button
                              className={cx("edit-btn")}
                              onClick={() => handleEditClick(item)}
                            >
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
        editData={selectTraining}
      />
    </div>
  );
};

export default TrainingProcessScreen;
