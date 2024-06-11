import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Styles from "./ResearchProcessScreen.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Store } from "../../Store";
import axios from "axios";
import { baseUrl } from "../../config";
import { getError } from "../../utils";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

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

function ListTopicModel(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState({
    vi: "",
    en: "",
  });
  const [sponsoringOrganization, setSponsoringOrganization] = useState({
    vi: "",
    en: "",
  });
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [role, setRole] = useState({
    vi: "",
    en: "",
  });
  const [time, setTime] = useState({
    begin: "",
    end: "",
  });
  const [expense, setExpense] = useState({
    money: 0,
    typeMoney: "",
  });
  const [addInfor, setAddInfor] = useState("");

  const handleSubmit = async (e) => {
    const listResearchData = {
      name,
      sponsoringOrganization,
      address,
      website,
      role,
      time,
      expense,
      addInfor,
    };

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.post(
        `${baseUrl}/users/user-researches/${userInfo._id}/list-research`,
        listResearchData,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("List Research Process Successfully");
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
        <span className={cx("model-title")}>nafosted</span>

        <button className={cx("close-btn")} onClick={props.onHide}>
          <img
            src="/assets/icon-close.png"
            alt="close-btn"
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "16px" }}>
        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>TÊN ĐỀ TÀI / DỰ ÁN</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <textarea
                className={cx("form-control")}
                style={{ width: "100%", height: "80px" }}
                cols={30}
                rows={3}
                required
                value={name.vi}
                onChange={(e) => setName({ ...name, vi: e.target.value })}
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <textarea
                className={cx("form-control")}
                style={{ width: "100%", height: "80px" }}
                cols={30}
                rows={3}
                required
                value={name.en}
                onChange={(e) => setName({ ...name, en: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>TÊN TỔ CHỨC TÀI TRƠ</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={sponsoringOrganization.vi}
                onChange={(e) =>
                  setSponsoringOrganization({
                    ...sponsoringOrganization,
                    vi: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={sponsoringOrganization.en}
                onChange={(e) =>
                  setSponsoringOrganization({
                    ...sponsoringOrganization,
                    en: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>ĐỊA CHỈ</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}></label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>WEBSITE</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}></label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>VAI TRÒ</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={role.vi}
                onChange={(e) => setRole({ ...role, vi: e.target.value })}
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={role.en}
                onChange={(e) => setRole({ ...role, en: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>THỜI GIAN</b>
          </label>
          <div className="d-flex flex-row col-sm-10">
            <label
              htmlFor="training-facility-vi"
              className={cx("col-sm-2", "control-label")}
            ></label>
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
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>TỔNG CHI PHÍ</b>
          </label>
          <div className="d-flex flex-row col-sm-10">
            <label
              htmlFor="training-facility-vi"
              className={cx("col-sm-2", "control-label")}
            ></label>
            <span className={cx("time-title")}>
              <input
                type="number"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "28px" }}
                value={expense.money}
                onChange={(e) =>
                  setExpense({ ...expense, money: e.target.value })
                }
              />
            </span>
            <span className={cx("time-title")}>
              <select
                className={cx("form-control")}
                style={{ width: "150px" }}
                required
                value={expense.type}
                onChange={(e) =>
                  setExpense({ ...expense, typeMoney: e.target.value })
                }
              >
                <option value="">Chọn</option>
                <option value="VND">Triệu VNĐ</option>
                <option value="USD">USD</option>
                <option value="Euro">Euro</option>
              </select>
            </span>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>THÔNG TIN THÊM</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}></label>
              <textarea
                className={cx("form-control")}
                rows={4}
                cols={50}
                style={{ width: "100%", height: "90px" }}
                value={addInfor}
                onChange={(e) => setAddInfor(e.target.value)}
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

function EditListModel(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState({
    vi: "",
    en: "",
  });
  const [sponsoringOrganization, setSponsoringOrganization] = useState({
    vi: "",
    en: "",
  });
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [role, setRole] = useState({
    vi: "",
    en: "",
  });
  const [time, setTime] = useState({
    begin: "",
    end: "",
  });
  const [expense, setExpense] = useState({
    money: 0,
    typeMoney: "",
  });
  const [addInfor, setAddInfor] = useState("");

  useEffect(() => {
    if (props.editData) {
      setName(props.editData.name || { vi: "", en: "" });
      setSponsoringOrganization(
        props.editData.sponsoringOrganization || { vi: "", en: "" }
      );
      setAddress(props.editData.address || "");
      setWebsite(props.editData.website || "");
      setRole(props.editData.role || { vi: "", en: "" });
      setTime(props.editData.time || { begin: "", end: "" });
      setExpense(props.editData.expense || { money: 0, typeMoney: "" });
      setAddInfor(props.editData.addInfor || "");
    }
  }, [props.editData]);

  const handleSubmit = async (e) => {
    const listResearchData = {
      name,
      sponsoringOrganization,
      address,
      website,
      role,
      time,
      expense,
      addInfor,
    };

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.put(
        `${baseUrl}/users/user-researches/${userInfo._id}/${props.editData?._id}/list-research`,
        listResearchData,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("List Research Process Successfully");
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
        <span className={cx("model-title")}>nafosted</span>

        <button className={cx("close-btn")} onClick={props.onHide}>
          <img
            src="/assets/icon-close.png"
            alt="close-btn"
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "16px" }}>
        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>TÊN ĐỀ TÀI / DỰ ÁN</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <textarea
                className={cx("form-control")}
                style={{ width: "100%", height: "80px" }}
                cols={30}
                rows={3}
                required
                value={name.vi}
                onChange={(e) => setName({ ...name, vi: e.target.value })}
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <textarea
                className={cx("form-control")}
                style={{ width: "100%", height: "80px" }}
                cols={30}
                rows={3}
                required
                value={name.en}
                onChange={(e) => setName({ ...name, en: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>TÊN TỔ CHỨC TÀI TRƠ</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={sponsoringOrganization.vi}
                onChange={(e) =>
                  setSponsoringOrganization({
                    ...sponsoringOrganization,
                    vi: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={sponsoringOrganization.en}
                onChange={(e) =>
                  setSponsoringOrganization({
                    ...sponsoringOrganization,
                    en: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>ĐỊA CHỈ</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}></label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>WEBSITE</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}></label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>VAI TRÒ</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Việt
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={role.vi}
                onChange={(e) => setRole({ ...role, vi: e.target.value })}
              />
            </div>

            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}>
                Tiếng Anh
                <span style={{ color: "#FF0000" }}>*</span>
              </label>
              <input
                type="text"
                id="training-facility-vi"
                className={cx("form-control")}
                style={{ width: "100%" }}
                required
                value={role.en}
                onChange={(e) => setRole({ ...role, en: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>THỜI GIAN</b>
          </label>
          <div className="d-flex flex-row col-sm-10">
            <label
              htmlFor="training-facility-vi"
              className={cx("col-sm-2", "control-label")}
            ></label>
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
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>TỔNG CHI PHÍ</b>
          </label>
          <div className="d-flex flex-row col-sm-10">
            <label
              htmlFor="training-facility-vi"
              className={cx("col-sm-2", "control-label")}
            ></label>
            <span className={cx("time-title")}>
              <input
                type="number"
                className={cx("form-control")}
                style={{ width: "120px", marginLeft: "28px" }}
                value={expense.money}
                onChange={(e) =>
                  setExpense({ ...expense, money: e.target.value })
                }
              />
            </span>
            <span className={cx("time-title")}>
              <select
                className={cx("form-control")}
                style={{ width: "150px" }}
                required
                value={expense.type}
                onChange={(e) =>
                  setExpense({ ...expense, typeMoney: e.target.value })
                }
              >
                <option value="">Chọn</option>
                <option value="VND">Triệu VNĐ</option>
                <option value="USD">USD</option>
                <option value="Euro">Euro</option>
              </select>
            </span>
          </div>
        </div>

        <div className={cx("form-group")}>
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-2", "control-label")}
          >
            <b>THÔNG TIN THÊM</b>
          </label>
          <div className="col-sm-10 d-flex flex-column">
            <div className="col-sm-12 d-flex" style={{ paddingBottom: "20px" }}>
              <label className={cx("col-sm-2", "control-label")}></label>
              <textarea
                className={cx("form-control")}
                rows={4}
                cols={50}
                style={{ width: "100%", height: "90px" }}
                value={addInfor}
                onChange={(e) => setAddInfor(e.target.value)}
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

function ResultTopicModel(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [magazineName, setMagazineName] = useState("");
  const [typeResearch, setTypeResearch] = useState("");
  const [year, setYear] = useState(0);
  const [issn, setIssn] = useState("");
  const [proofOfDegree, setProofDegree] = useState("");
  const [namePdf, setNamePdf] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = async (e) => {
    const listResearchData = {
      name,
      author,
      magazineName,
      typeResearch,
      year,
      issn,
      proofOfDegree,
      namePdf,
      note,
    };

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.post(
        `${baseUrl}/users/user-researches/${userInfo._id}/result-research`,
        listResearchData,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("List Research Process Successfully");
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
        <span className={cx("model-title")}>nafosted</span>

        <button className={cx("close-btn")}>
          <img
            src="/assets/icon-close.png"
            alt="close-btn"
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "16px" }}>
        <div className="col-sm-12">
          <p className={cx("notify-header")}>
            Chú ý: Tên các kết quả công bố được viết bằng một ngôn ngữ khác
            Tiếng Việt phải được điền chính xác, toàn văn (không dịch). Với các
            công bố trên tạp chí được xếp hạng (SCI, SCIE), bạn cần điền số hiệu
            ISSN của tạp chí đó để việc đánh giá năng lực nghiên cứu thuận tiện
            và chính xác hơn.
          </p>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Tên công trình</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-9 d-flex flex-column">
            <textarea
              className={cx("form-control")}
              style={{ width: "100%", height: "80px" }}
              cols={50}
              rows={4}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            style={{ textAlign: "right" }}
          >
            <b>Tên tác giả</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-9 d-flex flex-column">
            <textarea
              className={cx("form-control")}
              style={{ width: "100%", height: "60px" }}
              cols={50}
              rows={4}
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
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
            style={{ textAlign: "right" }}
          >
            <b>Tên tạp chí NXB/Số, Tập, Trang đăng công trình</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-9 d-flex flex-column">
            <textarea
              className={cx("form-control")}
              style={{ width: "100%", height: "60px" }}
              cols={50}
              rows={4}
              required
              value={magazineName}
              onChange={(e) => setMagazineName(e.target.value)}
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
            style={{ textAlign: "right" }}
          >
            <b>Loại kết quả nghiên cứu</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-6 d-flex flex-column">
            <select
              className={cx("form-control")}
              style={{ width: "auto" }}
              value={typeResearch}
              onChange={(e) => setTypeResearch(e.target.value)}
            >
              <option value="">Chọn</option>
              <option value="Bài báo ISI uy tín">Bài báo ISI uy tín</option>
              <option value="Bài báo quốc tế uy tín">
                Bài báo quốc tế uy tín
              </option>
              <option value="Bài báo quốc tế khác">Bài báo quốc tế khác</option>
              <option value="Bài báo tại hội nghị quốc gia/quốc tế">
                Bài báo tại hội nghị quốc gia/quốc tế
              </option>
              <option value="Bài báo trên các tạp chí khoa học quốc gia uy tín">
                Bài báo trên các tạp chí khoa học quốc gia uy tín
              </option>
              <option value="Khác(Sách chuyên khảo, bằng sáng chế, giải thưởng khoa học)">
                Khác(Sách chuyên khảo, bằng sáng chế, giải thưởng khoa học)
              </option>
            </select>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Năm</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-2">
            <input
              type="number"
              className={cx("form-control")}
              style={{ width: "100%" }}
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <label
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>SỐ HIỆU ISSN (viết liền: xxxx-xxxx)</b>
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className={cx("form-control")}
              style={{ width: "100%" }}
              required
              value={issn}
              onChange={(e) => setIssn(e.target.value)}
            />
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Tải lên minh chứng/Bằng cấp</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-9">
            <div className={cx("file-input")}>
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
              <div>
                <button
                  className={cx("save-btn")}
                  onClick={handleButtonClickPdf}
                >
                  Chọn file PDF
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={uploadFileHandler}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Ghi chú</b>
          </label>
          <div className="col-sm-9 d-flex flex-column">
            <textarea
              className={cx("form-control")}
              style={{ width: "100%", height: "80px" }}
              cols={50}
              rows={4}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div
          className="d-flex justify-content-center"
          style={{ paddingTop: "15px" }}
        >
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

function EditResultModal(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [magazineName, setMagazineName] = useState("");
  const [typeResearch, setTypeResearch] = useState("");
  const [year, setYear] = useState(0);
  const [issn, setIssn] = useState("");
  const [proofOfDegree, setProofDegree] = useState("");
  const [namePdf, setNamePdf] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (props.editData) {
      setName(props.editData.name || "");
      setAuthor(props.editData.author || "");
      setMagazineName(props.editData.magazineName || "");
      setTypeResearch(props.editData.typeResearch || "");
      setYear(props.editData.year || 0);
      setIssn(props.editData.issn || "");
      setProofDegree(props.editData.proofOfDegree || "");
      setNamePdf(props.editData.namePdf || "");
      setNote(props.editData.note || "");
    }
  }, [props.editData]);

  console.log(proofOfDegree);

  const handleSubmit = async (e) => {
    const listResearchData = {
      name,
      author,
      magazineName,
      typeResearch,
      year,
      issn,
      proofOfDegree,
      namePdf,
      note,
    };

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.put(
        `${baseUrl}/users/user-researches/${userInfo._id}/${props.editData?._id}/result-research`,
        listResearchData,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("List Research Process Successfully");
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
        <span className={cx("model-title")}>nafosted</span>

        <button className={cx("close-btn")}>
          <img
            src="/assets/icon-close.png"
            alt="close-btn"
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "16px" }}>
        <div className="col-sm-12">
          <p className={cx("notify-header")}>
            Chú ý: Tên các kết quả công bố được viết bằng một ngôn ngữ khác
            Tiếng Việt phải được điền chính xác, toàn văn (không dịch). Với các
            công bố trên tạp chí được xếp hạng (SCI, SCIE), bạn cần điền số hiệu
            ISSN của tạp chí đó để việc đánh giá năng lực nghiên cứu thuận tiện
            và chính xác hơn.
          </p>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Tên công trình</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-9 d-flex flex-column">
            <textarea
              className={cx("form-control")}
              style={{ width: "100%", height: "80px" }}
              cols={50}
              rows={4}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            style={{ textAlign: "right" }}
          >
            <b>Tên tác giả</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-9 d-flex flex-column">
            <textarea
              className={cx("form-control")}
              style={{ width: "100%", height: "60px" }}
              cols={50}
              rows={4}
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
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
            style={{ textAlign: "right" }}
          >
            <b>Tên tạp chí NXB/Số, Tập, Trang đăng công trình</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-9 d-flex flex-column">
            <textarea
              className={cx("form-control")}
              style={{ width: "100%", height: "60px" }}
              cols={50}
              rows={4}
              required
              value={magazineName}
              onChange={(e) => setMagazineName(e.target.value)}
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
            style={{ textAlign: "right" }}
          >
            <b>Loại kết quả nghiên cứu</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-6 d-flex flex-column">
            <select
              className={cx("form-control")}
              style={{ width: "auto" }}
              value={typeResearch}
              onChange={(e) => setTypeResearch(e.target.value)}
            >
              <option value="">Chọn</option>
              <option value="Bài báo ISI uy tín">Bài báo ISI uy tín</option>
              <option value="Bài báo quốc tế uy tín">
                Bài báo quốc tế uy tín
              </option>
              <option value="Bài báo quốc tế khác">Bài báo quốc tế khác</option>
              <option value="Bài báo tại hội nghị quốc gia/quốc tế">
                Bài báo tại hội nghị quốc gia/quốc tế
              </option>
              <option value="Bài báo trên các tạp chí khoa học quốc gia uy tín">
                Bài báo trên các tạp chí khoa học quốc gia uy tín
              </option>
              <option value="Khác(Sách chuyên khảo, bằng sáng chế, giải thưởng khoa học)">
                Khác(Sách chuyên khảo, bằng sáng chế, giải thưởng khoa học)
              </option>
            </select>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Năm</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-2">
            <input
              type="number"
              className={cx("form-control")}
              style={{ width: "100%" }}
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <label
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>SỐ HIỆU ISSN (viết liền: xxxx-xxxx)</b>
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              className={cx("form-control")}
              style={{ width: "100%" }}
              required
              value={issn}
              onChange={(e) => setIssn(e.target.value)}
            />
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Tải lên minh chứng/Bằng cấp</b>
            <span style={{ color: "#FF0000" }}>*</span>
          </label>
          <div className="col-sm-9">
            <div className={cx("file-input")}>
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
              <div>
                <button
                  className={cx("save-btn")}
                  onClick={handleButtonClickPdf}
                >
                  Chọn file PDF
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={uploadFileHandler}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={cx("form-group")}
          style={{ borderBottom: "1px solid #eee" }}
        >
          <label
            htmlFor="training-facility-vi"
            className={cx("col-sm-3", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Ghi chú</b>
          </label>
          <div className="col-sm-9 d-flex flex-column">
            <textarea
              className={cx("form-control")}
              style={{ width: "100%", height: "80px" }}
              cols={50}
              rows={4}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div
          className="d-flex justify-content-center"
          style={{ paddingTop: "15px" }}
        >
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

const ResearchProcessScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [modalShow, setModalShow] = useState(false);
  const [mainResearch, setMainResearch] = useState({
    vi: "",
    en: "",
  });
  const [listTopics, setListTopics] = useState([]);
  const [resultsResearch, setResultsResearch] = useState([]);

  const [editListModelShow, setEditListModelShow] = useState(false);
  const [selectListResearch, setSelectListResearch] = useState({});

  const [resultEditModalShow, setResultEditModalShow] = useState(false);
  const [resultModelShow, setResultModelShow] = useState(false);
  const [selectResult, setSelectResult] = useState({});

  const [activeNav, setActiveNav] = useState("#");

  console.log(resultsResearch);

  useEffect(() => {
    setActiveNav(window.location.href.slice(38));
  }, [window.location.reload]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-researches/${userInfo._id}`
        );
        setMainResearch(data.mainResearch);
        setListTopics(data.listTopics);
        setResultsResearch(data.results);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [modalShow || editListModelShow || resultModelShow]);

  const handleSubmitMainResearch = async (e) => {
    const mainResearchData = {
      mainResearch,
    };
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      await axios.put(
        `${baseUrl}/users/user-researches/${userInfo._id}/main-research`,
        mainResearchData,
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
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const handleEditListClick = (data) => {
    setSelectListResearch(data);
    setEditListModelShow(true);
  };

  const handleEditResult = (data) => {
    setSelectResult(data);
    setResultEditModalShow(true);
  };

  const ISOReputation = resultsResearch.filter((item) =>
    item.typeResearch.includes("Bài báo ISI uy tín")
  );

  const internationalReputation = resultsResearch.filter((item) =>
    item.typeResearch.includes("Bài báo quốc tế uy tín")
  );

  const internationalOther = resultsResearch.filter((item) =>
    item.typeResearch.includes("Bài báo quốc tế khác")
  );

  const nationalConference = resultsResearch.filter((item) =>
    item.typeResearch.includes("Bài báo tại hội nghị quốc gia/quốc tế")
  );

  const magazineScience = resultsResearch.filter((item) =>
    item.typeResearch.includes(
      "Bài báo trên các tạp chí khoa học quốc gia uy tín"
    )
  );

  const other = resultsResearch.filter((item) =>
    item.typeResearch.includes(
      "Khác(Sách chuyên khảo, bằng sáng chế, giải thưởng khoa học)"
    )
  );

  return (
    <div style={{ padding: "0 15px" }}>
      <Helmet>
        <title>Hoạt động nghiên cứu</title>
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
          Hoạt động nghiên cứu
        </h3>
      </div>

      <div
        style={{
          height: "100vh",
          backgroundColor: "#fff",
          padding: "10px 20px",
        }}
      >
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
            <li className={cx("nav-item", "active")}>
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

        <div style={{ fontSize: "14px" }}>
          <ul className={cx("nav")}>
            <li className={cx("nav-item", activeNav === "" ? "active" : "")}>
              <Link
                to="#"
                className={cx("nav-link")}
                onClick={(e) => setActiveNav(e.target.href.slice(38))}
              >
                1. Hướng nghiên cứu chính
              </Link>
            </li>
            <li
              className={cx("nav-item", activeNav === "#link1" ? "active" : "")}
            >
              <Link
                to="#link1"
                className={cx("nav-link")}
                onClick={(e) => setActiveNav(e.target.href.slice(38))}
              >
                2. Danh sách đề tài/dự án nghiên cứu hoặc nộp hồ sơ
              </Link>
            </li>
            <li
              className={cx("nav-item", activeNav === "#link2" ? "active" : "")}
            >
              <Link
                to="#link2"
                className={cx("nav-link")}
                onClick={(e) => setActiveNav(e.target.href.slice(38))}
              >
                3. Kết quả nghiên cứu đã được công bố hoặc đăng ký
              </Link>
            </li>
          </ul>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px 5px",
          }}
        >
          <div style={{ border: "1px solid #0d6efd", borderRadius: "4px" }}>
            {activeNav === "" ? (
              <>
                <div className={cx("panel-heading")}>
                  <span className={cx("panel-title")}>
                    Hướng nghiên cứu chính
                  </span>
                </div>

                <div className={cx("panel-body")}>
                  <div className={cx("form-group", "content")}>
                    <div className={cx("item")}>
                      <label
                        htmlFor="research-vi"
                        className={cx("control-label", "col-sm-2")}
                      >
                        Tiếng Việt
                      </label>
                      <textarea
                        className={cx("form-control", "col-sm-12")}
                        style={{ height: "80px" }}
                        rows={4}
                        cols={50}
                        required
                        value={mainResearch ? mainResearch.vi : ""}
                        onChange={(e) =>
                          setMainResearch({
                            ...mainResearch,
                            vi: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                    <div className={cx("item")}>
                      <label
                        htmlFor="research-en"
                        className={cx("control-label", "col-sm-2")}
                      >
                        Tiếng Anh
                      </label>
                      <textarea
                        className={cx("form-control", "col-sm-12")}
                        style={{ height: "80px" }}
                        rows={4}
                        cols={50}
                        required
                        value={mainResearch ? mainResearch.en : ""}
                        onChange={(e) =>
                          setMainResearch({
                            ...mainResearch,
                            en: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center">
                    <button
                      className={cx("save-btn")}
                      onClick={handleSubmitMainResearch}
                    >
                      <FaSave style={{ marginRight: "4px" }} /> Lưu lại
                    </button>
                  </div>
                </div>
              </>
            ) : activeNav === "#link1" ? (
              <>
                <div className={cx("panel-heading")}>
                  <span className={cx("panel-title")}>
                    Danh sách đề tài/dự án nghiên cứu hoặc nộp hồ sơ
                  </span>

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
                        <td width="25%">
                          <b> Tên đề tài/dự án</b>
                        </td>
                        <td width="25%">
                          <b>Tên tổ chức tài trợ</b>
                        </td>
                        <td width="20%">
                          <b>Thời gian</b>
                          <br />
                          Bắt đầu - Kết thúc
                        </td>
                        <td width="15%">
                          <b>Vai trò</b>
                        </td>
                        <td width="10%">
                          <b>Thao tác</b>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {listTopics
                        ? listTopics.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.name.vi}</td>
                              <td>{item.sponsoringOrganization.vi}</td>
                              <td>
                                {item.time.begin} - {item.time.end}
                              </td>
                              <td>{item.role.vi}</td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <button
                                    className={cx("edit-btn")}
                                    onClick={() => handleEditListClick(item)}
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
              </>
            ) : activeNav === "#link2" ? (
              <>
                <div className={cx("panel-heading")}>
                  <span className={cx("panel-title")}>
                    Công bố công trình khoa học công nghệ trong nước và quốc tế
                  </span>

                  <button
                    className={cx("add-btn")}
                    onClick={() => setResultModelShow(true)}
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
                        <td width="30%">
                          <b> Tên công trình</b>
                        </td>
                        <td width="10%">
                          <b>Tên tác giả</b>
                        </td>
                        <td width="15%">
                          <b>Tên tạp chí NXB/Số, Tập, Trang đăng công trình</b>
                        </td>
                        <td width="10%">
                          <b>ISSN</b>
                          <br />
                          XXXX-XXXX
                        </td>
                        <td width="5%">
                          <b>Năm</b>
                        </td>
                        <td width="5%">
                          <b>Minh chứng(*)</b>
                        </td>
                        <td width="10%">
                          <b>Ghi chú</b>
                        </td>
                        <td width="5%">
                          <b>Sửa</b>
                        </td>
                        <td width="5%">
                          <b>Xoá</b>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <b>1</b>
                        </td>
                        <td colSpan={9} style={{ textAlign: "left" }}>
                          <b>Bài báo ISI</b>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>1.1</b>
                        </td>
                        <td colSpan={9} style={{ textAlign: "left" }}>
                          <b>Bài báo ISI uy tín</b>
                        </td>
                      </tr>

                      {ISOReputation.length > 0
                        ? ISOReputation.map((item, index) => (
                            <tr key={index}>
                              <td style={{ textAlign: "right" }}>
                                1.1.{index + 1}
                              </td>
                              <td>{item.name}</td>
                              <td>{item.author}</td>
                              <td>{item.magazineName}</td>
                              <td>{item.issn}</td>
                              <td>{item.year}</td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  className={cx("link-proof")}
                                  target="_blank"
                                >
                                  Đã có
                                </Link>
                              </td>
                              <td></td>
                              <td>
                                <span
                                  className={cx("link-edit")}
                                  onClick={() => handleEditResult(item)}
                                >
                                  Sửa
                                </span>
                              </td>
                              <td>
                                <span className={cx("link-delete")}>Xoá</span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td>
                          <b>1.2</b>
                        </td>
                        <td colSpan={9} style={{ textAlign: "left" }}>
                          <b>Bài báo ISI khác</b>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <b>2a</b>
                        </td>
                        <td colSpan={9} style={{ textAlign: "left" }}>
                          <b>Bài báo quốc tế uy tín</b>
                        </td>
                      </tr>

                      {internationalReputation.length > 0
                        ? internationalReputation.map((item, index) => (
                            <tr key={index}>
                              <td style={{ textAlign: "right" }}>
                                1.1.{index + 1}
                              </td>
                              <td>{item.name}</td>
                              <td>{item.author}</td>
                              <td>{item.magazineName}</td>
                              <td>{item.issn}</td>
                              <td>{item.year}</td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  className={cx("link-proof")}
                                >
                                  Đã có
                                </Link>
                              </td>
                              <td></td>
                              <td>
                                <span
                                  className={cx("link-edit")}
                                  onClick={() => handleEditResult(item)}
                                >
                                  Sửa
                                </span>
                              </td>
                              <td>
                                <span className={cx("link-delete")}>Xoá</span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <b>2b</b>
                        </td>
                        <td colSpan={9} style={{ textAlign: "left" }}>
                          <b>Bài báo quốc tế khác</b>
                        </td>
                      </tr>

                      {internationalOther.length > 0
                        ? internationalOther.map((item, index) => (
                            <tr key={index}>
                              <td style={{ textAlign: "right" }}>
                                1.1.{index + 1}
                              </td>
                              <td>{item.name}</td>
                              <td>{item.author}</td>
                              <td>{item.magazineName}</td>
                              <td>{item.issn}</td>
                              <td>{item.year}</td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  className={cx("link-proof")}
                                  target="_blank"
                                >
                                  Đã có
                                </Link>
                              </td>
                              <td></td>
                              <td>
                                <span
                                  className={cx("link-edit")}
                                  onClick={() => handleEditResult(item)}
                                >
                                  Sửa
                                </span>
                              </td>
                              <td>
                                <span className={cx("link-delete")}>Xoá</span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <b>3</b>
                        </td>
                        <td colSpan={9} style={{ textAlign: "left" }}>
                          <b>Báo cáo tại hội nghị quốc gia/quốc tế</b>
                        </td>
                      </tr>

                      {nationalConference.length > 0
                        ? nationalConference.map((item, index) => (
                            <tr key={index}>
                              <td style={{ textAlign: "right" }}>
                                1.1.{index + 1}
                              </td>
                              <td>{item.name}</td>
                              <td>{item.author}</td>
                              <td>{item.magazineName}</td>
                              <td>{item.issn}</td>
                              <td>{item.year}</td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  className={cx("link-proof")}
                                >
                                  Đã có
                                </Link>
                              </td>
                              <td></td>
                              <td>
                                <span
                                  className={cx("link-edit")}
                                  onClick={() => handleEditResult(item)}
                                >
                                  Sửa
                                </span>
                              </td>
                              <td>
                                <span className={cx("link-delete")}>Xoá</span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <b>4</b>
                        </td>
                        <td colSpan={9} style={{ textAlign: "left" }}>
                          <b>
                            Bài báo trên các tạp chí khoa học quốc gia uy tín
                          </b>
                        </td>
                      </tr>

                      {magazineScience.length > 0
                        ? magazineScience.map((item, index) => (
                            <tr key={index}>
                              <td style={{ textAlign: "right" }}>
                                1.1.{index + 1}
                              </td>
                              <td>{item.name}</td>
                              <td>{item.author}</td>
                              <td>{item.magazineName}</td>
                              <td>{item.issn}</td>
                              <td>{item.year}</td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  className={cx("link-proof")}
                                >
                                  Đã có
                                </Link>
                              </td>
                              <td></td>
                              <td>
                                <span
                                  className={cx("link-edit")}
                                  onClick={() => handleEditResult(item)}
                                >
                                  Sửa
                                </span>
                              </td>
                              <td>
                                <span className={cx("link-delete")}>Xoá</span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <b>5</b>
                        </td>
                        <td colSpan={9} style={{ textAlign: "left" }}>
                          <b>
                            Khác(Sách chuyên khảo, bằng sáng chế, giải thưởng
                            khoa học)
                          </b>
                        </td>
                      </tr>

                      {other.length > 0
                        ? other.map((item, index) => (
                            <tr key={index}>
                              <td style={{ textAlign: "right" }}>
                                1.1.{index + 1}
                              </td>
                              <td>{item.name}</td>
                              <td>{item.author}</td>
                              <td>{item.magazineName}</td>
                              <td>{item.issn}</td>
                              <td>{item.year}</td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  className={cx("link-proof")}
                                >
                                  Đã có
                                </Link>
                              </td>
                              <td></td>
                              <td>
                                <span
                                  className={cx("link-edit")}
                                  onClick={() => handleEditResult(item)}
                                >
                                  Sửa
                                </span>
                              </td>
                              <td>
                                <span className={cx("link-delete")}>Xoá</span>
                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <ListTopicModel show={modalShow} onHide={() => setModalShow(false)} />
      <EditListModel
        show={editListModelShow}
        onHide={() => setEditListModelShow(false)}
        editData={selectListResearch}
      />
      <ResultTopicModel
        show={resultModelShow}
        onHide={() => setResultModelShow(false)}
      />
      <EditResultModal
        show={resultEditModalShow}
        onHide={() => setResultEditModalShow(false)}
        editData={selectResult}
      />
    </div>
  );
};

export default ResearchProcessScreen;
