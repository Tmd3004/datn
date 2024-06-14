import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { baseUrl } from "../config";

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { data } = await axios.post(`${baseUrl}/users/signup`, {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div
      className={"bg-image d-flex justify-content-end"}
      style={{
        backgroundImage: "url('/assets/login-bg.jpg')",
        width: "100vw",
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          minWidth: "600px",
          backgroundColor: "hsla(0,0%,100%,.9)",
          padding: "15px 60px",
        }}
      >
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <img
          alt="logo"
          src="/assets/logo.jpg"
          className="my-3 rounded"
          style={{ width: "120px", height: "120px" }}
        />
        <h2 className="my-3" style={{ color: "#575962" }}>
          ĐĂNG KÝ
        </h2>
        <Form onSubmit={submitHandler} style={{ width: "100%" }}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="email"
              placeholder="abc@gmail.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="******"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Nhập lại mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="******"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Form.Group>
          <div className="mb-3">
            <Button type="submit" style={{ width: "100%" }}>
              Đăng ký
            </Button>
          </div>
          <div className="mb-3 d-flex justify-content-end">
            <Link
              to={`/signin?redirect=${redirect}`}
              style={{ textDecoration: "none", color: "green" }}
            >
              Quay lại trang đăng nhập?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
