import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Liveness2D from '../assets/img/liveness-2d.png';
import Liveness3D from '../assets/img/liveness-3d.png';
import SendDocuments from '../assets/img/send-documents.png';
import ChevronRight from '../assets/img/chevron-right.png';

const Home = () => {
  return (
    <Row>
      <Col xs={12}>
        <h1 className="my-4 text-center">
          Selecione a demonstração que deseja testar.
        </h1>
      </Col>
      <Col xs={12}>
        <Link
          to="/liveness-2d"
          className="btn btn-outline-secondary d-block mb-3"
        >
          <Row>
            <Col xs={'auto'} className="d-flex align-items-center">
              <img src={Liveness2D} alt="" aria-hidden="true" />
            </Col>
            <Col xs>
              <h2>Liveness 2D</h2>
              <h3>Verificação facial utilizando o módulo FaceCaptcha.</h3>
            </Col>
            <Col xs={'auto'} className="d-flex align-items-center">
              <img src={ChevronRight} alt="" aria-hidden="true" />
            </Col>
          </Row>
        </Link>
      </Col>
      <Col xs={12}>
        <Link
          to="/liveness-3d"
          className="btn btn-outline-secondary d-block mb-3"
        >
          <Row>
            <Col xs={'auto'} className="d-flex align-items-center">
              <img src={Liveness3D} alt="" aria-hidden="true" />
            </Col>
            <Col xs>
              <h2>Liveness 3D</h2>
              <h3>Interação da face em tempo real.</h3>
            </Col>
            <Col xs={'auto'} className="d-flex align-items-center">
              <img src={ChevronRight} alt="" aria-hidden="true" />
            </Col>
          </Row>
        </Link>
      </Col>
      <Col xs={12}>
        <Link
          to="/send-documents"
          className={`btn btn-outline-secondary d-block mb-3 ${
            window.localStorage.getItem('appkey') ? '' : 'disabled'
          }`}
        >
          <Row>
            <Col xs={'auto'} className="d-flex align-items-center">
              <img src={SendDocuments} alt="" aria-hidden="true" />
            </Col>
            <Col xs>
              <h2>Envio de documentos</h2>
              <h3>Captura e análise de documentos.</h3>
              {window.localStorage.getItem('appkey') ? (
                ''
              ) : (
                <p className="m-0">
                  *Para utilizar o envio de documentos, faça uma prova de vida
                  (Liveness 2D ou 3D) antes.
                </p>
              )}
            </Col>
            <Col xs={'auto'} className="d-flex align-items-center">
              <img src={ChevronRight} alt="" aria-hidden="true" />
            </Col>
          </Row>
        </Link>
      </Col>
    </Row>
  );
};

export default Home;
