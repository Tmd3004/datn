import React from "react";
import classNames from "classnames/bind";
import Styles from "./Recommendation.module.scss";
import Image from "../../../components/Image/Image";
import images from "../../../assets/images/images";
import CustomSlider from "../../../components/CustomSlider/CustomSlider";

const cx = classNames.bind(Styles);

const Recommendation = () => {
  return (
    <div className={cx("wrapper")}>
      <span className={cx("title")}>Sobre esta iniciativa </span>
      <span className={cx("desc")}>
        En esta sección encontrarás <b>conceptos claves</b> sobre los sucedáneos
        de la leche materna, el impacto del marketing digital en la lactancia, y
        los objetivos de esta iniciativa ante la problemática presentada.
      </span>

      <div className={cx("content-item-wrapper")}>
        <Image
          src={images.illustration3}
          className={cx("content-item-img")}
          alt="about-img"
        />

        <div className={cx("content-item")}>
          <span className={cx("content-title")}>¿Qué son los sucedáneos?</span>
          <span className={cx("content-item-text")}>
            <b>Los sucedáneos de la leche materna</b> son todo tipo de fórmulas
            comerciales, u otro tipo de alimento, presentado como sustitutivo
            parcial o total de la leche materna, que se comercialice
            específicamente para{" "}
            <b>
              alimentar a lactantes y niños y niñas de hasta tres años de edad.
            </b>
          </span>
        </div>
      </div>

      <div className={cx("content-item-code")}>
        <span className={cx("content-title")}>¿Qué son los sucedáneos?</span>
        <span className={cx("content-item-text")}>
          El "Código Internacional de Comercialización de Sucedáneos de la Leche
          Materna" fue adoptado por la Asamblea Mundial de la Salud en 1981 como{" "}
          <b>
            respuesta a la preocupación existente respecto de la
            comercialización inapropiada de los sucedáneos de la leche humana y
            el incremento de la mortalidad infantil.
          </b>{" "}
          En estos más de 40 años, resoluciones posteriores de la Asamblea
          Mundial de la Salud lo han mantenido actualizado. Estas resoluciones
          se consideran parte integrante del Código.
        </span>
        <span className={cx("content-item-text")}>
          Resumidamente el Código establece que:
        </span>
        <ul className={cx("content-item-list")}>
          <li className={cx("content-item-item")}>
            se <b>prohíbe todo tipo de publicidad</b> al público, incluyendo
            estrategias de marketing como entrega de muestras gratis,
            descuentos, promoción cruzada, actividades de asesoría a las
            familias por parte de representantes de las empresas
          </li>
          <li className={cx("content-item-item")}>
            se{" "}
            <b>
              prohíbe la promoción de productos en los establecimientos de
              salud,
            </b>{" "}
            incluida la recepción de donaciones
          </li>
          <li className={cx("content-item-item")}>
            se{" "}
            <b>prohíben los obsequios y muestras a trabajadores sanitarios,</b>{" "}
            así como el auspicio de entidades profesionales y reuniones
            científicas
          </li>
          <li className={cx("content-item-item")}>
            en las <b>etiquetas</b> de los envases,{" "}
            <b>
              se prohíbe el uso de imágenes de bebés y palabras o imágenes que
              idealicen la alimentación artificial
            </b>{" "}
            y se debe anunciar los beneficios de la lactancia humana
          </li>
        </ul>
        <span className={cx("content-item-text")}>
          El Código, además de los sucedáneos,{" "}
          <b>
            regula también el marketing de mamaderas y tetinas y de alimentos
            complementarios con exceso de nutrientes críticos
          </b>{" "}
          (azúcares añadidos, sodio y grasas totales/saturadas).
        </span>
      </div>

      <div className={cx("content-item-wrapper")}>
        <Image
          src={images.illustration4}
          className={cx("content-item-img")}
          alt="about-img"
        />

        <div className={cx("content-item")}>
          <span className={cx("content-title")}>
            Impacto del marketing en la lactancia
          </span>
          <span className={cx("content-item-text")}>
            Hoy en día la publicidad digital es la forma dominante de marketing.
            En muchos sentidos resulta más poderosa que las formas tradicionales
            y su monitoreo es más complejo, ya que las empresas utilizan
            múltiples canales digitales para llegar a los/as consumidores/as y
            dirigir contenidos personalizados de acuerdo a la huella digital
            individual. Al mismo tiempo, las redes sociales fomentan nuevas
            estrategias que no son reconocibles como publicidad, incluidas
            clubes de bebés en línea, servicios de asesoramiento e influencers
            pagos.
          </span>
          <b style={{ padding: "2rem 0" }}>
            A través del marketing digital las empresas explotan los temores de
            los y las responsables de la crianza, influyen en las normas
            sociales y distorsionan el acceso del público a información veraz y
            confiable sobre alimentación infantil.
          </b>
          <span className={cx("content-item-text")}>
            Se ha documentado una asociación entre la exposición al marketing
            digital y una menor exclusividad y duración del amamantamiento. El
            uso innecesario de estos productos tiene consecuencias en el estado
            nutricional y de salud de lactantes, de sus madres, a la vez que
            posee impactos económicos y ambientales desfavorables.
          </span>
        </div>
      </div>

      <div className={cx("content-item-bg--wrapper")}>
        <Image
          src={images.illustration5}
          className={cx("content-item-bg--img")}
          alt="about-img"
        />

        <div className={cx("content-item-bg")}>
          <span className={cx("content-item-bg--title")}>
            Datos de Argentina del impacto del marketing en la lactancia
          </span>
          <span className={cx("content-item-bg--text")}>
            Una investigación realizada en Argentina por CESNI con el apoyo de
            UNICEF Argentina en el año 2023 documentó que ver publicidad de
            fórmulas infantiles en internet o redes sociales duplica la
            probabilidad de compra y que la publicidad de fórmulas infantiles
            genera en madres y padres la necesidad de cambiar la forma de
            alimentación de sus hijas e hijos, siendo este sentimiento más
            frecuente en madres y padres de menor nivel educativo.
          </span>
        </div>
      </div>

      <div className={cx("content-item-code")}>
        <span className={cx("content-title")}>
          Objetivo de [NOMBRE DEL SITIO]
        </span>
        <span className={cx("content-item-text")}>
          Teniendo en cuenta que el marketing de fórmulas comerciales infantiles
          no sólo constituye infracciones al Código sino también de la
          legislación argentina en materia publicitaria referida a sucedáneos,
          esta iniciativa se propone la{" "}
          <b>
            implementación de una herramienta de inteligencia artificial para el
            monitoreo de incumplimientos en el entorno digital,
          </b>{" "}
          y en el desarrollo de insumos (bancos de recursos, reportes de
          sistematización de evidencia y análisis legal de incumplimientos,
          entre otros){" "}
          <b>
            para desarrollar acciones de comunicación, abogacía e incidencia
            legislativa.
          </b>
        </span>
      </div>

      <div className={cx("slider")}>
        <span className={cx("slider-title")}>Apoyan esta iniciativa</span>
        <CustomSlider />
      </div>
    </div>
  );
};

export default Recommendation;
