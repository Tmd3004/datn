import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import classNames from "classnames/bind";
import Styles from "./InformationScreen.module.scss";
import { Link } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../utils";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../config";
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

const sciences = [
  {
    name: "Toán học",
    majors: [
      {
        name: "Tối ưu và điều khiển hệ thống",
        code: "101.01",
      },
      {
        name: "Giải tích toán học",
        code: "101.02",
      },
      {
        name: "Xác suất và thống kê",
        code: "101.03",
      },
      {
        name: "Một số vấn đề chọn lọc trong đại số, lý thuyết số và tô pô hình học",
        code: "101.04",
      },
      {
        name: "Khác",
        code: "101.99",
      },
    ],
  },
  {
    name: "Khoa học thông tin và máy tính",
    majors: [
      {
        name: "Khoa học máy tính",
        code: "102.01",
      },
      {
        name: "Hệ thống mạng",
        code: "102.02",
      },
      {
        name: "Các vấn đề cơ bản của công nghệ phần mềm",
        code: "102.03",
      },
      {
        name: "Các hệ thống thông tin",
        code: "102.04",
      },
      {
        name: "Trí tuệ nhân tạo và phát hiện tri thức",
        code: "102.05",
      },
      {
        name: "Khác",
        code: "102.99",
      },
    ],
  },
  {
    name: "Vật lý",
    majors: [
      {
        name: "Vật lý lý thuyết và vật lý tính toán",
        code: "103.01",
      },
      {
        name: "Vật lý chất rắn",
        code: "103.02",
      },
      {
        name: "Quang học và Quang phổ",
        code: "103.03",
      },
      {
        name: "Vật lý hạt nhân",
        code: "103.04",
      },
      {
        name: "Vật lý tin học",
        code: "103.05",
      },
      {
        name: "Khác",
        code: "103.99",
      },
    ],
  },
  {
    name: "Hoá học",
    majors: [
      {
        name: "Hoá học hữu cơ",
        code: "104.01",
      },
      {
        name: "Hoá học cao phân tử",
        code: "104.02",
      },
      {
        name: "Hoá học vô cơ",
        code: "104.03",
      },
      {
        name: "Hoá học phân tích",
        code: "104.04",
      },
      {
        name: "Hấp thụ và xúc tác",
        code: "104.05",
      },
      {
        name: "Hoá học lý thuyết và hoá lý",
        code: "104.06",
      },
      {
        name: "Khác",
        code: "104.99",
      },
    ],
  },
  {
    name: "Cơ học",
    majors: [
      {
        name: "Cơ học định hướng ứng dụng",
        code: "105.01",
      },
      {
        name: "Cơ học vật rắn biến dạng",
        code: "105.02",
      },
      {
        name: "Cơ học chất lỏng và chất khí",
        code: "105.03",
      },
      {
        name: "Cơ học hệ nhiều vật",
        code: "105.04",
      },
      {
        name: "Khác",
        code: "105.99",
      },
    ],
  },
];

const schools = [
  {
    name: "Trường Đại học Bách Khoa - Đại học Đà Nẵng",
    desc: {
      nameVi: "Trường Đại học Bách Khoa - Đại học Đà Nẵng",
      nameEn: "University of Science and Technology - The University of Danang",
      address: "54 Nguyễn Lương Bằng, Liên Chiểu",
      city: "Thành phố Đà Nẵng",
    },
  },
  {
    name: "Trường Đại học Kinh tế - Đại học Đà Nẵng",
    desc: {
      nameVi: "Trường Đại học Kinh tế - Đại học Đà Nẵng",
      nameEn: "University of Economics - The University of Danang",
      address: "71 Ngũ Hành Sơn, Phường Mỹ An, Quận Ngũ Hành Sơn",
      city: "Thành phố Đà Nẵng",
    },
  },
];

const InformationScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [majors, setMajors] = useState([]);
  const [code, setCode] = useState("");
  const [majors2, setMajors2] = useState([]);
  const [code2, setCode2] = useState("");
  const [majors3, setMajors3] = useState([]);
  const [code3, setCode3] = useState("");
  const [school, setSchool] = useState({});

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [scientificTitleVi, setScientificTitleVi] = useState("");
  const [scientificTitleEn, setScientificTitleEn] = useState("");
  const [citizenIdentification, setCitizenIdentification] = useState("");
  const [administrativePositionEn, setAdministrativePositionEn] = useState("");
  const [administrativePositionVi, setAdministrativePositionVi] = useState("");
  const [phone, setPhone] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [bank, setBank] = useState("");
  const [fax, setFax] = useState("");
  const [account, setAccount] = useState("");
  const [tax, setTax] = useState("");
  const [train, setTrain] = useState({
    science: "",
    major: "",
    code: "",
  });
  const [train2, setTrain2] = useState({
    science: "",
    major: "",
    code: "",
  });
  const [train3, setTrain3] = useState({
    science: "",
    major: "",
    code: "",
  });
  const [schoolAddress, setSchoolAddress] = useState({
    name: "",
    nameVi: "",
    nameEn: "",
    address: "",
    city: "",
    department: "",
  });
  const [english, setEnglish] = useState({
    read: "",
    write: "",
    speak: "",
  });
  const [languageOther, setLanguageOther] = useState({
    name: "",
    read: "",
    write: "",
    speak: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-infor/${userInfo._id}`, {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setImage(data.image);
        setName(data.name);
        setDateOfBirth(data.dateOfBirth);
        setEmail(data.email);
        setGender(data.gender);
        setScientificTitleVi(data.scientificTitleVi);
        setScientificTitleEn(data.scientificTitleEn);
        setCitizenIdentification(data.citizenIdentification);
        setAdministrativePositionEn(data.administrativePositionEn);
        setAdministrativePositionVi(data.administrativePositionVi);
        setPhone(data.phone);
        setOfficePhone(data.officePhone);
        setSecondaryEmail(data.secondaryEmail);
        setBranch(data.branch);
        setBank(data.bank);
        setFax(data.fax);
        setAccount(data.account);
        setTax(data.tax);
        setTrain(data.train);
        setTrain2(data.train2);
        setTrain3(data.train3);
        setSchoolAddress(data.school);
        setEnglish(data.english);
        setLanguageOther(data.languageOther);
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

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${baseUrl}/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      setImage(data.secure_url);
      toast.success("Image uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };

  const submitHandler = async (e) => {
    const nameUser = name ? name : userInfo.name;
    const emailUser = email ? email : userInfo.email;
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${baseUrl}/users/update-infor/${userInfo._id}`,
        {
          image,
          nameUser,
          dateOfBirth,
          emailUser,
          gender,
          scientificTitleVi,
          scientificTitleEn,
          citizenIdentification,
          administrativePositionEn,
          administrativePositionVi,
          phone,
          officePhone,
          secondaryEmail,
          branch,
          bank,
          fax,
          account,
          tax,
          train,
          train2,
          train3,
          schoolAddress,
          english,
          languageOther,
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

  const handleChangeScience = (e) => {
    setMajors(sciences.find((item) => item.name === e.target.value).majors);
    setTrain({
      ...train,
      science: e.target.value,
    });
  };

  const handleChangeScience2 = (e) => {
    setMajors2(sciences.find((item) => item.name === e.target.value).majors);
    setTrain2({
      ...train2,
      science: e.target.value,
    });
  };
  const handleChangeScience3 = (e) => {
    setMajors3(sciences.find((item) => item.name === e.target.value).majors);
    setTrain3({
      ...train3,
      science: e.target.value,
    });
  };

  const handleChangeMajor = (e) => {
    setCode(
      majors.length > 0
        ? majors.find((item) => item.name === e.target.value).code
        : ""
    );
    setTrain({
      ...train,
      major: e.target.value,
      code: majors.find((item) => item.name === e.target.value).code,
    });
  };

  const handleChangeMajor2 = (e) => {
    setCode2(
      majors2.length > 0
        ? majors2.find((item) => item.name === e.target.value).code
        : ""
    );
    setTrain2({
      ...train2,
      major: e.target.value,
      code: majors2.find((item) => item.name === e.target.value).code,
    });
  };

  const handleChangeMajor3 = (e) => {
    setCode3(
      majors3.length > 0
        ? majors3.find((item) => item.name === e.target.value).code
        : ""
    );
    setTrain3({
      ...train3,
      major: e.target.value,
      code: majors3.find((item) => item.name === e.target.value).code,
    });
  };

  const handleChangeSchool = (e) => {
    const schoolSelect = schools.find(
      (item) => item.name === e.target.value
    ).desc;
    setSchool(schoolSelect);
    setSchoolAddress({
      name: e.target.value,
      nameVi: schoolSelect.nameVi,
      nameEn: schoolSelect.nameEn,
      address: schoolSelect.address,
      city: schoolSelect.city,
    });
  };

  const fileInputRef = useRef(null);
  const handleButtonClickImage = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ padding: "0 15px" }}>
      <Helmet>
        <title>Thông tin cá nhân</title>
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
            <li className={cx("nav-item", "active")}>
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
          <div
            style={{
              color: "#fff",
              backgroundColor: "#0d6efd",
              padding: "10px 20px",
              width: "100%",
            }}
          >
            <span>Thông tin cá nhân</span>
          </div>
          <div className="d-flex" style={{ padding: "10px 20px" }}>
            <div
              className="d-flex flex-column"
              style={{
                marginRight: "20px",
                width: "25%",
                maxHeight: "300px",
                borderRadius: "4px",
                boxShadow: "0 0.15rem 1.75rem 0 rgb(33 40 50 / 15%)",
              }}
            >
              <div className={cx("card-header")}>
                <span>Avatar</span>
              </div>
              <div className={cx("card-body")}>
                <div>
                  <img
                    src={image ? image : "/assets/user.png"}
                    alt="avatar"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
                <button
                  className={cx("card-body-button")}
                  onClick={handleButtonClickImage}
                >
                  Select image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={uploadFileHandler}
                />
                <span className={cx("card-body-name")}>
                  {name ? name : userInfo.name}
                </span>
                <span className={cx("card-body-email")}>
                  {email ? email : userInfo.email}
                </span>
              </div>
            </div>

            <div
              className="d-flex flex-column"
              style={{
                width: "75%",
                borderRadius: "4px",
                boxShadow: "0 0.15rem 1.75rem 0 rgb(33 40 50 / 15%)",
              }}
            >
              <div className={cx("card-header")}>
                <span>Thông tin chi tiết</span>
              </div>
              <div className={cx("card-body")}>
                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="name" className={cx("control-label")}>
                        Họ và tên<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        className={cx("form-control")}
                        required
                        value={name ? name : userInfo.name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label
                        htmlFor="dateOfBirth"
                        className={cx("control-label")}
                      >
                        Ngày sinh<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="dateOfBirth"
                        className={cx("form-control")}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label className={cx("control-label")}>
                        Giới tính<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <select
                        type="text"
                        className={cx("form-control")}
                        required
                        onChange={(e) => setGender(e.target.value)}
                        value={gender}
                      >
                        <option value="">Chọn</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label className={cx("control-label")}>
                        Chức danh khoa học (VI)
                        <span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <select
                        type="text"
                        className={cx("form-control")}
                        required
                        value={scientificTitleVi}
                        onChange={(e) => setScientificTitleVi(e.target.value)}
                      >
                        <option value="">Chọn</option>
                        <option value="GS">GS</option>
                        <option value="GS.TS">GS.TS</option>
                        <option value="GS.TS">GS.TS</option>
                        <option value="GS.TSKH">GS.TSKH</option>
                        <option value="PSG">PSG</option>
                        <option value="PGS.TS">PGS.TS</option>
                        <option value="PGS.TSKH">PGS.TSKH</option>
                        <option value="TS">TS</option>
                        <option value="TSKH">TSKH</option>
                        <option value="NCS">NCS</option>
                        <option value="ThS">ThS</option>
                        <option value="KS">KS</option>
                        <option value="CN">CN</option>
                        <option value="BS">BS</option>
                        <option value="DS">DS</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label
                        htmlFor="scientific-title"
                        className={cx("control-label")}
                      >
                        Chức danh khoa học (EN)
                        <span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="scientific-title"
                        className={cx("form-control")}
                        required
                        value={scientificTitleEn}
                        onChange={(e) =>
                          setScientificTitleEn(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label
                        htmlFor="citizen-identification"
                        className={cx("control-label")}
                      >
                        Số CMND/CCCD<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="citizen-identification"
                        className={cx("form-control")}
                        required
                        value={citizenIdentification}
                        onChange={(e) =>
                          setCitizenIdentification(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label
                        htmlFor="administrative-position-vi"
                        className={cx("control-label")}
                      >
                        Chức vụ hành chính (VI)
                      </label>
                      <input
                        type="text"
                        id="administrative-position-vi"
                        className={cx("form-control")}
                        required
                        value={administrativePositionVi}
                        onChange={(e) =>
                          setAdministrativePositionVi(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label
                        htmlFor="administrative-position-en"
                        className={cx("control-label")}
                      >
                        Chức vụ hành chính (EN)
                      </label>
                      <input
                        type="text"
                        id="administrative-position-en"
                        className={cx("form-control")}
                        required
                        value={administrativePositionEn}
                        onChange={(e) =>
                          setAdministrativePositionEn(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="email" className={cx("control-label")}>
                        Email chính (Email đăng nhập)
                        <span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        className={cx("form-control")}
                        required
                        value={email ? email : userInfo.email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="phone" className={cx("control-label")}>
                        Số điện thoại di động
                        <span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="phone"
                        className={cx("form-control")}
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label
                        htmlFor="office-phone"
                        className={cx("control-label")}
                      >
                        Số điện thoại cơ quan
                      </label>
                      <input
                        type="text"
                        id="office-phone"
                        className={cx("form-control")}
                        required
                        value={officePhone}
                        onChange={(e) => setOfficePhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label
                        htmlFor="secondary-email"
                        className={cx("control-label")}
                      >
                        Email phụ
                      </label>
                      <input
                        type="secondary-email"
                        id="email"
                        className={cx("form-control")}
                        required
                        value={secondaryEmail}
                        onChange={(e) => setSecondaryEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="account" className={cx("control-label")}>
                        Số tài khoản
                      </label>
                      <input
                        type="text"
                        id="account"
                        className={cx("form-control")}
                        required
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="bank" className={cx("control-label")}>
                        Mở tại ngân hàng
                      </label>
                      <input
                        type="text"
                        id="bank"
                        className={cx("form-control")}
                        required
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="fax" className={cx("control-label")}>
                        Fax
                      </label>
                      <input
                        type="fax"
                        id="text"
                        className={cx("form-control")}
                        required
                        value={fax}
                        onChange={(e) => setFax(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="branch" className={cx("control-label")}>
                        Tên chi nhánh
                      </label>
                      <input
                        type="text"
                        id="branch"
                        className={cx("form-control")}
                        required
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="tax" className={cx("control-label")}>
                        Mã số thuế
                      </label>
                      <input
                        type="text"
                        id="tax"
                        className={cx("form-control")}
                        required
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "40px" }}>
                  <hr />
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-5">
                    <div className="d-flex flex-column flex-wrap">
                      <label className={cx("control-label")}>
                        Ngành khoa học
                        <span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <select
                        className={cx("form-control")}
                        style={{ width: "100%" }}
                        onChange={handleChangeScience}
                        value={train ? train.science : ""}
                      >
                        <option value="">Chọn</option>
                        {sciences.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-5">
                    <div className="d-flex flex-column flex-wrap">
                      <label className={cx("control-label")}>
                        Chọn chuyên ngành khoa học chính
                        <span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <select
                        className={cx("form-control")}
                        style={{ width: "100%" }}
                        value={train ? train.major : ""}
                        onChange={handleChangeMajor}
                      >
                        <option value="">Chọn</option>
                        {majors.length > 0 ? (
                          majors.map((item, index) => (
                            <option key={index} value={item.name}>
                              {item.name}
                            </option>
                          ))
                        ) : train ? (
                          <option value={train.major}>{train.major}</option>
                        ) : (
                          ""
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-2">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="code" className={cx("control-label")}>
                        Mã số<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="code"
                        className={cx("form-control")}
                        style={{ width: "100%" }}
                        readOnly
                        value={train ? train.code : code}
                      />
                    </div>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-5">
                    <div className="d-flex flex-column flex-wrap">
                      <label className={cx("control-label")}>
                        Ngành khoa học 2
                      </label>
                      <select
                        className={cx("form-control")}
                        style={{ width: "100%" }}
                        onChange={handleChangeScience2}
                        value={train2 ? train2.science : ""}
                      >
                        <option value="">Chọn</option>
                        {sciences.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-5">
                    <div className="d-flex flex-column flex-wrap">
                      <label className={cx("control-label")}>
                        Chọn chuyên ngành khoa học chính 2
                      </label>
                      <select
                        className={cx("form-control")}
                        style={{ width: "100%" }}
                        onChange={handleChangeMajor2}
                        value={train2 ? train2.major : ""}
                      >
                        <option value="">Chọn</option>
                        {majors2.length > 0 ? (
                          majors2.map((item, index) => (
                            <option key={index} value={item.name}>
                              {item.name}
                            </option>
                          ))
                        ) : train2 ? (
                          <option value={train2.major}>{train2.major}</option>
                        ) : (
                          ""
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-2">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="code2" className={cx("control-label")}>
                        Mã số<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="code2"
                        className={cx("form-control")}
                        style={{ width: "100%" }}
                        readOnly
                        value={train2 ? train2.code : code2}
                      />
                    </div>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-5">
                    <div className="d-flex flex-column flex-wrap">
                      <label className={cx("control-label")}>
                        Ngành khoa học 3
                      </label>
                      <select
                        className={cx("form-control")}
                        style={{ width: "100%" }}
                        onChange={handleChangeScience3}
                        value={train3 ? train3.science : ""}
                      >
                        <option>Chọn</option>
                        {sciences.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-5">
                    <div className="d-flex flex-column flex-wrap">
                      <label className={cx("control-label")}>
                        Chọn chuyên ngành khoa học chính 3
                      </label>
                      <select
                        className={cx("form-control")}
                        style={{ width: "100%" }}
                        onChange={handleChangeMajor3}
                        value={train3 ? train3.major : ""}
                      >
                        <option>Chọn</option>
                        {majors3.length > 0 ? (
                          majors3.map((item, index) => (
                            <option key={index} value={item.name}>
                              {item.name}
                            </option>
                          ))
                        ) : train3 ? (
                          <option value={train3.major}>{train3.major}</option>
                        ) : (
                          ""
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-2">
                    <div className="d-flex flex-column flex-wrap">
                      <label htmlFor="code3" className={cx("control-label")}>
                        Mã số<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="code3"
                        className={cx("form-control")}
                        style={{ width: "100%" }}
                        readOnly
                        value={train3 ? train3.code : code3}
                      />
                    </div>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "40px" }}>
                  <hr />
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "15px" }}>
                  <div className="d-flex flex-row">
                    <label
                      className={cx(
                        "col-sm-3",
                        "d-flex justify-content-center align-items-center",
                        "control-label"
                      )}
                    >
                      Chọn cơ quan<span style={{ color: "#FF0000" }}>*</span>
                    </label>
                    <select
                      className={cx("form-control")}
                      style={{ width: "100%" }}
                      onChange={handleChangeSchool}
                      value={schoolAddress ? schoolAddress.name : school.name}
                    >
                      <option value="">Chọn</option>
                      {schools.map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "15px" }}>
                  <div className="d-flex flex-row">
                    <label
                      htmlFor="office-name-vi"
                      className={cx(
                        "col-sm-3",
                        "d-flex justify-content-center align-items-center",
                        "control-label"
                      )}
                    >
                      Tên cơ quan (VI)
                      <span style={{ color: "#FF0000" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="office-name-vi"
                      className={cx("form-control")}
                      style={{ width: "100%" }}
                      value={
                        schoolAddress ? schoolAddress.nameVi : school.nameVi
                      }
                      required
                    />
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "15px" }}>
                  <div className="d-flex flex-row">
                    <label
                      htmlFor="office-name-en"
                      className={cx(
                        "col-sm-3",
                        "d-flex justify-content-center align-items-center",
                        "control-label"
                      )}
                    >
                      Tên cơ quan (EN)
                      <span style={{ color: "#FF0000" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="office-name-en"
                      className={cx("form-control")}
                      style={{ width: "100%" }}
                      value={
                        schoolAddress ? schoolAddress.nameEn : school.nameEn
                      }
                      required
                    />
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "15px" }}>
                  <div className="d-flex flex-row">
                    <label
                      htmlFor="address"
                      className={cx(
                        "col-sm-3",
                        "d-flex justify-content-center align-items-center",
                        "control-label"
                      )}
                    >
                      Địa chỉ
                      <span style={{ color: "#FF0000" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      className={cx("form-control")}
                      style={{ width: "100%" }}
                      value={
                        schoolAddress ? schoolAddress.address : school.address
                      }
                      required
                    />
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "15px" }}>
                  <div className="d-flex flex-row">
                    <label
                      htmlFor="city"
                      className={cx(
                        "col-sm-3",
                        "d-flex justify-content-center align-items-center",
                        "control-label"
                      )}
                    >
                      Tỉnh/Thành phố
                      <span style={{ color: "#FF0000" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      className={cx("form-control")}
                      style={{ width: "100%" }}
                      value={schoolAddress ? schoolAddress.city : school.city}
                      required
                    />
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "15px" }}>
                  <div className="d-flex flex-row">
                    <label
                      htmlFor="department"
                      className={cx(
                        "col-sm-3",
                        "d-flex justify-content-center align-items-center",
                        "control-label"
                      )}
                    >
                      Tên phòng ban
                      <span style={{ color: "#FF0000" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="department"
                      className={cx("form-control")}
                      style={{ width: "100%" }}
                      required
                      value={schoolAddress ? schoolAddress.department : ""}
                      onChange={(e) =>
                        setSchoolAddress({
                          ...schoolAddress,
                          department: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "40px" }}>
                  <hr />
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "10px" }}>
                  <div className="col-sm-3 d-flex align-items-center">
                    <label className={cx("control-label")}>
                      <b>Trình độ Tiếng Anh</b>
                    </label>
                  </div>

                  <div className="col-sm-3">
                    <div className="d-flex flex-row align-items-center">
                      <label className={cx("control-label")}>
                        Đọc<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <select
                        type="text"
                        id="name"
                        className={cx("form-control")}
                        required
                        value={english ? english.read : ""}
                        onChange={(e) =>
                          setEnglish({ ...english, read: e.target.value })
                        }
                      >
                        <option value="">Chọn</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-3">
                    <div className="d-flex flex-row align-items-center">
                      <label className={cx("control-label")}>
                        Viết<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <select
                        type="text"
                        id="name"
                        className={cx("form-control")}
                        required
                        value={english ? english.write : ""}
                        onChange={(e) =>
                          setEnglish({ ...english, write: e.target.value })
                        }
                      >
                        <option value="">Chọn</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-3">
                    <div className="d-flex flex-row align-items-center">
                      <label className={cx("control-label")}>
                        Nói<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <select
                        type="text"
                        id="name"
                        className={cx("form-control")}
                        required
                        value={english ? english.speak : ""}
                        onChange={(e) =>
                          setEnglish({ ...english, speak: e.target.value })
                        }
                      >
                        <option value="">Chọn</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  className="row col-sm-12 align-items-end"
                  style={{ paddingTop: "10px" }}
                >
                  <div className="col-sm-3">
                    <div className="d-flex flex-column">
                      <label
                        htmlFor="name"
                        className={cx("control-label")}
                        style={{ paddingBottom: "8px" }}
                      >
                        <b>Ngoại ngữ khác</b>
                      </label>
                      <select
                        type="text"
                        id="name"
                        className={cx("form-control")}
                        required
                        value={languageOther ? languageOther.name : ""}
                        onChange={(e) =>
                          setLanguageOther({
                            ...languageOther,
                            name: e.target.value,
                          })
                        }
                      >
                        <option>Chọn</option>
                        <option value="Tiếng Trung">Tiếng Trung</option>
                        <option value="Tiếng Nhật">Tiếng Nhật</option>
                        <option value="Tiếng Hàn">Tiếng Hàn</option>
                        <option value="Tiếng Đức">Tiếng Đức</option>
                        <option value="Tiếng Pháp">Tiếng Pháp</option>
                        <option value="Tiếng Nga">Tiếng Nga</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-3">
                    <div className="d-flex flex-row align-items-center">
                      <label htmlFor="name" className={cx("control-label")}>
                        Đọc
                      </label>
                      <select
                        type="text"
                        id="name"
                        className={cx("form-control")}
                        required
                        value={languageOther ? languageOther.read : ""}
                        onChange={(e) =>
                          setLanguageOther({
                            ...languageOther,
                            read: e.target.value,
                          })
                        }
                      >
                        <option>Chọn</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-3">
                    <div className="d-flex flex-row align-items-center">
                      <label htmlFor="name" className={cx("control-label")}>
                        Viết<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <select
                        type="text"
                        id="name"
                        className={cx("form-control")}
                        required
                        value={languageOther ? languageOther.write : ""}
                        onChange={(e) =>
                          setLanguageOther({
                            ...languageOther,
                            write: e.target.value,
                          })
                        }
                      >
                        <option>Chọn</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-sm-3">
                    <div className="d-flex flex-row align-items-center">
                      <label htmlFor="name" className={cx("control-label")}>
                        Nói<span style={{ color: "#FF0000" }}>*</span>
                      </label>
                      <select
                        type="text"
                        id="name"
                        className={cx("form-control")}
                        required
                        value={languageOther ? languageOther.speak : ""}
                        onChange={(e) =>
                          setLanguageOther({
                            ...languageOther,
                            speak: e.target.value,
                          })
                        }
                      >
                        <option>Chọn</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  className="row col-sm-12"
                  style={{ paddingTop: "10px", textAlign: "center" }}
                >
                  <label className={cx("control-label")}>
                    A: Yếu - B: Trung bình - C: Khá - D: Thành thạo
                  </label>
                </div>

                <div className="row col-sm-12" style={{ paddingTop: "40px" }}>
                  <hr />
                </div>

                <button className={cx("save-btn")} onClick={submitHandler}>
                  Lưu lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationScreen;
