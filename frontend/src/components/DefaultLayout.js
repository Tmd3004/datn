import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { Link, NavLink } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useContext } from "react";
import { Store } from "../Store";
import { TbLogout } from "react-icons/tb";

const DefaultLayout = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, userInfo } = state;

  const [href, setHref] = useState("");
  const [inforActive, setInforActive] = useState(false);
  const [topicActive, setTopicActive] = useState(false);
  const [confirmActive, setConfirmActive] = useState(false);

  console.log(userInfo);

  useEffect(() => {
    const href = window.location.href;
    setInforActive(href.includes("manage_profile"));
    setTopicActive(
      href.includes("program") ||
        href.includes("track_topic_status") ||
        href.includes("topic_review")
    );
    setInforActive(href.includes("confirm-topic"));
  }, [window.location.reload]);

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/signin";
  };
  return (
    <Navbar
      bg="primary"
      variant="dark"
      style={{
        padding: "0 15px",
        fontSize: "14px",
        color: "#ffecec",
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      <Link to="/">
        <img
          alt="logo"
          src="/assets/logo.jpg"
          style={{ maxHeight: "35px", paddingRight: "10px" }}
        />
      </Link>

      {userInfo.isManager ? (
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ width: "100%" }}
        >
          <div className="d-flex align-items-center">
            <LinkContainer
              to="/"
              className="nav-item"
              onClick={() => {
                setInforActive(false);
                setTopicActive(false);
              }}
            >
              <div>
                <img
                  src="/assets/home.png"
                  alt="home"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "8px",
                  }}
                />
                Trang chủ
              </div>
            </LinkContainer>
          </div>

          <NavDropdown
            title={
              <>
                <img
                  src="/assets/user.png"
                  alt="profiles"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "8px",
                  }}
                />
                {userInfo.name}
              </>
            }
          >
            <Link
              to="#signout"
              onClick={signoutHandler}
              style={{ textDecoration: "none" }}
            >
              <NavDropdown.Item>
                <TbLogout style={{ marginRight: "8px" }} />
                Sign Out
              </NavDropdown.Item>
            </Link>
          </NavDropdown>
        </div>
      ) : (
        <div
          className="d-flex align-items-center justify-content-between"
          style={{ width: "100%" }}
        >
          <div className="d-flex align-items-center">
            <LinkContainer
              to="/"
              className="nav-item"
              onClick={() => {
                setInforActive(false);
                setTopicActive(false);
              }}
            >
              <div>
                <img
                  src="/assets/home.png"
                  alt="home"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "8px",
                  }}
                />
                Trang chủ
              </div>
            </LinkContainer>

            <NavDropdown
              title={
                <>
                  <img
                    src="/assets/profiles.png"
                    alt="profiles"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "8px",
                    }}
                  />
                  Lý lịch khoa học
                </>
              }
              id="basic-nav-dropdown"
              className={inforActive ? "active" : ""}
            >
              <LinkContainer
                to="/manage_profile"
                style={{ padding: "8px 20px" }}
                onClick={() => {
                  setInforActive(true);
                  setTopicActive(false);
                }}
              >
                <NavDropdown.Item>
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
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer
                to="/manage_profile_1"
                style={{ padding: "8px 20px" }}
                onClick={() => {
                  setInforActive(true);
                  setTopicActive(false);
                }}
              >
                <NavDropdown.Item>
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
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer
                to="/manage_profile_2"
                style={{ padding: "8px 20px" }}
                onClick={() => {
                  setInforActive(true);
                  setTopicActive(false);
                }}
              >
                <NavDropdown.Item>
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
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer
                to="/manage_profile_3"
                style={{ padding: "8px 20px" }}
                onClick={() => {
                  setInforActive(true);
                  setTopicActive(false);
                }}
              >
                <NavDropdown.Item>
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
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer
                to="/manage_profile_4"
                style={{ padding: "8px 20px" }}
                onClick={() => {
                  setInforActive(true);
                  setTopicActive(false);
                }}
              >
                <NavDropdown.Item>
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
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer
                to="/manage_profile_5"
                style={{ padding: "8px 20px" }}
                onClick={() => {
                  setInforActive(true);
                  setTopicActive(false);
                }}
              >
                <NavDropdown.Item>
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
                </NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            <NavDropdown
              title={
                <>
                  <img
                    src="/assets/topic.png"
                    alt="profiles"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "8px",
                    }}
                  />
                  Đề tài - Hồ sơ
                </>
              }
              id="basic-nav-dropdown"
              className={topicActive ? "active" : ""}
            >
              <LinkContainer
                to="/track_topic_status"
                style={{ padding: "8px 20px" }}
                onClick={() => {
                  setInforActive(false);
                  setTopicActive(true);
                }}
              >
                <NavDropdown.Item>
                  <img
                    src="/assets/list_docs.png"
                    alt="information"
                    style={{
                      width: "22px",
                      height: "22px",
                      marginRight: "4px",
                    }}
                  />
                  Danh sách đề tài - hồ sơ
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer
                to="/program"
                style={{ padding: "8px 20px" }}
                onClick={() => {
                  setInforActive(false);
                  setTopicActive(true);
                }}
              >
                <NavDropdown.Item>
                  <img
                    src="/assets/register.png"
                    alt="education"
                    style={{
                      width: "22px",
                      height: "22px",
                      marginRight: "4px",
                    }}
                  />
                  Đăng ký chương trình
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer
                to="/topic_review"
                style={{ padding: "8px 20px" }}
                onClick={() => {
                  setInforActive(false);
                  setTopicActive(true);
                }}
              >
                <NavDropdown.Item>
                  <img
                    src="/assets/review.png"
                    alt="work"
                    style={{
                      width: "22px",
                      height: "22px",
                      marginRight: "8px",
                    }}
                  />
                  Hồ sơ được mời phản biện
                </NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            {userInfo.isAdmin ? (
              <LinkContainer
                to="/confirm-topic"
                style={{ padding: "14px 10px" }}
                onClick={() => {
                  setInforActive(false);
                  setTopicActive(false);
                }}
                className={`nav-item ${confirmActive ? "active" : ""}`}
              >
                <div style={{ padding: "20px" }}>
                  <img
                    alt="logo"
                    src="/assets/confirmation.png"
                    style={{
                      width: "22px",
                      height: "22px",
                      marginRight: "8px",
                      color: "#fff",
                    }}
                  />
                  Xác nhận đề tài
                </div>
              </LinkContainer>
            ) : (
              ""
            )}

            <LinkContainer
              to="/chatbot"
              className="nav-item"
              onClick={() => {
                setInforActive(false);
                setTopicActive(false);
              }}
            >
              <div>
                <img
                  alt="logo"
                  src="/assets/chatbot.png"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "8px",
                    color: "#fff",
                  }}
                />
                Chatbot hỗ trợ
              </div>
            </LinkContainer>
          </div>

          <NavDropdown
            title={
              <>
                <img
                  src="/assets/user.png"
                  alt="profiles"
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "8px",
                  }}
                />
                {userInfo.name}
              </>
            }
          >
            <Link
              to="#signout"
              onClick={signoutHandler}
              style={{ textDecoration: "none" }}
            >
              <NavDropdown.Item>
                <TbLogout style={{ marginRight: "8px" }} />
                Sign Out
              </NavDropdown.Item>
            </Link>
          </NavDropdown>
        </div>
      )}
    </Navbar>
  );
};

export default DefaultLayout;
