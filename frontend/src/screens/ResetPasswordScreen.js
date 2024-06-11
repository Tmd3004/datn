import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import { baseUrl } from "../config";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo || !token) {
      navigate("/");
    }
  }, [navigate, userInfo, token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axios.post(`${baseUrl}/users/reset-password`, {
        password,
        token,
      });
      navigate("/signin");
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error(getError(err));
    }
  };

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
          <title>Reset Password</title>
        </Helmet>
        <img
          alt="logo"
          src="/assets/login-logo.png"
          className="my-3 rounded"
          style={{ width: "120px", height: "120px" }}
        />
        <h2 className="my-3" style={{ color: "#575962" }}>
          ĐẶT LẠI MẬT KHẨU
        </h2>
        <Form onSubmit={submitHandler} style={{ width: "100%" }}>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              placeholder="******"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Nhập lại mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              placeholder="******"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div className="mb-3">
            <Button type="submit" style={{ width: "100%" }}>
              Đặt lại mật khẩu
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
