import React from "react";
import classNames from "classnames/bind";
import Styles from "./ResourceCenter.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import Image from "../../../components/Image/Image";
import images from "../../../assets/images/images";
import { ImLink } from "react-icons/im";
import { Link } from "react-router-dom";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const cx = classNames.bind(Styles);

const ResourceCenter = () => {
  const handleSelectChange = (selectOption) => {
    console.log(selectOption);
  };

  return (
    <div className={cx("wrapper")}>
      <span className={cx("title")}>Centro de recursos</span>
      <span className={cx("content")}>
        Explorá nuestra <b>biblioteca de documentos</b> sobre el Código
        Internacional de Comercialización de Sucedáneos de Leche Materna, la
        legislación argentina y recursos de organizaciones que evidencian la
        importancia de la lactancia humana.
      </span>

      <div className={cx("filter")}>
        <div className={cx("filter-content")}>
          <div className={cx("search")}>
            <input
              type="text"
              className={cx("search-input")}
              placeholder="BúsquedaBuscar por palabra clave"
            />
            <AiOutlineSearch className={cx("search-icon")} />
          </div>

          <CustomSelect
            options={options}
            onChange={handleSelectChange}
            placeHolder="Temática"
          />
          <CustomSelect
            options={options}
            onChange={handleSelectChange}
            placeHolder="Autor"
          />

          <button className={cx("apply-btn")}>Aplicar</button>
        </div>
      </div>

      <div className={cx("table-container")}>
        <table className={cx("table-content")}>
          <thead className={cx("thead-content")}>
            <tr className={cx("tr-content")}>
              <td width="15%" className={cx("table-title", "first-head-content")}>Temática</td>
              <td width="20%" className={cx("table-title")}>Portada</td>
              <td width="15%" className={cx("table-title")}>Nombre</td>
              <td width="10%" className={cx("table-title")}>Autor</td>
              <td width="30%" className={cx("table-title")}>Reseña</td>
              <td width="10%" className={cx("table-title", "last-head-content")}>Link</td>
            </tr>
          </thead>
          <tbody className={cx("tbody-content")}>
          <tr>
              <td></td>
              <td>
                <div className={cx("tb-image")}>
                  <Image
                    src={images.noImage}
                    alt="content-img"
                    className={cx("td-img", "content-img")}
                  />
                </div>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <Link to="/" className={cx("link-item")}>
                  <ImLink className={cx("link-icon")} />
                </Link>
              </td>
            </tr>

            <tr>
              <td className={cx("first-body-content")}></td>
              <td>
                <div className={cx("tb-image")}>
                  <Image
                    src={images.noImage}
                    alt="content-img"
                    className={cx("td-img", "content-img")}
                  />
                </div>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td className={cx("last-body-content")}>
                <Link to="/" className={cx("link-item")}>
                  <ImLink className={cx("link-icon")} />
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceCenter;
