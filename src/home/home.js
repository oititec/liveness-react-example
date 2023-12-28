import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Liveness2D from '../assets/img/liveness-2d.png';
import ChevronRight from '../assets/img/chevron-right.png';

const Home = () => {
  useEffect(() => {
    window.localStorage.removeItem('apiType');
    window.localStorage.removeItem('appkey');
    window.localStorage.removeItem('ticket');
    window.localStorage.removeItem('errorMessage');
    window.localStorage.removeItem('hasLiveness');
  }, []);

  return (
    <Row>
      <Col xs={12}>
        <h1 className="my-4 text-center">
          Para usar a aplicação, por favor escolha a API que será utilizada.
        </h1>
      </Col>
      <Col xs={12}>
        <Link
          to="/flexible-api"
          className="btn btn-outline-secondary d-block mb-3"
        >
          <Row>
            <Col xs={'auto'} className="d-flex align-items-center">
              <img src={Liveness2D} alt="" aria-hidden="true" />
            </Col>
            <Col xs>
              <h2>Certiface API</h2>
              {/* <h3>Lorem ipsum dollor sit amet</h3> */}
            </Col>
            <Col xs={'auto'} className="d-flex align-items-center">
              <img src={ChevronRight} alt="" aria-hidden="true" />
            </Col>
          </Row>
        </Link>
      </Col>
      <Col xs={12}>
        <Link
          to="/global-api"
          className="btn btn-outline-secondary d-block mb-3"
        >
          <Row>
            <Col xs={'auto'} className="d-flex align-items-center">
              <img src={Liveness2D} alt="" aria-hidden="true" />
            </Col>
            <Col xs>
              <h2>Global API</h2>
              {/* <h3>Lorem ipsum dollor sit amet</h3> */}
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
