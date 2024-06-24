import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Styles from "./RegisterProgramScreen.module.scss";
import classNames from "classnames/bind";
import { FaSpinner } from "react-icons/fa";
import { Link, useParams, useSubmit } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { Store } from "../../Store";
import axios from "axios";
import { baseUrl } from "../../config";
import { getError } from "../../utils";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { saveAs } from "file-saver";
import { FaUpload } from "react-icons/fa";

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

const schools = [
  {
    name: "Trường Đại học Bách Khoa - Đại học Đà Nẵng",
    desc: {
      nameVi: "Trường Đại học Bách Khoa - Đại học Đà Nẵng",
      nameEn: "University of Science and Technology - The University of Danang",
      address: "54 Nguyễn Lương Bằng, Liên Chiểu",
      city: "Thành phố Đà Nẵng",
      email: "TQBANG@DUT.UDN.VN",
    },
  },
  {
    name: "Trường Đại học Kinh tế - Đại học Đà Nẵng",
    desc: {
      nameVi: "Trường Đại học Kinh tế - Đại học Đà Nẵng",
      nameEn: "University of Economics - The University of Danang",
      address: "71 Ngũ Hành Sơn, Phường Mỹ An, Quận Ngũ Hành Sơn",
      city: "Thành phố Đà Nẵng",
      email: "khoahoc@due.edu.vn",
    },
  },
];

function AddMemberViModel(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { id } = useParams();

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [dataSearch, setDataSearch] = useState([]);

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workingAgency, setWorkingAgency] = useState("");
  const [role, setRole] = useState("");
  const [monthOfTopic, setMonthOfTopic] = useState(0);
  const [scientificTitleVi, setScientificTitleVi] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-infor/get-users`,
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setUsers(data);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
    const searchData = users.filter((item) =>
      item?.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDataSearch(searchData);
  };

  const handleClick = (data) => {
    setUserId(data.userId);
    setScientificTitleVi(data.scientificTitleVi);
    setName(data.name);
    setEmail(data.email);
    setWorkingAgency(data.school.name);
    setDataSearch([]);
    setSearch(
      `${data.scientificTitleVi}. ${data.name} - ${data.email} - ${data.school.name}`
    );
  };

  const handleSubmit = async (e) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.post(
        `${baseUrl}/project/${id}/add-member`,
        {
          userId,
          name,
          email,
          workingAgency,
          role,
          monthOfTopic,
          scientificTitleVi,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      props.onHide();
      toast.success("Add member successfully");
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
        <span className={cx("model-title")}>DTVT</span>

        <button className={cx("close-btn")}>
          <img
            src="/assets/icon-close.png"
            alt="close-btn"
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div
          className={cx("form-border", "col-sm-12")}
          style={{ padding: "20px 0", fontSize: "14px" }}
        >
          <b>Thêm thành viên tham gia đề tài</b>
          <p style={{ color: "red" }}>
            Ghi chú: Gõ Id tài khoản (hoặc email hoặc tên) thành viên muốn thêm
            vào ô Tìm kiếm tài khoản để thêm thành viên, trong Trường hợp thành
            viên chưa có tài khoản, vui lòng thông báo cho thành viên tạo tài
            khoản, sau đó cung cấp thông tin để người thao tác thêm vào đề tài !
          </p>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Tìm kiếm tài khoản</b>
            <span style={{ color: "#FF0000" }}>*</span>:
          </label>
          <div className={cx("col-sm-6", "search-wrapper")}>
            <input
              type="search"
              className={cx("form-control")}
              placeholder="Nhập từ khoá tìm kiếm"
              value={search}
              onChange={handleChange}
            />
            <div
              className={cx(
                "select-result",
                dataSearch.length > 0
                  ? "show-select-result"
                  : "hide-select-result"
              )}
            >
              <ul className={cx("select-result__options")}>
                {dataSearch
                  ? dataSearch.map((item, index) => (
                      <li
                        className={cx("select-result__option")}
                        key={index}
                        onClick={() => handleClick(item)}
                      >
                        {item.scientificTitleVi}. {item.name} - {item.email} -{" "}
                        {item.school?.name}
                      </li>
                    ))
                  : ""}
              </ul>
            </div>
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Họ và tên
          </label>
          <div className="col-sm-6">
            <input
              readOnly
              type="text"
              className={cx("form-control")}
              value={name}
            />
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Địa chỉ email:
          </label>
          <div className="col-sm-6">
            <input
              readOnly
              type="text"
              className={cx("form-control")}
              value={email}
            />
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Cơ quan công tác:
          </label>
          <div className="col-sm-6">
            <input
              readOnly
              type="text"
              className={cx("form-control")}
              value={workingAgency}
            />
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Vai trò:
          </label>
          <div className="col-sm-6">
            <select
              className={cx("form-control")}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Thành viên nghiên cứu chủ chốt">
                Thành viên nghiên cứu chủ chốt
              </option>
              <option value="Thư ký khoa học">Thư ký khoa học</option>
              <option value="Thành viên">Thành viên</option>
              <option value="Nghiên cứu sinh">Nghiên cứu sinh</option>
              <option value="Kỹ thuật viên">Kỹ thuật viên</option>
            </select>
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Số tháng quy đổi cho việc làm đề tài:
          </label>
          <div className="col-sm-2">
            <input
              type="number"
              className={cx("form-control")}
              value={monthOfTopic}
              onChange={(e) => setMonthOfTopic(e.target.value)}
            />
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

function EditMemberViModel(props) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { id } = useParams();

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [dataSearch, setDataSearch] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [workingAgency, setWorkingAgency] = useState("");
  const [role, setRole] = useState("");
  const [monthOfTopic, setMonthOfTopic] = useState(0);
  const [scientificTitleVi, setScientificTitleVi] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-infor/get-users`,
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setUsers(data);
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (props.editData) {
      setName(props.editData.name || "");
      setEmail(props.editData.email || "");
      setWorkingAgency(props.editData.workingAgency || "");
      setRole(props.editData.role || "");
      setMonthOfTopic(props.editData.monthOfTopic || 0);
      setScientificTitleVi(props.editData.scientificTitleVi || "");
      setSearch(
        `${props.editData.scientificTitleVi}. ${props.editData.name} - ${props.editData.email} - ${props.editData?.school?.name}` ||
          ""
      );
    }
  }, [props.editData]);

  const handleChange = (e) => {
    setSearch(e.target.value);
    const searchData = users.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDataSearch(searchData);
  };

  const handleClick = (data) => {
    setScientificTitleVi(data.scientificTitleVi);
    setName(data.name);
    setEmail(data.email);
    setWorkingAgency(data.school.name);
    setDataSearch([]);
    setSearch(
      `${data.scientificTitleVi}. ${data.name} - ${data.email} - ${data.school.name}`
    );
  };

  const handleSubmit = async (e) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${baseUrl}/project/${id}/edit-member/${props.editData?._id}`,
        {
          name,
          email,
          workingAgency,
          role,
          monthOfTopic,
          scientificTitleVi,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      props.onHide();
      toast.success("Add member successfully");
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
        <span className={cx("model-title")}>DTVT</span>

        <button className={cx("close-btn")}>
          <img
            src="/assets/icon-close.png"
            alt="close-btn"
            style={{ width: "30px", height: "30px" }}
          />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div
          className={cx("form-border", "col-sm-12")}
          style={{ padding: "20px 0", fontSize: "14px" }}
        >
          <b>Thêm thành viên tham gia đề tài</b>
          <p style={{ color: "red" }}>
            Ghi chú: Gõ Id tài khoản (hoặc email hoặc tên) thành viên muốn thêm
            vào ô Tìm kiếm tài khoản để thêm thành viên, trong Trường hợp thành
            viên chưa có tài khoản, vui lòng thông báo cho thành viên tạo tài
            khoản, sau đó cung cấp thông tin để người thao tác thêm vào đề tài !
          </p>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            <b>Tìm kiếm tài khoản</b>
            <span style={{ color: "#FF0000" }}>*</span>:
          </label>
          <div className={cx("col-sm-6", "search-wrapper")}>
            <input
              type="search"
              className={cx("form-control")}
              placeholder="Nhập từ khoá tìm kiếm"
              value={search}
              onChange={handleChange}
            />
            <div
              className={cx(
                "select-result",
                dataSearch.length > 0
                  ? "show-select-result"
                  : "hide-select-result"
              )}
            >
              <ul className={cx("select-result__options")}>
                {dataSearch
                  ? dataSearch.map((item, index) => (
                      <li
                        className={cx("select-result__option")}
                        key={index}
                        onClick={() => handleClick(item)}
                      >
                        {item.scientificTitleVi}. {item.name} - {item.email} -{" "}
                        {item.school?.name}
                      </li>
                    ))
                  : ""}
              </ul>
            </div>
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Họ và tên
          </label>
          <div className="col-sm-6">
            <input
              readOnly
              type="text"
              className={cx("form-control")}
              value={name}
            />
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Địa chỉ email:
          </label>
          <div className="col-sm-6">
            <input
              readOnly
              type="text"
              className={cx("form-control")}
              value={email}
            />
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Cơ quan công tác:
          </label>
          <div className="col-sm-6">
            <input
              readOnly
              type="text"
              className={cx("form-control")}
              value={workingAgency}
            />
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Vai trò:
          </label>
          <div className="col-sm-6">
            <select
              className={cx("form-control")}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Thành viên nghiên cứu chủ chốt">
                Thành viên nghiên cứu chủ chốt
              </option>
              <option value="Thư ký khoa học">Thư ký khoa học</option>
              <option value="Thành viên">Thành viên</option>
              <option value="Nghiên cứu sinh">Nghiên cứu sinh</option>
              <option value="Kỹ thuật viên">Kỹ thuật viên</option>
            </select>
          </div>
        </div>

        <div className={cx("form-group", "form-border")}>
          <label
            className={cx("col-sm-4", "control-label")}
            style={{ textAlign: "right" }}
          >
            Số tháng quy đổi cho việc làm đề tài:
          </label>
          <div className="col-sm-2">
            <input
              type="number"
              className={cx("form-control")}
              value={monthOfTopic}
              onChange={(e) => setMonthOfTopic(e.target.value)}
            />
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

const RegisterProgramScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { id } = useParams();

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [editModelShow, setEditModelShow] = useState(false);
  const [selectEdit, setSelectEdit] = useState({});

  const [navActive, setNavActive] = useState("");
  const [school, setSchool] = useState({});
  const [addMemberVi, setAddMemberVi] = useState(false);

  const [dataInfor, setDataInfor] = useState({});
  const [dataExpectedResults, setDataExpectedResults] = useState({});
  const [dataMembers, setDataMembers] = useState([]);
  const [dataPresent, setDataPresent] = useState({});

  const [topicNameVi, setTopicNameVi] = useState("");
  const [topicNameEn, setTopicNameEn] = useState("");
  const [topicSummary, setTopicSummary] = useState("");
  const [topicType, setTopicType] = useState("");
  const [researchTime, setResearchTime] = useState(0);
  const [fundingSchool, setFundingSchool] = useState(0);
  const [fundingPersonal, setFundingPersonal] = useState(0);
  const [fundingFull, setFundingFull] = useState("");
  const [hostOrganization, setHostOrganization] = useState({
    organizationName: "",
    organizationNameEn: "",
    address: "",
    city: "",
    email: "",
    representative: "",
    position: "",
    phone: "",
  });

  const [train, setTrain] = useState({
    master: {
      total: 0,
      note: "",
    },
    PhD: {
      total: 0,
      note: "",
    },
  });

  const [projectAnnounced, setProjectAnnounced] = useState({
    ISOReputation: {
      total: 0,
      note: "",
    },
    internationalReputation: {
      total: 0,
      note: "",
    },
    internationalOther: {
      total: 0,
      note: "",
    },
    nationReputation: {
      total: 0,
      note: "",
    },
    nationalConference: {
      total: 0,
      note: "",
    },
    monographic: {
      total: 0,
      note: "",
    },
    other: {
      total: 0,
      note: "",
    },
  });

  const [presentVi, setPresentVi] = useState("");
  const [presentEn, setPresentEn] = useState("");
  const [fundingVi, setFundingVi] = useState("");
  const [fundingEn, setFundingEn] = useState("");

  const [status, setStatus] = useState("");
  const [reviewDay, setReviewDay] = useState("");
  const [topic, setTopic] = useState("");
  const [review, setReview] = useState([]);
  const [reviewMessage, setReviewMessage] = useState("");

  const handleChangeSchool = (e) => {
    const schoolSelect = schools.find(
      (item) => item.name === e.target.value
    ).desc;
    setSchool(schoolSelect);
    setHostOrganization({
      organizationName: e.target.value,
      organizationNameEn: schoolSelect.nameEn,
      address: schoolSelect.address,
      city: schoolSelect.city,
      email: schoolSelect.email,
    });
  };

  useEffect(() => {
    window.location.href.includes("link")
      ? setNavActive(window.location.href.slice(-5))
      : setNavActive("link0");
  }, [window.location.reload]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${baseUrl}/project/${id}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        setDataInfor(data[0].inforGeneral);
        setDataExpectedResults(data[0].expectedResult);
        setDataMembers(data[0].members);
        setDataPresent(data[0].present);
        setStatus(data[0].status);
        setTopic(data[0].topic);
        setReviewDay(data[0].reviewDay);
        setReview(data[0].reviews);
        data[0].inforGeneral?.topicType
          ? setTopicType(data[0].inforGeneral.topicType)
          : setTopicType("");
          data[0].inforGeneral?.fundingFull
          ? setFundingFull(data[0].inforGeneral.fundingFull)
          : setFundingFull("");
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [addMemberVi || editModelShow]);

  const submitHandlerInInfor = async (e) => {
    const topicNameVI = dataInfor?.topicNameVi
      ? dataInfor?.topicNameVi
      : topicNameVi;
    const topicNameEN = dataInfor?.topicNameEn
      ? dataInfor?.topicNameEn
      : topicNameEn;

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${baseUrl}/project/${id}/infor-general`,
        {
          topicNameVI,
          topicNameEN,
          topicSummary,
          topicType,
          researchTime,
          fundingSchool,
          fundingPersonal,
          fundingFull,
          hostOrganization,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Information updated successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const submitHandlerExpectedResult = async (e) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${baseUrl}/project/${id}/expected-results`,
        {
          train,
          projectAnnounced,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Information updated successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const submitHandlerPresent = async (e) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${baseUrl}/project/${id}/presents`,
        {
          presentVi,
          presentEn,
          fundingVi,
          fundingEn,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Information updated successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const handleEditClick = (data) => {
    setSelectEdit(data);
    setEditModelShow(true);
  };

  const handleDownload = () => {
    const fileContent = `
    <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            .container {
              width: 100%;
              max-width: 800px;
              margin: auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              color: #333;
            }
            .content {
              margin-top: 20px;
            }
            .field {
              margin-bottom: 15px;
            }
            .label {
              font-weight: bold;
              display: inline-block;
              width: 150px;
              color: #555;
            }
            .value {
              display: inline-block;
              border-bottom: 1px dashed #999;
              width: calc(100% - 160px);
              padding: 5px;
            }
            .textarea {
              border: 1px solid #ccc;
              border-radius: 5px;
              width: 100%;
              height: 100px;
              padding: 10px;
              box-sizing: border-box;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Đơn Đăng Ký Đề Tài</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Tên Đề Tài:</span>
                <span class="value">___________________________</span>
              </div>
              <div class="field">
                <span class="label">Người Thực Hiện:</span>
                <span class="value">___________________________</span>
              </div>
              <div class="field">
                <span class="label">Ngày Thực Hiện:</span>
                <span class="value">___________________________</span>
              </div>
              <div class="field">
                <span class="label">Mô Tả Đề Tài:</span>
                <div class="textarea">&nbsp;</div>
              </div>
              <div class="field">
                <span class="label">Mục Tiêu:</span>
                <div class="textarea">&nbsp;</div>
              </div>
              <div class="field">
                <span class="label">Phương Pháp Thực Hiện:</span>
                <div class="textarea">&nbsp;</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([fileContent], { type: "application/msword" });
    saveAs(blob, "don_dang_ky_de_tai.doc");
  };

  const uploadFilePresentVi = async (e) => {
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
      setPresentVi(data.url);
      toast.success("Pdf uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  const uploadFilePresentEn = async (e) => {
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
      setPresentEn(data.url);
      toast.success("Pdf uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  const uploadFileFundingVi = async (e) => {
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
      setFundingVi(data.url);
      toast.success("Pdf uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  const uploadFileFundingEn = async (e) => {
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
      setFundingEn(data.url);
      toast.success("Pdf uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  const fileInputPresentVi = useRef(null);
  const handleClickPresentVi = () => {
    fileInputPresentVi.current.click();
  };

  const fileInputPresentEn = useRef(null);
  const handleClickPresentEn = () => {
    fileInputPresentEn.current.click();
  };

  const fileInputFundingVi = useRef(null);
  const handleClickFundingVi = () => {
    fileInputFundingVi.current.click();
  };

  const fileInputFundingEn = useRef(null);
  const handleClickFundingEn = () => {
    fileInputFundingEn.current.click();
  };

  const handleSubmitProject = async (e) => {
    const status = "handle";
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${baseUrl}/project/${id}/update-status`,
        {
          status,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const handleAcceptTopic = async (e) => {
    const status = "accept";
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${baseUrl}/project/${id}/accept-topic`,
        {
          status,
          reviewDay,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  return (
    <div style={{ padding: "0 15px", minHeight: "100vh" }}>
      <Helmet>
        <title>Đăng ký đề tài</title>
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
          {topic === "school"
            ? "Đề tài cấp trường"
            : topic === "faculty"
            ? "Đề tài cấp khoa"
            : "Để tài khác"}
        </h3>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "25px",
        }}
      >
        <div className={cx("col-sm-12", "progressbar-wrapper")}>
          <ul className={cx("progressbar")}>
            <li className={cx(status === "propose" ? "active" : "")}>
              {status === "propose" ? (
                <FaSpinner
                  style={{ marginBottom: "4px", marginRight: "4px" }}
                />
              ) : (
                ""
              )}
              Đang chỉnh sửa
            </li>
            <li className={cx(status === "handle" ? "active" : "")}>
              {status === "handle" ? (
                <FaSpinner
                  style={{ marginBottom: "4px", marginRight: "4px" }}
                />
              ) : (
                ""
              )}
              Nộp đề tài (online)
            </li>
            <li className={cx(status === "accept" ? "active" : "")}>
              {status === "accept" ? (
                <FaSpinner
                  style={{ marginBottom: "4px", marginRight: "4px" }}
                />
              ) : (
                ""
              )}
              Xử lý đề tài
            </li>
            <li>Trả kết quả</li>
          </ul>
        </div>

        <div style={{ fontSize: "14px" }}>
          <ul className={cx("nav")}>
            <li
              className={cx("nav-item", navActive === "link0" ? "active" : "")}
            >
              <Link
                to="#"
                className={cx("nav-link")}
                onClick={() => setNavActive("link0")}
              >
                1. Thông tin chung
              </Link>
            </li>
            <li
              className={cx("nav-item", navActive === "link1" ? "active" : "")}
            >
              <Link
                to="#link1"
                className={cx("nav-link")}
                onClick={() => setNavActive("link1")}
              >
                2. Dự kiến kết quả
              </Link>
            </li>
            <li
              className={cx("nav-item", navActive === "link2" ? "active" : "")}
            >
              <Link
                to="#link2"
                className={cx("nav-link")}
                onClick={() => setNavActive("link2")}
              >
                3. Danh sách thành viên
              </Link>
            </li>
            <li
              className={cx("nav-item", navActive === "link3" ? "active" : "")}
            >
              <Link
                to="#link3"
                className={cx("nav-link")}
                onClick={() => setNavActive("link3")}
              >
                4. Thuyết minh và tài liệu
              </Link>
            </li>
            <li
              className={cx("nav-item", navActive === "link4" ? "active" : "")}
            >
              <Link
                to="#link4"
                className={cx("nav-link")}
                onClick={() => setNavActive("link4")}
              >
                5. Nộp đề tài
              </Link>
            </li>
          </ul>
        </div>

        <div className={cx("tab-content")}>
          {navActive === "link0" ? (
            <>
              <div className={cx("tab-box")}>
                <div className={cx("panel-heading")}>
                  <b style={{ paddingRight: "8px" }}>
                    {topic === "school"
                      ? "Đề tài cấp trường - Năm 2024"
                      : topic === "faculty"
                      ? "Đề tài cấp khoa - Năm 2024"
                      : "Đề tài khác - Năm 2024"}
                  </b>
                </div>

                <div className={cx("panel-body")}>
                  <div className={cx("form-group", "form-border")}>
                    <label className={cx("col-sm-2", "control-label")}>
                      <b>Tên đề tài </b>
                      (Tiếng Việt)
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        rows={3}
                        cols={20}
                        required
                        title="Không được để trống"
                        className={cx("form-control")}
                        style={{ height: "80px" }}
                        value={
                          dataInfor.topicNameVi
                            ? dataInfor.topicNameVi
                            : topicNameVi
                        }
                        onChange={(e) => setTopicNameVi(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={cx("form-group", "form-border")}>
                    <label className={cx("col-sm-2", "control-label")}>
                      <b>Tên đề tài </b>
                      (Tiếng Anh)
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        rows={3}
                        cols={20}
                        required
                        title="Không được để trống"
                        className={cx("form-control")}
                        style={{ height: "80px" }}
                        value={
                          dataInfor.topicNameEn
                            ? dataInfor.topicNameEn
                            : topicNameEn
                        }
                        onChange={(e) => setTopicNameEn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={cx("form-group", "form-border")}>
                    <label className={cx("col-sm-2", "control-label")}>
                      <b>Tóm tắt đề tài </b>
                      (Tiếng Việt)
                      <span style={{ color: "#FF0000" }}>*</span>:
                      <br />
                      <em>(300 - 400 từ)</em>
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        rows={3}
                        cols={20}
                        required
                        title="Không được để trống"
                        className={cx("form-control")}
                        style={{ height: "120px" }}
                        value={
                          dataInfor.topicSummary
                            ? dataInfor.topicSummary
                            : topicSummary
                        }
                        onChange={(e) => setTopicSummary(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={cx("form-group", "form-border")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Loại đề tài</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>

                    <div className="col-sm-8" style={{ marginLeft: "20px" }}>
                      <label className={cx("control-label")}>
                        <input
                          type="radio"
                          name="category"
                          onChange={(e) => setTopicType(e.target.value)}
                          checked={topicType === "Lý thuyết"}
                          value="Lý thuyết"
                          style={{ marginRight: "6px" }}
                        />
                        Lý thuyết
                      </label>

                      <label className={cx("control-label")}>
                        <input
                          type="radio"
                          name="category"
                          onChange={(e) => setTopicType(e.target.value)}
                          checked={topicType === "Thực nghiệm"}
                          value="Thực nghiệm"
                          style={{ marginRight: "6px" }}
                        />
                        Thực nghiệm
                      </label>

                      <label className={cx("control-label")}>
                        <input
                          type="radio"
                          name="category"
                          onChange={(e) => setTopicType(e.target.value)}
                          checked={topicType === "Đề tài mới"}
                          value="Đề tài mới"
                          style={{ marginRight: "6px" }}
                        />
                        Đề tài mới
                      </label>

                      <label className={cx("control-label")}>
                        <input
                          type="radio"
                          name="category"
                          onChange={(e) => setTopicType(e.target.value)}
                          checked={topicType === "Đề tài tiếp theo"}
                          value="Đề tài tiếp theo"
                          style={{ marginRight: "6px" }}
                        />
                        Đề tài tiếp theo
                      </label>
                    </div>
                  </div>

                  <div className={cx("form-group", "form-border")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Thời gian nghiên cứu</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-2">
                      <input
                        type="number"
                        required
                        title="Không được để trống"
                        className={cx("form-control")}
                        value={
                          dataInfor.researchTime
                            ? dataInfor.researchTime
                            : researchTime
                        }
                        onChange={(e) => setResearchTime(e.target.value)}
                      />
                    </div>
                    <p
                      className={cx("col-sm-2", "control-label")}
                      style={{ textAlign: "left", marginLeft: "20px" }}
                    >
                      (Tháng)
                    </p>
                  </div>

                  <div className={cx("form-group", "form-border")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      Kinh phí từ Trường
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-2">
                      <input
                        type="number"
                        required
                        title="Không được để trống"
                        className={cx("form-control")}
                        value={
                          dataInfor.fundingSchool
                            ? dataInfor.fundingFull
                            : fundingSchool
                        }
                        onChange={(e) => setFundingSchool(e.target.value)}
                      />
                    </div>
                    <p
                      className={cx("col-sm-2", "control-label")}
                      style={{ textAlign: "left", marginLeft: "20px" }}
                    >
                      (VNĐ)
                    </p>
                  </div>

                  <div className={cx("form-group", "form-border")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      Kinh phí từ cá nhân (nếu có):
                    </label>
                    <div className="col-sm-2">
                      <input
                        type="number"
                        className={cx("form-control")}
                        value={
                          dataInfor.fundingPersonal
                            ? dataInfor.fundingPersonal
                            : fundingPersonal
                        }
                        onChange={(e) => setFundingPersonal(e.target.value)}
                      />
                    </div>
                    <p
                      className={cx("col-sm-2", "control-label")}
                      style={{ textAlign: "left", marginLeft: "20px" }}
                    >
                      (VNĐ)
                    </p>
                  </div>

                  <div className={cx("form-group", "form-border")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Kinh phí khoán chi toàn phần</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-8" style={{ marginLeft: "20px" }}>
                      <label className={cx("control-label")}>
                        <input
                          type="radio"
                          name="selectType"
                          onChange={(e) => setFundingFull(e.target.value)}
                          checked={fundingFull === "Có"}
                          value="Có"
                          style={{ marginRight: "6px" }}
                        />
                        Có
                      </label>

                      <label className={cx("control-label")}>
                        <input
                          type="radio"
                          name="selectType"
                          onChange={(e) => setFundingFull(e.target.value)}
                          checked={fundingFull === "Không"}
                          value="Không"
                          style={{ marginRight: "6px" }}
                        />
                        Không
                      </label>
                    </div>
                  </div>

                  <div className={cx("form-group")}>
                    <label className={cx("control-label")}>
                      <b>Tổ chức chủ trì đề tài</b>
                    </label>
                  </div>

                  <div className={cx("form-group")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Tên tổ chức</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-6">
                      <select
                        className={cx("form-control")}
                        onChange={handleChangeSchool}
                        value={
                          dataInfor.hostOrganization
                            ? dataInfor.hostOrganization?.organizationName
                            : hostOrganization.organizationName
                        }
                      >
                        <option>Chọn</option>
                        {schools.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={cx("form-group")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Tên tổ chức chủ trì (Tiếng Anh)</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-6">
                      <input
                        readOnly
                        type="text"
                        className={cx("form-control")}
                        value={
                          dataInfor.hostOrganization
                            ? dataInfor.hostOrganization?.organizationNameEn
                            : school.nameEn
                        }
                      />
                    </div>
                  </div>

                  <div className={cx("form-group")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Địa chỉ</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-6">
                      <textarea
                        readOnly
                        type="text"
                        className={cx("form-control")}
                        style={{ height: "60px" }}
                        value={
                          dataInfor.hostOrganization
                            ? dataInfor.hostOrganization?.address
                            : school.address
                        }
                      />
                    </div>
                  </div>

                  <div className={cx("form-group")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Tỉnh/Thành phố</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-6">
                      <input
                        readOnly
                        type="text"
                        className={cx("form-control")}
                        value={
                          dataInfor.hostOrganization
                            ? dataInfor.hostOrganization?.city
                            : school.city
                        }
                      />
                    </div>
                  </div>

                  <div className={cx("form-group")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>E-mail</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-6">
                      <input
                        readOnly
                        type="text"
                        className={cx("form-control")}
                        value={
                          dataInfor.hostOrganization
                            ? dataInfor.hostOrganization?.email
                            : school.email
                        }
                      />
                    </div>
                  </div>

                  <div className={cx("form-group")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Người đại diện</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className={cx("form-control")}
                        value={
                          dataInfor.hostOrganization
                            ? dataInfor.hostOrganization.representative
                            : hostOrganization.representative
                        }
                        onChange={(e) =>
                          setHostOrganization({
                            ...hostOrganization,
                            representative: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className={cx("form-group")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Chức vụ</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className={cx("form-control")}
                        value={
                          dataInfor.hostOrganization
                            ? dataInfor.hostOrganization?.position
                            : hostOrganization.position
                        }
                        onChange={(e) =>
                          setHostOrganization({
                            ...hostOrganization,
                            position: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className={cx("form-group")}>
                    <label
                      className={cx("col-sm-4", "control-label")}
                      style={{ textAlign: "right" }}
                    >
                      <b>Số điện thoại</b>
                      <span style={{ color: "#FF0000" }}>*</span>:
                    </label>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className={cx("form-control")}
                        value={
                          dataInfor.hostOrganization
                            ? dataInfor.hostOrganization?.phone
                            : hostOrganization.phone
                        }
                        onChange={(e) =>
                          setHostOrganization({
                            ...hostOrganization,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {status === "propose" ? (
                    <div className={cx("form-group")}>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "100%" }}
                      >
                        <button
                          className={cx("save-btn")}
                          onClick={submitHandlerInInfor}
                        >
                          <FaSave style={{ marginRight: "4px" }} /> Lưu lại
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          ) : navActive === "link1" ? (
            <>
              <div className={cx("tab-box")} style={{ marginBottom: "20px" }}>
                <div className={cx("panel-heading")}>
                  <b style={{ paddingRight: "8px" }}>Dào tạo</b>
                </div>

                <div className={cx("panel-body")}>
                  <span className={cx("table-title")}>
                    <b>Danh sách kết quả đào tạo</b>
                  </span>
                  <table width="100%" style={{ marginTop: "10px" }}>
                    <tbody>
                      <tr>
                        <th
                          className="col-md-1"
                          style={{ textAlign: "center" }}
                        >
                          TT
                        </th>
                        <th
                          className="col-md-3"
                          style={{ textAlign: "center" }}
                        >
                          Kết quả đào tạo
                        </th>
                        <th
                          className="col-md-4"
                          style={{ textAlign: "center" }}
                        >
                          Số lượng
                        </th>
                        <th
                          className="col-md-4"
                          style={{ textAlign: "center" }}
                        >
                          <b>Ghi chú</b>
                        </th>
                      </tr>

                      <tr>
                        <td className={cx("border-td")}>1</td>
                        <td className={cx("border-td")}>Thạc sỹ</td>
                        <td className={cx("border-td")}>
                          <input
                            type="number"
                            className={cx("form-control")}
                            placeholder="0"
                            value={
                              dataExpectedResults?.train
                                ? dataExpectedResults.train.master.total
                                : train.master.total
                            }
                            onChange={(e) =>
                              setTrain({
                                ...train,
                                master: {
                                  ...train.master,
                                  total: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                        <td className={cx("border-td")}>
                          <textarea
                            rows={2}
                            cols={20}
                            className={cx("form-control")}
                            style={{ height: "60px" }}
                            value={
                              dataExpectedResults?.train
                                ? dataExpectedResults?.train.master.note
                                : train.master.note
                            }
                            onChange={(e) =>
                              setTrain({
                                ...train,
                                master: {
                                  ...train.master,
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className={cx("border-td")}>2</td>
                        <td className={cx("border-td")}>Tiến sĩ</td>
                        <td className={cx("border-td")}>
                          <input
                            type="number"
                            className={cx("form-control")}
                            placeholder="0"
                            value={
                              dataExpectedResults?.train
                                ? dataExpectedResults?.train.PhD.total
                                : train.PhD.total
                            }
                            onChange={(e) =>
                              setTrain({
                                ...train,
                                PhD: {
                                  ...train.PhD,
                                  total: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                        <td className={cx("border-td")}>
                          <textarea
                            rows={2}
                            cols={20}
                            className={cx("form-control")}
                            style={{ height: "60px" }}
                            value={
                              dataExpectedResults?.train
                                ? dataExpectedResults?.train.PhD.note
                                : train.PhD.note
                            }
                            onChange={(e) =>
                              setTrain({
                                ...train,
                                PhD: {
                                  ...train.PhD,
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={cx("tab-box")}>
                <div className={cx("panel-heading")}>
                  <b style={{ paddingRight: "8px" }}>Công trình công bố</b>
                </div>

                <div className={cx("panel-body")}>
                  <span className={cx("table-title")}>
                    <b>Danh sách kết quả công bố</b>
                  </span>
                  <table width="100%" style={{ marginTop: "10px" }}>
                    <tbody>
                      <tr>
                        <th
                          className="col-md-1"
                          style={{ textAlign: "center" }}
                        >
                          TT
                        </th>
                        <th
                          className="col-md-3"
                          style={{ textAlign: "center" }}
                        >
                          Kết quả công bố
                        </th>
                        <th
                          className="col-md-4"
                          style={{ textAlign: "center" }}
                        >
                          Số lượng công trình, bài viết công bố và đăng tải
                        </th>
                        <th
                          className="col-md-4"
                          style={{ textAlign: "center" }}
                        >
                          <b>Ghi chú</b>
                        </th>
                      </tr>

                      <tr>
                        <td className={cx("border-td")}>1</td>
                        <td className={cx("border-td")}>
                          Tạp chí ISI có uy tín
                        </td>
                        <td className={cx("border-td")}>
                          <input
                            type="number"
                            className={cx("form-control")}
                            placeholder="0"
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .ISOReputation.total
                                : projectAnnounced.ISOReputation.total
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                ISOReputation: {
                                  ...projectAnnounced.ISOReputation,
                                  total: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                        <td className={cx("border-td")}>
                          <textarea
                            rows={2}
                            cols={20}
                            className={cx("form-control")}
                            style={{ height: "60px" }}
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .ISOReputation.note
                                : projectAnnounced.ISOReputation.note
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                ISOReputation: {
                                  ...projectAnnounced.ISOReputation,
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className={cx("border-td")}>2</td>
                        <td className={cx("border-td")}>
                          Tạp chí quốc tế có uy tín
                        </td>
                        <td className={cx("border-td")}>
                          <input
                            type="number"
                            className={cx("form-control")}
                            placeholder="0"
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .internationalReputation.total
                                : projectAnnounced.internationalReputation.total
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                internationalReputation: {
                                  ...projectAnnounced.internationalReputation,
                                  total: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                        <td className={cx("border-td")}>
                          <textarea
                            rows={2}
                            cols={20}
                            className={cx("form-control")}
                            style={{ height: "60px" }}
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .internationalReputation.note
                                : projectAnnounced.internationalReputation.note
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                internationalReputation: {
                                  ...projectAnnounced.internationalReputation,
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className={cx("border-td")}>3</td>
                        <td className={cx("border-td")}>
                          Tạp chí quốc tế khác
                        </td>
                        <td className={cx("border-td")}>
                          <input
                            type="number"
                            className={cx("form-control")}
                            placeholder="0"
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .internationalOther.total
                                : projectAnnounced.internationalOther.total
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                internationalOther: {
                                  ...projectAnnounced.internationalOther,
                                  total: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                        <td className={cx("border-td")}>
                          <textarea
                            rows={2}
                            cols={20}
                            className={cx("form-control")}
                            style={{ height: "60px" }}
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .internationalOther.note
                                : projectAnnounced.internationalOther.note
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                internationalOther: {
                                  ...projectAnnounced.internationalOther,
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className={cx("border-td")}>4</td>
                        <td className={cx("border-td")}>
                          Tạp chí quốc gia có uy tín
                        </td>
                        <td className={cx("border-td")}>
                          <input
                            type="number"
                            className={cx("form-control")}
                            placeholder="0"
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .nationReputation.total
                                : projectAnnounced.nationReputation.total
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                nationReputation: {
                                  ...projectAnnounced.nationReputation,
                                  total: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                        <td className={cx("border-td")}>
                          <textarea
                            rows={2}
                            cols={20}
                            className={cx("form-control")}
                            style={{ height: "60px" }}
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .nationReputation.note
                                : projectAnnounced.nationReputation.note
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                nationReputation: {
                                  ...projectAnnounced.nationReputation,
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className={cx("border-td")}>5</td>
                        <td className={cx("border-td")}>
                          Hội nghị khoa học quốc tế, quốc gia
                        </td>
                        <td className={cx("border-td")}>
                          <input
                            type="number"
                            className={cx("form-control")}
                            placeholder="0"
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .nationalConference.total
                                : projectAnnounced.nationalConference.total
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                nationalConference: {
                                  ...projectAnnounced.nationalConference,
                                  total: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                        <td className={cx("border-td")}>
                          <textarea
                            rows={2}
                            cols={20}
                            className={cx("form-control")}
                            style={{ height: "60px" }}
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .nationalConference.note
                                : projectAnnounced.nationalConference.note
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                nationalConference: {
                                  ...projectAnnounced.nationalConference,
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className={cx("border-td")}>6</td>
                        <td className={cx("border-td")}>Sách chuyên khảo</td>
                        <td className={cx("border-td")}>
                          <input
                            type="number"
                            className={cx("form-control")}
                            placeholder="0"
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .monographic.total
                                : projectAnnounced.monographic.total
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                monographic: {
                                  ...projectAnnounced.monographic,
                                  total: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                        <td className={cx("border-td")}>
                          <textarea
                            rows={2}
                            cols={20}
                            className={cx("form-control")}
                            style={{ height: "60px" }}
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced
                                    .monographic.note
                                : projectAnnounced.monographic.note
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                monographic: {
                                  ...projectAnnounced.monographic,
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className={cx("border-td")}>7</td>
                        <td className={cx("border-td")}>Khác</td>
                        <td className={cx("border-td")}>
                          <input
                            type="number"
                            className={cx("form-control")}
                            placeholder="0"
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced.other
                                    .total
                                : projectAnnounced.other.total
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                other: {
                                  ...projectAnnounced.other,
                                  total: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                        <td className={cx("border-td")}>
                          <textarea
                            rows={2}
                            cols={20}
                            className={cx("form-control")}
                            style={{ height: "60px" }}
                            value={
                              dataExpectedResults?.projectAnnounced
                                ? dataExpectedResults?.projectAnnounced.other
                                    .note
                                : projectAnnounced.other.note
                            }
                            onChange={(e) =>
                              setProjectAnnounced({
                                ...projectAnnounced,
                                other: {
                                  ...projectAnnounced.other,
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {status === "propose" ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ width: "100%", padding: "20px" }}
                >
                  <button
                    className={cx("save-btn")}
                    onClick={submitHandlerExpectedResult}
                  >
                    <FaSave style={{ marginRight: "4px" }} /> Lưu lại
                  </button>
                </div>
              ) : (
                ""
              )}
            </>
          ) : navActive === "link2" ? (
            <>
              <div className={cx("tab-box")}>
                <div className={cx("panel-heading")}>
                  <b style={{ paddingRight: "8px" }}>
                    Danh sách thành viên tham gia nghiên cứu đề tài này
                  </b>
                </div>

                <div className={cx("panel-body")}>
                  <table className={cx("table", "table-border")}>
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f6" }}>
                        <td>
                          <b>STT</b>
                        </td>
                        <td>
                          <b>Họ và tên</b>
                        </td>
                        <td>
                          <b>Cơ quan công tác</b>
                        </td>
                        <td>
                          <b>Vai trò</b>
                        </td>
                        <td>
                          <b>Số tháng thực hiện</b>
                        </td>
                        <td>
                          <b>Lý lịch khoa học</b>
                        </td>
                        {status === "propose" ? (
                          <td>
                            <b>Thao tác</b>
                          </td>
                        ) : (
                          ""
                        )}
                      </tr>
                    </thead>
                    <thead>
                      <tr>
                        <td colSpan={8} style={{ textAlign: "left" }}>
                          <em>
                            <b>Danh sách thành viên</b>
                          </em>
                          {status === "propose" ? (
                            <button
                              className={cx("add-btn")}
                              onClick={() => setAddMemberVi(true)}
                            >
                              <MdAdd fontSize={15} />
                              Thêm thành viên
                            </button>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {dataMembers
                        ? dataMembers.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="d-flex flex-column">
                                <Link
                                  target="_blank"
                                  to="/"
                                  className={cx("link-profile")}
                                >
                                  {item.scientificTitleVi}. {item.name}
                                </Link>
                                <span>{item.email}</span>
                                <span>Id: {item.userId}</span>
                              </td>
                              <td>{item.workingAgency}</td>
                              <td>{item.role}</td>
                              <td>{item.monthOfTopic}</td>
                              <td>
                                <div className="d-flex flex-column">
                                  <button
                                    className={cx("add-btn")}
                                    style={{ marginBottom: "8px" }}
                                  >
                                    Tiếng Việt
                                  </button>
                                  <button className={cx("add-btn")}>
                                    Tiếng Anh
                                  </button>
                                </div>
                              </td>
                              {status === "propose" ? (
                                <td>
                                  <div className="d-flex flex-column">
                                    <button
                                      className={cx("edit-btn")}
                                      onClick={() => handleEditClick(item)}
                                    >
                                      <FaRegEdit
                                        style={{
                                          marginBottom: "2px",
                                          marginRight: "2px",
                                        }}
                                      />
                                      Sửa
                                    </button>
                                  </div>
                                </td>
                              ) : (
                                ""
                              )}
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>
              </div>
              <AddMemberViModel
                show={addMemberVi}
                onHide={() => setAddMemberVi(false)}
              />
              <EditMemberViModel
                show={editModelShow}
                onHide={() => setEditModelShow(false)}
                editData={selectEdit}
              />
            </>
          ) : navActive === "link3" ? (
            <>
              <div className={cx("tab-box")} style={{ marginBottom: "20px" }}>
                <div className={cx("panel-heading")}>
                  <b style={{ paddingRight: "8px" }}>Danh sách tài liệu</b>
                </div>

                <div className={cx("panel-body")}>
                  <div style={{ padding: "8px 0" }}>
                    <span style={{ color: "#999999", fontWeight: 600 }}>
                      Danh sách tài liệu liên quan
                    </span>
                  </div>
                  <table className={cx("table", "table-bordered2")}>
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f6" }}>
                        <td width="5%">
                          <b>STT</b>
                        </td>
                        <td width="45%">
                          <b>Tên tài liệu</b>
                        </td>
                        {status === "propose" ? <td width="25%"></td> : ""}
                        <td width="25%">
                          <b>Thao tác</b>
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>
                          <b>Đơn đăng ký đề tài</b>
                          <br />
                          <FaCheckCircle
                            color="green"
                            style={{ marginRight: "4px", marginBottom: "4px" }}
                          />
                          Mẫu tự động
                        </td>
                        {status === "propose" ? (
                          <td>
                            <div className="d-flex flex-row justify-content-center">
                              <button
                                className={cx("add-btn")}
                                onClick={handleDownload}
                              >
                                Tiếng Việt
                              </button>
                              <button className={cx("add-btn")}>
                                Tiếng Anh
                              </button>
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                        <td></td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>
                          <b>Thuyết minh đề tài (Tiếng Anh) </b>
                          <strong>
                            <span style={{ color: "red" }}>(*)</span>
                          </strong>
                          <br />
                          {dataPresent?.presentEn ? (
                            <>
                              <FaBan
                                color="green"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Tài liệu đã được tải lên
                            </>
                          ) : presentEn ? (
                            <>
                              <FaBan
                                color="green"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Tài liệu đã được tải lên
                            </>
                          ) : (
                            <>
                              <FaBan
                                color="red"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Chưa tải tài liệu lên
                            </>
                          )}
                        </td>
                        {status === "propose" ? (
                          <td>
                            <div className="d-flex flex-row justify-content-center">
                              <button
                                className={cx("add-btn")}
                                onClick={handleClickPresentEn}
                              >
                                Chọn file
                              </button>
                              <input
                                type="file"
                                ref={fileInputPresentEn}
                                style={{ display: "none" }}
                                onChange={uploadFilePresentEn}
                              />
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                        <td>
                          {dataPresent?.presentEn ? (
                            <>
                              <Link to={dataPresent.presentEn} target="_blank">
                                Tài liệu
                              </Link>
                            </>
                          ) : presentEn ? (
                            <>
                              <Link to={presentEn} target="_blank">
                                Tài liệu
                              </Link>
                            </>
                          ) : (
                            <>Chưa tải tài liệu lên</>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>
                          <b>Dự toán kinh phí (Tiếng Anh) </b>
                          <strong>
                            <span style={{ color: "red" }}>(*)</span>
                          </strong>
                          <br />
                          {dataPresent?.fundingEn ? (
                            <>
                              <FaBan
                                color="green"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Tài liệu đã được tải lên
                            </>
                          ) : fundingEn ? (
                            <>
                              <FaBan
                                color="green"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Tài liệu đã được tải lên
                            </>
                          ) : (
                            <>
                              <FaBan
                                color="red"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Chưa tải tài liệu lên
                            </>
                          )}
                        </td>
                        {status === "propose" ? (
                          <td>
                            <div className="d-flex flex-row justify-content-center">
                              <button
                                className={cx("add-btn")}
                                onClick={handleClickFundingEn}
                              >
                                Chọn file
                              </button>
                              <input
                                type="file"
                                ref={fileInputFundingEn}
                                style={{ display: "none" }}
                                onChange={uploadFileFundingEn}
                              />
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                        <td>
                          {dataPresent?.fundingEn ? (
                            <>
                              <Link to={dataPresent.fundingEn} target="_blank">
                                Tài liệu
                              </Link>
                            </>
                          ) : fundingEn ? (
                            <>
                              <Link to={fundingEn} target="_blank">
                                Tài liệu
                              </Link>
                            </>
                          ) : (
                            <>Chưa tải tài liệu lên</>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>
                          <b>Thuyết minh đề tài (Tiếng Việt) </b>
                          <strong>
                            <span style={{ color: "red" }}>(*)</span>
                          </strong>
                          <br />
                          {dataPresent?.presentVi ? (
                            <>
                              <FaBan
                                color="green"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Tài liệu đã được tải lên
                            </>
                          ) : presentVi ? (
                            <>
                              <FaBan
                                color="green"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Tài liệu đã được tải lên
                            </>
                          ) : (
                            <>
                              <FaBan
                                color="red"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Chưa tải tài liệu lên
                            </>
                          )}
                        </td>
                        {status === "propose" ? (
                          <td>
                            <div className="d-flex flex-row justify-content-center">
                              <button
                                className={cx("add-btn")}
                                onClick={handleClickPresentVi}
                              >
                                Chọn file
                              </button>
                              <input
                                type="file"
                                ref={fileInputPresentVi}
                                style={{ display: "none" }}
                                onChange={uploadFilePresentVi}
                              />
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                        <td>
                          {dataPresent?.presentVi ? (
                            <>
                              <Link to={dataPresent.presentVi} target="_blank">
                                Tài liệu
                              </Link>
                            </>
                          ) : presentVi ? (
                            <>
                              <Link to={presentVi} target="_blank">
                                Tài liệu
                              </Link>
                            </>
                          ) : (
                            <>Chưa tải tài liệu lên</>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>
                          <b>Dự toán kinh phí (Tiếng Việt) </b>
                          <strong>
                            <span style={{ color: "red" }}>(*)</span>
                          </strong>
                          <br />
                          {dataPresent?.fundingVi ? (
                            <>
                              <FaBan
                                color="green"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Tài liệu đã được tải lên
                            </>
                          ) : fundingVi ? (
                            <>
                              <FaBan
                                color="green"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Tài liệu đã được tải lên
                            </>
                          ) : (
                            <>
                              <FaBan
                                color="red"
                                style={{
                                  marginRight: "4px",
                                  marginBottom: "4px",
                                }}
                              />
                              Chưa tải tài liệu lên
                            </>
                          )}
                        </td>
                        {status === "propose" ? (
                          <td>
                            <div className="d-flex flex-row justify-content-center">
                              <button
                                className={cx("add-btn")}
                                onClick={handleClickFundingVi}
                              >
                                Chọn file
                              </button>
                              <input
                                type="file"
                                ref={fileInputFundingVi}
                                style={{ display: "none" }}
                                onChange={uploadFileFundingVi}
                              />
                            </div>
                          </td>
                        ) : (
                          ""
                        )}
                        <td>
                          {dataPresent?.fundingVi ? (
                            <>
                              <Link to={dataPresent.fundingVi} target="_blank">
                                Tài liệu
                              </Link>
                            </>
                          ) : fundingVi ? (
                            <>
                              <Link to={fundingVi} target="_blank">
                                Tài liệu
                              </Link>
                            </>
                          ) : (
                            <>Chưa tải tài liệu lên</>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {status === "propose" ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "100%", padding: "20px" }}
                  >
                    <button
                      className={cx("save-btn")}
                      onClick={submitHandlerPresent}
                    >
                      <FaSave style={{ marginRight: "4px" }} /> Lưu lại
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </>
          ) : navActive === "link4" ? (
            <>
              <div className={cx("tab-box")} style={{ marginBottom: "20px" }}>
                <div className={cx("panel-heading")}>
                  <b style={{ paddingRight: "8px" }}>A. Tình trạng Đề tài</b>
                </div>

                <div className={cx("panel-body")}>
                  <table width="100%" style={{ fontSize: "16px" }}>
                    <tbody>
                      <tr>
                        <td width="40%">
                          <label className={cx("control-label")}>
                            <b>Tên đề tài (Tiếng Việt)</b>
                          </label>
                        </td>
                        <td width="60%">{dataInfor.topicNameVi}</td>
                      </tr>
                      <tr>
                        <td width="40%">
                          <label className={cx("control-label")}>
                            <b>Đã nộp Đề tài online</b>
                          </label>
                        </td>
                        <td width="60%">
                          {status === "propose" ? "" : "Đã nộp"}
                        </td>
                      </tr>
                      <tr>
                        <td width="40%">
                          <label className={cx("control-label")}>
                            <b>ID</b>
                          </label>
                        </td>
                        <td width="60%">{id}</td>
                      </tr>
                      <tr>
                        <td width="40%">
                          <label className={cx("control-label")}>
                            <b>Mã đề tài</b>
                          </label>
                        </td>
                        <td width="60%">{dataInfor._id}</td>
                      </tr>
                      <tr>
                        <td width="40%">
                          <label className={cx("control-label")}>
                            <b>Trạng thái</b>
                          </label>
                        </td>
                        <td width="60%" style={{ color: "#0d6efd" }}>
                          {status === "propose"
                            ? "Đang chỉnh sửa"
                            : status === "handle"
                            ? "Đang chờ xử lý"
                            : "Đã xác nhận"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {status === "propose" ? (
                <div className={cx("tab-box")}>
                  <div className={cx("panel-heading")}>
                    <b style={{ paddingRight: "8px" }}>B. Nộp đề tài</b>
                  </div>
                  <div className={cx("form-group")}>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "100%" }}
                      >
                        <button
                          className={cx("save-btn")}
                          onClick={handleSubmitProject}
                        >
                          <FaUpload
                            style={{ marginRight: "4px", marginBottom: "4px" }}
                          />{" "}
                          Nộp Đề tài
                        </button>
                      </div>
                    </div>

                  {/* {dataInfor?.topicSummary &&
                  dataInfor?.topicType &&
                  dataInfor?.researchTime &&
                  dataInfor?.hostOrganization &&
                  dataExpectedResults?.train &&
                  dataExpectedResults?.projectAnnounced &&
                  dataPresent?.presentVi &&
                  dataPresent?.presentEn &&
                  dataPresent?.fundingVi &&
                  dataPresent?.fundingEn ? (
                    <div className={cx("panel-body")}>
                      <div className={cx("form-group")}>
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ width: "100%" }}
                        >
                          <button
                            className={cx("save-btn")}
                            onClick={submitHandlerInInfor}
                          >
                            <FaSave style={{ marginRight: "4px" }} /> Lưu lại
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={cx("panel-body")}>
                      <p>
                        <b>Đề tài không được nộp do:</b>
                      </p>
                      {dataInfor?.topicSummary ? (
                        ""
                      ) : (
                        <p>Không có Tóm tắt đề tài Tiếng Việt</p>
                      )}
                      {dataInfor?.topicType ? "" : <p>Không có loại đề tài</p>}
                      {dataInfor?.researchTime ? (
                        ""
                      ) : (
                        <p>Không có thời gian nghiên cứu đề tài</p>
                      )}
                      {dataInfor?.hostOrganization ? (
                        ""
                      ) : (
                        <p>Không có tổ chức chủ trì đề tài</p>
                      )}
                      {dataExpectedResults?.train ? (
                        ""
                      ) : (
                        <p>Không có kết quả đề tài</p>
                      )}
                      {dataExpectedResults?.projectAnnounced ? (
                        ""
                      ) : (
                        <p>Không có kết quả công bố</p>
                      )}
                      {dataPresent?.presentVi ? (
                        ""
                      ) : (
                        <p>Không có thuyết minh đề tài (Tiếng Việt)</p>
                      )}
                      {dataPresent?.presentEn ? (
                        ""
                      ) : (
                        <p>Không có thuyết minh đề tài (Tiếng Anh)</p>
                      )}
                      {dataPresent?.fundingVi ? (
                        ""
                      ) : (
                        <p>Không có dự toán kinh phí (Tiếng Việt)</p>
                      )}
                      {dataPresent?.fundingEn ? (
                        ""
                      ) : (
                        <p>Không có dự toán kinh phí (Tiếng Anh)</p>
                      )}
                      
                    <div className={cx("form-group")}>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "100%" }}
                      >
                        <button
                          className={cx("save-btn")}
                          disabled={true}
                          style={{opacity: 0.5}}
                        >
                          <FaUpload
                            style={{ marginRight: "4px", marginBottom: "4px" }}
                          />{" "}
                          Nộp Đề tài
                        </button>
                      </div>
                    </div>
                  

                    </div>
                  )} */}
                </div>
              ) : (
                // <div className={cx("panel-body")}>
                //     <div className={cx("form-group")}>
                //       <div
                //         className="d-flex justify-content-center align-items-center"
                //         style={{ width: "100%" }}
                //       >
                //         <button
                //           className={cx("save-btn")}
                //           onClick={handleSubmitProject}
                //         >
                //           <FaUpload
                //             style={{ marginRight: "4px", marginBottom: "4px" }}
                //           />{" "}
                //           Nộp Đề tài
                //         </button>
                //       </div>
                //     </div>
                //   </div>
                ""

              )}

              {status !== "propose" && userInfo.isAdmin ? (
                <div className={cx("tab-box")}>
                  <div className={cx("panel-heading")}>
                    <b style={{ paddingRight: "8px" }}>B. Xác nhận đề tài</b>
                  </div>

                  <div className={cx("panel-body")}>
                    <div className={cx("form-group")}>
                      <label
                        className={cx("col-sm-4", "control-label")}
                        style={{ textAlign: "right" }}
                      >
                        <b>Ngày bảo vệ đề tài </b>
                        <span style={{ color: "#FF0000" }}>*</span>:
                      </label>
                      <div className="col-sm-6">
                        <input
                          required
                          title="Không được để trống"
                          className={cx("form-control")}
                          value={reviewDay}
                          onChange={(e) => setReviewDay(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={cx("form-group")}>
                      <label
                        className={cx("col-sm-4", "control-label")}
                        style={{ textAlign: "right" }}
                      >
                        <b>Nhận xét</b>
                        <span style={{ color: "#FF0000" }}>*</span>:
                      </label>
                      <div className="col-sm-6">
                        <textarea
                          rows={3}
                          cols={20}
                          required
                          title="Không được để trống"
                          className={cx("form-control")}
                          style={{ height: "80px" }}
                          value={reviewMessage}
                          onChange={(e) => setReviewMessage(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={cx("form-group")}>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "100%" }}
                      >
                        <button
                          className={cx("save-btn")}
                          onClick={handleAcceptTopic}
                        >
                          <FaUpload
                            style={{ marginRight: "4px", marginBottom: "4px" }}
                          />{" "}
                          Nộp đề tài
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterProgramScreen;
