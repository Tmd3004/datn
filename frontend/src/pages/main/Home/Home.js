import React, { useRef } from "react";
import classNames from "classnames/bind";
import Styles from "./Home.module.scss";
import Image from "../../../components/Image/Image";
import images from "../../../assets/images/images";

const cx = classNames.bind(Styles);

const Home = () => {
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("banner")}>
        <span className={cx("banner-title")}>
          Protección contra el marketing en la lactancia
        </span>
        <span className={cx("banner-content")}>
          En [NOMBRE] utilizamos Inteligencia Artificial y supervisión experta
          para aportar en la protección de la lactancia humana contra el
          marketing. Explorá cómo ayudamos a generar evidencia para exigir el
          cumplimiento de las normativas que resguardan el derecho a la
          información de las personas que amamantan.
        </span>
        <button className={cx("banner-btn")} onClick={scrollToSection}>
          Descubrir
        </button>
      </div>

      <div className={cx("about")}>
        <Image
          src={images.illustration1}
          className={cx("about-img")}
          alt="about-img"
        />

        <div className={cx("about-content")}>
          <span className={cx("about-title")}>Sobre esta iniciativa</span>
          <span className={cx("about-content-text")}>
            Esta plataforma surge de la necesidad de proteger el derecho a la
            información sobre lactancia en el entorno digital y de exigir que
            las normativas nacionales e internacionales vigentes se respeten.
          </span>
          <span className={cx("about-content-text")}>
            Las infracciones pueden pasar desapercibidas afectando a las
            decisiones de las personas que amamantan. Contar con una herramienta
            de inteligencia artificial de detección de anuncios es fundamental
            para monitorear y reportar estas infracciones de manera eficiente y
            precisa, promoviendo un entorno más seguro para la lactancia
            respaldado por la legislación argentina.
          </span>
          <button className={cx("banner-btn")}>Saber más</button>
        </div>
      </div>

      <div className={cx("function")} ref={sectionRef}>
        <span className={cx("function-title")}>
          Cómo funciona [NOMBRE DEL SITIO]
        </span>

        <ul className={cx("function-list")}>
          <li className={cx("function-item")}>
            <div className={cx("img-container")}>
              <Image
                src={images.function1}
                className={cx("function-icon")}
                alt="function-icon"
              />
            </div>
            <span className={cx("function-item-title")}>
              Detección de Infracciones con IA
            </span>
            <span className={cx("function-item-content")}>
              Mediante{" "}
              <span className={cx("text-special")}>
                inteligencia artificial
              </span>{" "}
              (IA) se detecta y advierte sobre infracciones en la publicidad de
              sucedáneos de la leche humana y otros productos, como mamaderas y
              tetinas.
            </span>
          </li>

          <li className={cx("function-item")}>
            <div className={cx("img-container")}>
              <img
                src="/images/vision.svg"
                className={cx("function-icon")}
                alt="function-icon"
                style={{ fill: "#146482"}}
              />
            </div>
            <span className={cx("function-item-title")}>
              Verificación y monitoreo continuo
            </span>
            <span className={cx("function-item-content")}>
              Un equipo de expertos supervisa las infracciones detectadas
              mediante la inteligencia artificial y las denuncias cargadas por
              los usuarios.
              <br />
              ¡Vos también podés{" "}
              <span className={cx("text-special")}>sumar tu denuncia</span> para
              que sea evaluada!
            </span>
          </li>

          <li className={cx("function-item")}>
            <div className={cx("img-container")}>
              <img
                src="/images/quote-request.svg"
                className={cx("function-icon")}
                alt="function-icon"
              />
            </div>
            <span className={cx("function-item-title")}>Base de Recursos</span>
            <span className={cx("function-item-content")}>
              Un{" "}
              <span className={cx("text-special")}>
                repositorio de documentos
              </span>{" "}
              clave sobre el Código Internacional de Comercialización de
              Sucedáneos de Leche Materna, legislación argentina y recursos de
              la OMS, UNICEF y The Lancet para promover y proteger la lactancia.
            </span>
          </li>

          <li className={cx("function-item")}>
            <div className={cx("img-container")}>
              <img
                src="/images/penalty.svg"
                className={cx("function-icon")}
                alt="function-icon"
              />
            </div>
            <span className={cx("function-item-title")}>Datos y evidencia</span>
            <span className={cx("function-item-content")}>
              Como resultado, esta herramienta proporciona datos detallados y
              evidencia sólida derivada de la investigación y el monitoreo,
              apoyando la formulación de políticas públicas y la defensa de la
              lactancia humana.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
