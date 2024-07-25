import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import Styles from "./Menu.module.scss";

const cx = classNames.bind(Styles);

const Menu = () => {
  const url = window.location.pathname;
  const lastSlash = url.lastIndexOf("/");

  const [tab, setTab] = useState("");

  useEffect(() => {
    setTab(url.slice(lastSlash + 1, url.length));
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/${tab}`);
  }, [tab]);

  return (
    <div className={cx("menu")}>
      <ul className={cx("list-item")}>
        <li
          className={cx("item", tab === "" ? "active" : "")}
          onClick={() => setTab("")}
        >
          Inicio
        </li>
        <li
          className={cx("item", tab === "detection" ? "active" : "")}
          onClick={() => setTab("detection")}
        >
          Detecciones con IA
        </li>
        <li
          className={cx(
            "item",
            tab === "check" || tab === "verified" ? "active" : ""
          )}
        >
          Denuncias Ciudadanas
          <ul className={cx("dropdown-content")}>
            <li
              className={cx("dropdown-link", tab === "check" ? "active" : "")}
              onClick={() => setTab("check")}
            >
              Hacé tu denuncia
            </li>
            <li
              className={cx(
                "dropdown-link",
                tab === "verified" ? "active" : ""
              )}
              onClick={() => setTab("verified")}
            >
              Denuncias verificadas
            </li>
          </ul>
        </li>
        <li
          className={cx("item", tab === "resource-center" ? "active" : "")}
          onClick={() => setTab("resource-center")}
        >
          Centro de recursos
        </li>
        <li
          className={cx("item", tab === "recommendation" ? "active" : "")}
          onClick={() => setTab("recommendation")}
        >
          Sobre esta iniciativa
        </li>
      </ul>
    </div>
  );
};

export default Menu;
