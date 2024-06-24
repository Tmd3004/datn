import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import classNames from "classnames/bind";
import Styles from "./ViewAndPrintScreen.module.scss";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { baseUrl } from "../../config";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const cx = classNames.bind(Styles);

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const ViewAndPrintScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [dataInfor, setDataInfor] = useState({});
  const [dataTraining, setDataTraining] = useState([]);
  const [dataWorking, setDataWorking] = useState([]);
  const [dataResearch, setDataResearch] = useState({});
  const [dataPrize, setDataPrize] = useState([]);

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-infor/${userInfo._id}`,
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setDataInfor(data);
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
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-trainings/${userInfo._id}`
        );
        setDataTraining(data.training);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-workings/${userInfo._id}`
        );
        setDataWorking(data.working);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-researches/${userInfo._id}`
        );
        setDataResearch(data);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${baseUrl}/users/user-prizes/${userInfo._id}`
        );
        setDataPrize(data.prizes);
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

  const ISOReputation = dataResearch.results
    ? dataResearch.results.filter((item) =>
        item.typeResearch.includes("Bài báo ISI uy tín")
      )
    : "";

  const internationalReputation = dataResearch.results
    ? dataResearch.results.filter((item) =>
        item.typeResearch.includes("Bài báo quốc tế uy tín")
      )
    : "";

  const internationalOther = dataResearch.results
    ? dataResearch.results.filter((item) =>
        item.typeResearch.includes("Bài báo quốc tế khác")
      )
    : "";

  const nationalConference = dataResearch.results
    ? dataResearch.results.filter((item) =>
        item.typeResearch.includes("Bài báo tại hội nghị quốc gia/quốc tế")
      )
    : "";

  const magazineScience = dataResearch.results
    ? dataResearch.results.filter((item) =>
        item.typeResearch.includes(
          "Bài báo trên các tạp chí khoa học quốc gia uy tín"
        )
      )
    : "";

  const other = dataResearch.results
    ? dataResearch.results.filter((item) =>
        item.typeResearch.includes(
          "Khác(Sách chuyên khảo, bằng sáng chế, giải thưởng khoa học)"
        )
      )
    : "";

  const handleExportPdf = async () => {
    const input = divRef.current;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const pdfWidth = pageWidth - margin * 2;
    const pdfHeight = pageHeight - margin * 2;

    const totalCanvasHeight = input.scrollHeight;
    const totalPDFHeight = Math.ceil(totalCanvasHeight / pdfHeight) * pdfHeight;

    let canvasHeight = totalCanvasHeight;
    let pdfPage = 0;

    while (canvasHeight > 0) {
      const canvas = await html2canvas(input, {
        height: Math.min(totalPDFHeight - pdfPage * pdfHeight, pdfHeight),
        y: pdfPage * pdfHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", margin, 0, imgWidth, imgHeight);

      pdfPage++;
      canvasHeight -= pdfHeight;

      if (canvasHeight > 0) {
        pdf.addPage();
      }
    }

    pdf.save("download.pdf");
  };

  const divRef = useRef();

  return (
    <div style={{ padding: "0 15px" }}>
      <Helmet>
        <title>Xem và in</title>
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
          Xem và in lý lịch khoa học
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
            <li className={cx("nav-item", "active")}>
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
        <div className="row">
          <div className="col-md-3">
            <div className={cx("general-info")}>
              <img
                src={dataInfor.image ? dataInfor.image : "/assets/user.png"}
                alt="avatar"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <span className={cx("card-body-name")}>
                {dataInfor.name ? dataInfor.name : userInfo.name}
              </span>
              <span className={cx("card-body-email")}>
                {`Số CMND/CCCD: ${
                  dataInfor.citizenIdentification
                    ? dataInfor.citizenIdentification
                    : ""
                }`}
              </span>
              <span className={cx("card-body-name")}>
                {dataInfor.email ? dataInfor.email : userInfo.email}
              </span>
              <div className={cx("button-wrapper")}>
                <button className={cx("view-btn")}>Xem</button>
                <button
                  className={cx("download-btn")}
                  onClick={handleExportPdf}
                >
                  Tải về LLKH
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className={cx("panel")}>
              <div className={cx("panel-body")} ref={divRef}>
                <div>
                  <table
                    width="100%"
                    style={{ border: "1px solid transparent" }}
                  >
                    <tbody>
                      <tr>
                        <td width="30%" className={cx("table-header")}>
                          <img
                            src="/assets/logo.jpg"
                            alt="logo_vi"
                            width="30%"
                          />
                        </td>
                        <td className={cx("table-header")}></td>
                        <td width="35%" className={cx("table-header")}>
                          <table width="100%">
                            <tbody>
                              <tr>
                                <td width="40%">Mã tài khoản</td>
                                <td>{userInfo._id}</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className={cx("panel-title")}>Lý lịch khoa học</p>

                <p>
                  <strong>1. Thông tin cá nhân</strong>
                </p>

                <div style={{ paddingBottom: "20px" }}>
                  <table width="100%" style={{ fontSize: "14px" }}>
                    <tbody>
                      <tr>
                        <td width="5%" rowSpan={3}>
                          <p>1</p>
                        </td>
                        <td width="20%">
                          <span>Họ và tên</span>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td width="20%">
                          <span>
                            {dataInfor.name ? dataInfor.name : userInfo.name}
                          </span>
                        </td>
                        <td width="20%">
                          <span>Ngày sinh</span>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td width="20%">
                          <span>{dataInfor.dateOfBirth}</span>
                        </td>
                        <td width="15%">
                          <span>{`Giới tính: ${
                            dataInfor.gender === "male" ? "Nam" : "Nữ"
                          }`}</span>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <span>Chức danh khoa hoc</span>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td>
                          <span>{dataInfor.scientificTitleVi}</span>
                        </td>
                        <td>
                          <span>Số CMND/CCCD</span>
                        </td>
                        <td colSpan={2}>
                          <span>{dataInfor.citizenIdentification}</span>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <span>Chức vụ hành chính</span>
                        </td>
                        <td colSpan={4}>
                          <span>{dataInfor.administrativePositionVi}</span>
                        </td>
                      </tr>

                      <tr>
                        <td width="5%" rowSpan={2}>
                          <p>2</p>
                        </td>
                        <td>
                          <span>Ngành khoa học</span>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td colSpan={4}>
                          <span>{dataInfor.train?.science}</span>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <span>Chuyên ngành khoa học</span>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td colSpan={4}>
                          <span>{dataInfor.train?.major}</span>
                        </td>
                      </tr>

                      <tr>
                        <td width="5%" rowSpan={4}>
                          <p>3</p>
                        </td>
                        <td>
                          <span>Đơn vị công tác và địa chỉ</span>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td colSpan={4}>
                          <span>
                            {dataInfor.school?.name},{" "}
                            {dataInfor.school?.address},{" "}
                            {dataInfor.school?.city}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <span>Tên phòng ban</span>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td colSpan={4}>
                          <span>{dataInfor.school?.department}</span>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <span>Số điện thoại cơ quan</span>
                        </td>
                        <td>
                          <span>{dataInfor.officePhone}</span>
                        </td>
                        <td>
                          <span>Số điện thoại di động</span>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td colSpan={2}>
                          <span>{dataInfor.phone}</span>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <span>Fax</span>
                        </td>
                        <td>
                          <span>{dataInfor.fax}</span>
                        </td>
                        <td>
                          <span>E-mail</span>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td colSpan={2}>
                          <span>
                            {dataInfor.email ? dataInfor.email : userInfo.email}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td width="5%">
                          <p>4</p>
                        </td>
                        <td>
                          <span>Số tài khoản</span>
                        </td>
                        <td>
                          <span>{dataInfor.account}</span>
                        </td>
                        <td>
                          <span>Mở tại ngân hàng</span>
                        </td>
                        <td colSpan={2}>
                          <span>
                            {dataInfor.bank}
                            {dataInfor.branch
                              ? ` - Chi nhánh ${dataInfor.branch}`
                              : ""}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  <strong>2. Quá trình đào tạo</strong>
                </p>

                <div style={{ paddingBottom: "20px" }}>
                  <table width="100%" style={{ fontSize: "14px" }}>
                    <tbody>
                      <tr>
                        <td width="5%">
                          <strong>TT</strong>
                        </td>
                        <td width="20%">
                          <strong>Thời gian</strong>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td width="35%">
                          <strong>Tên cơ sở đào tạo</strong>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td width="20%">
                          <strong>Chuyên ngành </strong>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td width="20%">
                          <strong>Học hàm/Học vị</strong>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                      </tr>

                      {dataTraining
                        ? dataTraining.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <span>{index + 1}</span>
                              </td>
                              <td>
                                <span>
                                  {item.time.begin} - {item.time.end}
                                </span>
                              </td>
                              <td>
                                <span>{item.trainingFacilityVi}</span>
                              </td>
                              <td>
                                <span>{item.majorVi}</span>
                              </td>
                              <td>
                                <span>{item.degree.Vi}</span>
                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>

                <p>
                  <strong>3. Quá trình công tác</strong>
                </p>

                <div style={{ paddingBottom: "20px" }}>
                  <table width="100%" style={{ fontSize: "14px" }}>
                    <tbody>
                      <tr>
                        <td width="5%">
                          <strong>TT</strong>
                        </td>
                        <td width="20%">
                          <strong>Thời gian</strong>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td width="35%">
                          <strong>Cơ quan công tác</strong>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td width="20%">
                          <strong>Địa chỉ và Số điện thoại</strong>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                        <td width="20%">
                          <strong>Chức vụ</strong>
                          <span style={{ color: "#FF0000" }}> *</span>
                        </td>
                      </tr>

                      {dataWorking
                        ? dataWorking.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <span>{index + 1}</span>
                              </td>
                              <td>
                                <span>
                                  {item.workingAgency.time.begin} -{" "}
                                  {item.workingAgency.time.end}
                                </span>
                              </td>
                              <td>
                                <span>{item.workingAgency.vi}</span>
                              </td>
                              <td>
                                <span>
                                  {item.workingAgency.address} -{" "}
                                  {item.workingAgency.phone}
                                </span>
                              </td>
                              <td>
                                <span>{item.position.vi}</span>
                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>

                <p>
                  <strong>4. Ngoại ngữ </strong>
                  A: Yếu - B: Trung bình - c: Khá - D: Thành thạo
                </p>

                <div style={{ paddingBottom: "20px" }}>
                  <table width="100%" style={{ fontSize: "14px" }}>
                    <tbody>
                      <tr>
                        <td width="25%">
                          <strong>Ngoại ngữ</strong>
                        </td>
                        <td width="25%">
                          <strong>Đọc</strong>
                        </td>
                        <td width="25%">
                          <strong>Viết</strong>
                        </td>
                        <td width="25%">
                          <strong>Nói</strong>
                        </td>
                      </tr>

                      <tr>
                        <td width="25%">
                          <strong>Tiếng Anh</strong>
                        </td>
                        <td width="25%">
                          <span>{dataInfor.english?.read}</span>
                        </td>
                        <td width="25%">
                          <span>{dataInfor.english?.write}</span>
                        </td>
                        <td width="25%">
                          <span>{dataInfor.english?.speak}</span>
                        </td>
                      </tr>

                      <tr>
                        <td width="25%">
                          <strong>{dataInfor.languageOther?.name}</strong>
                        </td>
                        <td width="25%">
                          <span>{dataInfor.languageOther?.read}</span>
                        </td>
                        <td width="25%">
                          <span>{dataInfor.languageOther?.write}</span>
                        </td>
                        <td width="25%">
                          <span>{dataInfor.languageOther?.speak}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  <strong>5. Kinh nghiệm và thành tích nghiên cứu </strong>
                </p>

                <p>
                  5.1. Hướng nghiên cứu chính theo đuổi trong 5 năm gần đây:
                  <span style={{ color: "#FF0000" }}> *</span>
                </p>

                <p style={{ paddingLeft: "10px", fontSize: "16px" }}>
                  {dataResearch.mainResearch?.vi}
                </p>

                <p>5.2. Danh sách đề tài/dự án nghiên cứu hoặc nộp hồ sơ</p>

                <div style={{ paddingBottom: "20px" }}>
                  <table width="100%" style={{ fontSize: "14px" }}>
                    <tbody>
                      <tr>
                        <td width="5%">
                          <strong>TT</strong>
                        </td>
                        <td width="40%">
                          <strong>Tên đề tài/dự án</strong>
                        </td>
                        <td width="20%">
                          <strong>Cơ quan tài trợ kinh phí</strong>
                        </td>
                        <td width="20%">
                          <strong>Thời gian thực hiện</strong>
                        </td>
                        <td width="15%">
                          <strong>Vai trò</strong>
                        </td>
                      </tr>

                      {dataResearch.listTopics
                        ? dataResearch.listTopics.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <span>{index + 1}</span>
                              </td>
                              <td>
                                <span>{item.name.vi}</span>
                              </td>
                              <td>
                                <span>{item.sponsoringOrganization.vi}</span>
                              </td>
                              <td>
                                <span>
                                  {item.time.begin} - {item.time.end}
                                </span>
                              </td>
                              <td>
                                <span>{item.role.vi}</span>
                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>

                <p>5.3. Kết quả nghiên cứu đã được công bố hoặc đăng ký</p>

                <div style={{ paddingBottom: "20px" }}>
                  <table width="100%" style={{ fontSize: "14px" }}>
                    <tbody>
                      <tr>
                        <td width="5%">
                          <strong>TT</strong>
                        </td>
                        <td width="15%">
                          <strong>Tên tác giả</strong>
                        </td>
                        <td width="10%">
                          <strong>Năm công bố</strong>
                        </td>
                        <td width="25%">
                          <strong>Tên công trình</strong>
                        </td>
                        <td width="20%">
                          <strong>
                            Tên tạp chí NXB/Số, Tập, Trang đăng công trình
                          </strong>
                        </td>
                        <td width="10%">
                          <strong>Số ISSN/ISBN</strong>
                        </td>
                        <td width="5%">
                          <strong>Minh chứng</strong>
                        </td>
                        <td width="10%">
                          <strong>Ghi chú</strong>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <strong>1</strong>
                        </td>
                        <td colSpan={7} style={{ textAlign: "left" }}>
                          <strong>Bài báo ISI</strong>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <strong>1.1</strong>
                        </td>
                        <td colSpan={7} style={{ textAlign: "left" }}>
                          <strong>Bài báo ISI uy tín</strong>
                        </td>
                      </tr>

                      {ISOReputation.length > 0
                        ? ISOReputation.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <span>1.1.{index + 1}</span>
                              </td>
                              <td>
                                <span>{item.author}</span>
                              </td>
                              <td>
                                <span>{item.year}</span>
                              </td>
                              <td>
                                <span>{item.name}</span>
                              </td>
                              <td>
                                <span>{item.magazineName}</span>
                              </td>
                              <td>
                                <span>{item.issn}</span>
                              </td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  target="_blank"
                                  className={cx("table-link")}
                                >
                                  Xem
                                </Link>
                              </td>
                              <td>
                                <span></span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td>
                          <strong>1.2</strong>
                        </td>
                        <td colSpan={7} style={{ textAlign: "left" }}>
                          <strong>Bài báo ISI khác</strong>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <strong>2a</strong>
                        </td>
                        <td colSpan={7} style={{ textAlign: "left" }}>
                          <strong>Bài báo quốc tế uy tín</strong>
                        </td>
                      </tr>

                      {internationalReputation.length > 0
                        ? internationalReputation.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <span>2a.{index + 1}</span>
                              </td>
                              <td>
                                <span>{item.author}</span>
                              </td>
                              <td>
                                <span>{item.year}</span>
                              </td>
                              <td>
                                <span>{item.name}</span>
                              </td>
                              <td>
                                <span>{item.magazineName}</span>
                              </td>
                              <td>
                                <span>{item.issn}</span>
                              </td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  target="_blank"
                                  className={cx("table-link")}
                                >
                                  Xem
                                </Link>
                              </td>
                              <td>
                                <span></span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td>
                          <strong>2b</strong>
                        </td>
                        <td colSpan={7} style={{ textAlign: "left" }}>
                          <strong>Bài báo quốc tế khác</strong>
                        </td>
                      </tr>

                      {internationalOther.length > 0
                        ? internationalOther.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <span>2b.{index + 1}</span>
                              </td>
                              <td>
                                <span>{item.author}</span>
                              </td>
                              <td>
                                <span>{item.year}</span>
                              </td>
                              <td>
                                <span>{item.name}</span>
                              </td>
                              <td>
                                <span>{item.magazineName}</span>
                              </td>
                              <td>
                                <span>{item.issn}</span>
                              </td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  target="_blank"
                                  className={cx("table-link")}
                                >
                                  Xem
                                </Link>
                              </td>
                              <td>
                                <span></span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td>
                          <strong>3</strong>
                        </td>
                        <td colSpan={7} style={{ textAlign: "left" }}>
                          <strong>Báo cáo tại hội nghị quốc gia/quốc tế</strong>
                        </td>
                      </tr>

                      {nationalConference.length > 0
                        ? nationalConference.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <span>3.{index + 1}</span>
                              </td>
                              <td>
                                <span>{item.author}</span>
                              </td>
                              <td>
                                <span>{item.year}</span>
                              </td>
                              <td>
                                <span>{item.name}</span>
                              </td>
                              <td>
                                <span>{item.magazineName}</span>
                              </td>
                              <td>
                                <span>{item.issn}</span>
                              </td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  target="_blank"
                                  className={cx("table-link")}
                                >
                                  Xem
                                </Link>
                              </td>
                              <td>
                                <span></span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td>
                          <strong>4</strong>
                        </td>
                        <td colSpan={7} style={{ textAlign: "left" }}>
                          <strong>
                            Bài báo trên các tạp chí khoa học quốc gia
                          </strong>
                        </td>
                      </tr>

                      {magazineScience.length > 0
                        ? magazineScience.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <span>1.1.{index + 1}</span>
                              </td>
                              <td>
                                <span>{item.author}</span>
                              </td>
                              <td>
                                <span>{item.year}</span>
                              </td>
                              <td>
                                <span>{item.name}</span>
                              </td>
                              <td>
                                <span>{item.magazineName}</span>
                              </td>
                              <td>
                                <span>{item.issn}</span>
                              </td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  target="_blank"
                                  className={cx("table-link")}
                                >
                                  Xem
                                </Link>
                              </td>
                              <td>
                                <span></span>
                              </td>
                            </tr>
                          ))
                        : ""}

                      <tr>
                        <td>
                          <strong>5</strong>
                        </td>
                        <td colSpan={7} style={{ textAlign: "left" }}>
                          <strong>
                            Khác(Sách chuyên khảo, bằng sáng chế, giải thưởng
                            khoa học)
                          </strong>
                        </td>
                      </tr>

                      {other.length > 0
                        ? other.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <span>1.1.{index + 1}</span>
                              </td>
                              <td>
                                <span>{item.author}</span>
                              </td>
                              <td>
                                <span>{item.year}</span>
                              </td>
                              <td>
                                <span>{item.name}</span>
                              </td>
                              <td>
                                <span>{item.magazineName}</span>
                              </td>
                              <td>
                                <span>{item.issn}</span>
                              </td>
                              <td>
                                <Link
                                  to={item.proofOfDegree}
                                  target="_blank"
                                  className={cx("table-link")}
                                >
                                  Xem
                                </Link>
                              </td>
                              <td>
                                <span></span>
                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>

                <p>5.4. Kết quả nghiên cứu đã được công bố hoặc đăng ký</p>

                <div style={{ paddingBottom: "20px" }}>
                  <table width="100%" style={{ fontSize: "14px" }}>
                    <tbody>
                      <tr>
                        <td width="10%">
                          <strong>TT</strong>
                        </td>
                        <td width="50%">
                          <strong>Hình thức và nội dung giải thưởng</strong>
                        </td>
                        <td width="40%">
                          <strong>Năm tặng thưởng</strong>
                        </td>
                      </tr>

                      {dataPrize
                        ? dataPrize.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.content}</td>
                              <td>{item.year}</td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>

                <table width="100%">
                  <tbody>
                    <tr>
                      <td
                        width="50%"
                        align="center"
                        valign="top"
                        className={cx("table-footer")}
                      >
                        <strong>Xác nhận của cơ quan công tác</strong>
                      </td>
                      <td
                        width="50%"
                        className={cx("td-signer", "table-footer")}
                      >
                        <span className={cx("td-time")}>
                          Đà Nẵng, Ngày {day} Tháng {month} Năm {year}
                          <strong>Người khai</strong>
                        </span>
                        <span>
                          <strong>
                            {dataInfor.name ? dataInfor.name : userInfo.name}
                          </strong>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAndPrintScreen;
