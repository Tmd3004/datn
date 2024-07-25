import React, { useRef } from "react";
import classNames from "classnames/bind";
import Styles from "./Check.module.scss";
import Image from "../../../components/Image/Image";
import images from "../../../assets/images/images";
import { FiUpload } from "react-icons/fi";

const cx = classNames.bind(Styles);

const Check = () => {
  const fileInputRef = useRef(null);

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={cx("wrapper")}>
      <span className={cx("title")}>Hacé tu denuncia</span>
      <span className={cx("desc-title")}>
        Compartí y reportá infracciones que encuentres para nuestra revisión.{" "}
        <b>Contamos con vos</b> para la protección de la lactancia humana.
      </span>

      <div className={cx("detect-list")}>
        <div className={cx("detect-item")}>
          <span className={cx("detect-item-title")}>Texto</span>
          <span className={cx("detect-item-desc")}>
            Si es un anuncio escribí el texto del mismo.
            <br />
            Si es otro tipo de publicidad, promoción o patrocinio escribí el
            lugar donde lo encontraste.
          </span>
          <div className={cx("detect-item-content-text")}>
            <textarea
              cols={30}
              rows={10}
              placeholder="Escribí aquí"
              className={cx("textarea-input")}
            />
          </div>
        </div>

        <div className={cx("detect-item")}>
          <span className={cx("detect-item-title")}>Subí una imagen</span>
          <div className={cx("spacing")}></div>

          <div className={cx("detect-item-content-img")}>
            <div
              className={cx("upload-img-wrapper")}
              onClick={handleClickUpload}
            >
              <Image
                src={images.noImage}
                alt="upload image"
                className={cx("upload-img")}
              />
            </div>
            <FiUpload className={cx("upload-icon")} />
            <input type="file" ref={fileInputRef} style={{ display: "none" }} />
          </div>
        </div>

        <div className={cx("detect-item")}>
          <span className={cx("detect-item-title")}>Subí una imagen</span>
          <div className={cx("spacing")}></div>

          <div className={cx("detect-item-content-url")}>
            <textarea placeholder="URL" />
          </div>
        </div>
      </div>

      <div className={cx("desc")}>
        <span className={cx("detect-item-title")}>Descripción</span>
        <span className={cx("detect-item-desc")}>
          Compartinos un breve resumen que nos ayude a contextualizar la
          información cargada.
        </span>
        <div className={cx("detect-desc")}>
          <textarea
            cols={20}
            rows={4}
            placeholder="Escribí aquí"
            className={cx("textarea-input")}
          />
        </div>
      </div>

      <div className={cx("submit")}>
        <span className={cx("warning")}>
          Aclaración: los datos brindados en este formulario no constituyen una
          denuncia formal.
        </span>
        <button className={cx("submit-btn")}>Cargar la información</button>
      </div>

      <div className={cx("function")}>
        <span className={cx("function-title")}>
          ¿Qué infracciones podés detectar?
        </span>

        <ul className={cx("function-list")}>
          <li className={cx("function-item")}>
            <Image
              src={images.noImage}
              className={cx("function-icon")}
              alt="function-icon"
            />
            <span className={cx("function-item-title")}>
              Envases y etiquetas
            </span>
            <span className={cx("function-item-content")}>TBD</span>
          </li>

          <li className={cx("function-item")}>
            <Image
              src={images.noImage}
              className={cx("function-icon")}
              alt="function-icon"
            />
            <span className={cx("function-item-title")}>Anuncios</span>
            <span className={cx("function-item-content")}>TBD</span>
          </li>

          <li className={cx("function-item")}>
            <Image
              src={images.noImage}
              className={cx("function-icon")}
              alt="function-icon"
            />
            <span className={cx("function-item-title")}>Stands</span>
            <span className={cx("function-item-content")}>TBD</span>
          </li>

          <li className={cx("function-item")}>
            <Image
              src={images.noImage}
              className={cx("function-icon")}
              alt="function-icon"
            />
            <span className={cx("function-item-title")}>
              Material promocional{" "}
            </span>
            <span className={cx("function-item-content")}>TBD</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Check;
