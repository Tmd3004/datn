import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import Styles from "./Verified.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import Image from "../../../components/Image/Image";
import images from "../../../assets/images/images";
import { ImLink } from "react-icons/im";
import { Link } from "react-router-dom";

const cx = classNames.bind(Styles);

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const Verified = () => {
  const scrollContainerRef = useRef(null);
  const headersRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    const scrollContainer = scrollContainerRef.current;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainer.offsetLeft);
    setScrollLeft(scrollContainer.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const scrollContainer = scrollContainerRef.current;
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 1;
    scrollContainer.scrollLeft = scrollLeft - walk;
    headersRef.current.scrollLeft = scrollContainer.scrollLeft;
  };

  const handleScroll = () => {
    headersRef.current.scrollLeft = scrollContainerRef.current.scrollLeft;
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSelectChange = (selectOption) => {
    console.log(selectOption);
  };

  return (
    <div className={cx("wrapper")}>
      <span className={cx("title")}>Explorá las denuncias ciudadanas</span>
      <span className={cx("content")}>
        Esta sección presenta un{" "}
        <b>listado de denuncias ciudadanas verificadas</b> por nuestros
        expertos. Aquí no solo encontrarás anuncios digitales, sino también,
        acciones en vía pública, material promocional, etiquetado y envases,
        medios de comunicación tradicionales (como TV o radio), instituciones de
        salud o congresos científicos.
        <br />
        <br />
        <b>Navegá por la tabla</b>{" "}
        hacia la derecha para ver todas las columnas y utilizá los filtros para
        realizar búsquedas específicas.
      </span>

      <div className={cx("filter")}>
        <span className={cx("filter-title")}>Filtros:</span>
        <div className={cx("filter-content")}>
          <div className={cx("search")}>
            <input
              type="text"
              className={cx("search-input")}
              placeholder="Búsqueda"
            />
            <AiOutlineSearch className={cx("search-icon")} />
          </div>

          <CustomSelect
            options={options}
            onChange={handleSelectChange}
            placeHolder="Compañía"
          />
          <CustomSelect
            options={options}
            onChange={handleSelectChange}
            placeHolder="Marca"
          />
          <CustomSelect
            options={options}
            onChange={handleSelectChange}
            placeHolder="Infracción CICSML"
          />
          <CustomSelect
            options={options}
            onChange={handleSelectChange}
            placeHolder="Infracción Leg. Arg."
          />

          <button className={cx("apply-btn")}>Aplicar</button>
        </div>
      </div>

      <div className={cx("display")}>
        <span className={cx("filter-title")}>Mostra:</span>
        <select className={cx("select-input")}>
          <option defaultValue={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <button className={cx("apply-btn")}>Descargar Excel</button>
      </div>

      <div className={cx("table-container")}>
        <div className={cx("col-left")}>
          <table className={cx("tbdata", "col-table")}>
            <thead className={cx("col-thead")}>
              <tr>
                <th with="2%" className={cx("left-table-title")}>
                  N°
                </th>
                <th with="12%" className={cx("left-table-title")}>
                  Revisión
                </th>
                <th with="12%" className={cx("left-table-title")}>
                  Compañía
                </th>
                <th with="12%" className={cx("left-table-title")}>
                  Marca
                </th>
                <th with="15%" className={cx("left-table-title")}>
                  Contenido
                </th>
                <th with="15%" className={cx("left-table-title")}>
                  Imagen
                </th>
              </tr>
            </thead>

            <tbody className={cx("tbdata")}>
              <tr className={cx("tr-boder")}>
                <td>1</td>
                <td>
                  <p className={cx("reviewed")}>Revisada</p>
                </td>
                <td></td>
                <td></td>
                <td className={cx("content-tb")}>
                  <p className={cx("updata-form")}>
                    {`gengen_lacaze bellamysorganic Paid partnership A day in my
                      current life. Training is ramping up and juggling a little
                      one can be a fun distraction. The main worry I have as a mum
                      is making sure Archer is always getting enough nutrients in
                      his daily intake. @bellamysorganic Toddler Milk is the start
                      and end to most of Archer’s days which helps me rest easy
                      knowing he is getting advanced premium nutrient dense milk
                      to support an active toddler.” #ad #BellamysOrganic
                      #APureStartToLife #LittleWins`.slice(0, 120) + "..."}
                  </p>
                </td>
                <td>
                  <div className={cx("tb-image")}>
                    <Image
                      src={images.noImage}
                      alt="content-img"
                      className={cx("td-img", "content-img")}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={cx("col-right")}>
          <div className={cx("headers")}>
            <div
              className={cx("scroller", "syncscroll ", "scroll_same_time")}
              ref={headersRef}
            >
              <div className={cx("track")}>
                <div className={cx("heading")}>
                  <p>Fecha</p>
                </div>
              </div>

              <div className={cx("track", "track-link")}>
                <div className={cx("heading")}>
                  <p>Link</p>
                </div>
              </div>

              <div className={cx("track", "track-three")}>
                <div className={cx("heading-three")}>
                  <p>CICSLM</p>
                </div>
                <div className={cx("heading-three-title")}>
                  <div className={cx("th-title-right-three")}>
                    <p className={cx("status-title")}>Infracción</p>
                  </div>

                  <div className={cx("th-title-right-three")}>
                    <p>Artículos</p>
                  </div>

                  <div className={cx("th-title-right")}>
                    <p>Tipo de Infracción</p>
                  </div>
                </div>
              </div>

              <div className={cx("track", "track-three")}>
                <div className={cx("heading-three")}>
                  <p>Legislación Argentina</p>
                </div>
                <div className={cx("heading-three-title")}>
                  <div className={cx("th-title-right-three")}>
                    <p className={cx("status-title")}>Infracción</p>
                  </div>

                  <div className={cx("th-title-right-three")}>
                    <p>Artículos</p>
                  </div>

                  <div className={cx("th-title-right-three")}>
                    <p>Tipo de Infracción</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className={cx("tracks", "syncscroll", "container-scroll", {
              grabbing: isDragging,
            })}
          >
            <div className={cx("scroll-table")}>
              <div className={cx("track")}>
                <div className={cx("entry")}>
                  <p className={cx("date")}>07-22-2024</p>
                </div>
              </div>

              <div className={cx("track", "track-link")}>
                <div className={cx("entry")}>
                  <Link to="/" className={cx("link-item")}>
                    <ImLink className={cx("link-icon")} />
                  </Link>
                </div>
              </div>

              <div className={cx("track-three")}>
                <div className={cx("entry-three")}>
                  <div className={cx("entry-title")}>
                    <p className={cx("status-title", "violation-color")}>
                      Detectada
                    </p>
                  </div>

                  <div className={cx("style-code--article")}>
                    <div className={cx("updata-form")}>5.1</div>
                    <div className={cx("updata-form")}>9.1 + 9.2, 4.2</div>
                  </div>

                  <div
                    className={cx(
                      "entry-title-threee",
                      "entry-title-tyle",
                      "style-violation-type"
                    )}
                  >
                    <div className={cx("updata-form")}>
                      Promotion to the public
                    </div>
                    <div className={cx("updata-form", "violation-1")}>
                      Message, information, educational materials, and labeling
                    </div>
                    <div className={cx("updata-form", "violation-2")}>
                      Nutrition or health claims
                    </div>
                  </div>
                </div>
              </div>

              <div className={cx("track-three")}>
                <div className={cx("entry-three")}>
                  <div className={cx("entry-title")}>
                    <p className={cx("status-title", "violation-color")}>
                      Detectada
                    </p>
                  </div>

                  <div className={cx("style-code--article")}>
                    <div className={cx("updata-form")}>5.1</div>
                    <div className={cx("updata-form")}>9.1 + 9.2, 4.2</div>
                  </div>

                  <div
                    className={cx(
                      "entry-title-threee",
                      "entry-title-tyle",
                      "style-violation-type"
                    )}
                  >
                    <div className={cx("updata-form")}>
                      Promotion to the public
                    </div>
                    <div className={cx("updata-form", "violation-1")}>
                      Message, information, educational materials, and labeling
                    </div>
                    <div className={cx("updata-form", "violation-2")}>
                      Nutrition or health claims
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verified;
