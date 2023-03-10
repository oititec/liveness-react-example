import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FacetecLogo from '../assets/img/FaceTec_Logo.png';
import { SampleApp } from './sample-app';

const Liveness3D = () => {
  const showLiveness3D = () => {
    SampleApp.onLivenessCheckPressed();
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
              // disabled
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
    </Row>
  );
};

export default Liveness3D;
