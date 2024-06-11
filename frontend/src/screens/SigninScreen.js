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

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${baseUrl}/users/signin`, {
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
      className={"bg-image d-flex justify-content-end flex-1"}
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
          <title>Sign In</title>
        </Helmet>
        <img
          alt="logo"
          src="/assets/login-logo.png"
          className="my-3 rounded"
          style={{ width: "120px", height: "120px" }}
        />
        <h2 className="my-3" style={{ color: "#575962" }}>
          ĐĂNG NHẬP
        </h2>
        <Form onSubmit={submitHandler} style={{ width: "100%" }}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Tài khoản</Form.Label>
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
          </Form.Group>
          <div className="d-flex justify-content-end mb-3">
            <Link
              to={`/forget-password`}
              style={{ textDecoration: "none", color: "red" }}
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="mb-3">
            <Button type="submit" style={{ width: "100%" }}>
              Đăng nhập
            </Button>
          </div>
          <div className="mb-3">
            <Link
              to={`/signup?redirect=${redirect}`}
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <Button variant="success" style={{ width: "100%" }}>
                Đăng ký
              </Button>
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
