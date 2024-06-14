import React, { useContext, useEffect, useReducer, useState } from "react";
import Styles from "./ProgramFacultyScreen.module.scss";
import classNames from "classnames/bind";
import { Store } from "../../Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config";
import { toast } from "react-toastify";
import { getError } from "../../utils";
import { Helmet } from "react-helmet-async";

const cx = classNames.bind(Styles);

function reducer(state, action) {
  switch (action.type) {
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

const ProgramFacultyScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [scientificTitleVi, setScientificTitleVi] = useState("");
  const [workingAgency, setWorkingAgency] = useState("");
  const [topicNameVi, setTopicNameVi] = useState("");
  const [topicNameEn, setTopicNameEn] = useState("");
  const [monthOfTopic, setMonthOfTopic] = useState(0);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

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

        setName(data.name);
        setEmail(data.email);
        setScientificTitleVi(data.scientificTitleVi);
        setWorkingAgency(data.school.name);
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

  const handleSubmit = async (e) => {
    const userId = userInfo._id;
    const topic = "faculty"

    const projectData = {
      userId,
      name,
      email,
      workingAgency,
      topicNameVi,
      topicNameEn,
      monthOfTopic,
      role,
      scientificTitleVi,
      topic
    };

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        `${baseUrl}/project/create`,
        projectData,
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      navigate(`/program/faculty/${data.id}`);
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("List Research Process Successfully");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  return (
    <div style={{ padding: "0 15px" }}>
      <Helmet>
        <title>Đề tài cấp khoa</title>
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
          Đề tài cấp khoa
        </h3>
      </div>

      <div
        style={{
          height: "100vh",
          backgroundColor: "#fff",
          padding: "25px",
        }}
      >
        <div className={cx("panel")}>
          <div className={cx("panel-heading")}>
            <b style={{ paddingRight: "8px" }}>Đề tài cấp khoa</b>
          </div>
          <div className={cx("panel-body")}>
            <div className={cx("form-group")}>
              <label className={cx("col-sm-3", "control-label")}>
                Tên đề tài (Tiếng Việt):
              </label>
              <div className="col-sm-8">
                <textarea
                  rows={3}
                  cols={20}
                  required
                  title="Không được để trống"
                  className={cx("form-control")}
                  style={{ height: "80px" }}
                  value={topicNameVi}
                  onChange={(e) => setTopicNameVi(e.target.value)}
                />
              </div>
            </div>

            <div className={cx("form-group")}>
              <label className={cx("col-sm-3", "control-label")}>
                Tên đề tài (Tiếng Anh):
              </label>
              <div className="col-sm-8">
                <textarea
                  rows={3}
                  cols={20}
                  required
                  title="Không được để trống"
                  className={cx("form-control")}
                  style={{ height: "80px" }}
                  value={topicNameEn}
                  onChange={(e) => setTopicNameEn(e.target.value)}
                />
              </div>
            </div>

            <div className={cx("form-group")}>
              <label className={cx("col-sm-3", "control-label")}>
                Số tháng bạn làm việc cho đề tài:
              </label>
              <div className="col-sm-2">
                <input
                  type="number"
                  required
                  title="Không được để trống"
                  className={cx("form-control")}
                  value={monthOfTopic}
                  onChange={(e) => setMonthOfTopic(e.target.value)}
                />
              </div>
              <p
                className={cx("col-sm-2", "control-label")}
                style={{ textAlign: "left", marginLeft: "20px" }}
              >
                (Tháng)
              </p>
            </div>

            <div className={cx("form-group")}>
              <label className={cx("col-sm-3", "control-label")}>
                Vai trò:
              </label>
              <div className="col-sm-4">
                <select
                  className={cx("form-control")}
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                >
                  <option value="">Chọn</option>
                  <option value="Chủ nhiệm đề tài">Chủ nhiệm đề tài</option>
                </select>
              </div>
            </div>

            <div className={cx("form-group")}>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ width: "100%" }}
              >
                <button
                  type="submit"
                  className={cx("save-btn")}
                  onClick={handleSubmit}
                >
                  Đăng ký hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramFacultyScreen;
