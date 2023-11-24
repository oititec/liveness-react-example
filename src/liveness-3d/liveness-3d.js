import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FacetecLogo from '../assets/img/FaceTec_Logo.png';
import { SampleApp } from './sample-app';

const Liveness3D = () => {
  const showLiveness3D = () => {
    SampleApp.onLivenessCheckPressed();
  };

  // Caso o usuário tenha algum problema, este método excluirá a appkey e o jogará de volta para a home
  const deleteAppKey = () => {
    window.localStorage.removeItem('apiType');
    window.localStorage.removeItem('appkey');
    window.localStorage.removeItem('ticket');
    window.localStorage.removeItem('errorMessage');
    window.localStorage.removeItem('hasLiveness');

    window.location.href = '/';
  };

  useEffect(() => {
    SampleApp.getProductionKey();
  }, []);

  return (
    <Row>
      <Col xs={12} className="mt-4">
        <Link to="/">Voltar</Link>
      </Col>
      <Col xs={12} className="my-4">
        <div className="wrapping-box-container">
          <div id="controls" className="controls">
            <Button
              id="liveness-button"
              variant="primary"
              className="btn-rounded"
              onClick={() => showLiveness3D()}
            >
              3D Liveness Check
            </Button>
            <p id="status" className="mt-2">
              {SampleApp.status}
            </p>
            <hr />
            <div id="custom-logo-container">
              <img src={FacetecLogo} alt="Logo Facetec" />
            </div>
          </div>
        </div>
      </Col>
      <Col xs={12} className="text-center">
        <Button
          id="delete-appkey"
          variant="link"
          onClick={() => deleteAppKey()}
        >
          Em caso de problemas, clique aqui
        </Button>
      </Col>
    </Row>
  );
};

export default Liveness3D;
