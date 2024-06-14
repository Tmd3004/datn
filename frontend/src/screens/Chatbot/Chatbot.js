import React from "react";
import { Helmet } from "react-helmet-async";
import Styles from "./Chatbot.module.scss";
import classNames from "classnames/bind";
import { IoIosSend } from "react-icons/io";

const cx = classNames.bind(Styles);

const Chatbot = () => {
  return (
    <div style={{ padding: "20px 15px", height: "100vh" }}>
      <Helmet>
        <title>Chatbot hỗ trợ</title>
      </Helmet>

      <div
        style={{
          backgroundColor: "#fff",
          display: "flex",
        }}
      >
        <div className={cx("left")}>
          <ul className={cx("list")}>
            <li className={cx("list-item", "active")}></li>
            <li className={cx("list-item")}></li>
            <li className={cx("list-item")}></li>
          </ul>
        </div>
        <div className={cx("right")}>
          <div className={cx("display")}>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("bot-answer")}>
              <span className={cx("answer")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
               
              </span>
            </div>
            <div className={cx("user-question")}>
              <span className={cx("question")}>
                Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
              </span>
            </div><div className={cx("user-question")}>
              <span className={cx("question")}>
                Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
              </span>
            </div><div className={cx("user-question")}>
              <span className={cx("question")}>
                Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
              </span>
            </div><div className={cx("user-question")}>
              <span className={cx("question")}>
                Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
              </span>
            </div><div className={cx("user-question")}>
              <span className={cx("question")}>
                Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
              </span>
            </div><div className={cx("user-question")}>
              <span className={cx("question")}>
                Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
              </span>
            </div><div className={cx("user-question")}>
              <span className={cx("question")}>
                Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
              </span>
            </div>
          </div>

          <div className={cx("message-wrapper")}>
            <textarea type="text" className={cx("message")} placeholder="Nhắn gì đó cho chatbot..."/>
            <span className={cx("message-icon")}>
              <IoIosSend size={25} color="#fff" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
