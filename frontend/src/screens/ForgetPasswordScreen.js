import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import { baseUrl } from "../config";

export default function ForgetPasswordScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${baseUrl}/users/forget-password`, {
        email,
      });
      toast.success(data.message);
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
          <title>Forget Password</title>
        </Helmet>
        <img
          alt="logo"
          src="/assets/logo.jpg"
          className="my-3 rounded"
          style={{ width: "120px", height: "120px" }}
        />
        <h2 className="my-3" style={{ color: "#575962" }}>QUÊN MẬT KHẨU</h2>
        <Form onSubmit={submitHandler} style={{ width: "100%" }}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="abc@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <div className="mb-3">
            <Button type="submit" style={{ width: "100%" }}>Gửi mail</Button>
          </div>
          <div className="d-flex justify-content-center mb-3">
            <Link
              to={`/signin`}
              style={{ textDecoration: "none", color: "#0d6efd" }}
            >
              Đăng nhập
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
