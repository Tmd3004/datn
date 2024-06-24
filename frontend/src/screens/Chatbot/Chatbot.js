import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Styles from "./Chatbot.module.scss";
import classNames from "classnames/bind";
import { IoIosSend } from "react-icons/io";

const cx = classNames.bind(Styles);

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [qaDisplay, setQADisplay] = useState([]);

  const inputRef = useRef();

  const url = "http://103.161.112.186/chat";

  const handleChange = (e) => {
    const questionValue = e.target.value;

    if (!questionValue.startsWith(" ")) {
      setQuestion(questionValue);
    }
  };

  const handleSendQuestion = async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({question: question}),
    })
     
    const data = await res.json();
    const answer = data.message;

    const newQA = {question, answer};

    setQADisplay([...qaDisplay, newQA])

    inputRef.current.focus();
    setQuestion("");
  };


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
        <div className={cx("right")}>
          <div className={cx("display")}>
            {qaDisplay.map((item, index) => (
              <div key={index}>
                <div className={cx("user-question")}>
                  <span className={cx("question")}>{item.question}</span>
                </div>
                <div className={cx("bot-answer")}>
                  <span className={cx("answer")}>{item.answer}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={cx("message-wrapper")}>
            <textarea
              type="text"
              ref={inputRef}
              className={cx("message")}
              placeholder="Nhắn gì đó cho chatbot..."
              value={question}
              onChange={handleChange}
            />
            <span className={cx("message-icon")} onClick={handleSendQuestion}>
              <IoIosSend size={25} color="#fff" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
