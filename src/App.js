import React from 'react';
import { Col, Container, Navbar, Row } from 'react-bootstrap';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@material-design-icons/font';
import './assets/css/styles.css';
import { Home } from './home';
import LogoOiti from './assets/img/logo-oiti.png';
import { Liveness2D } from './liveness-2d';
import { Liveness3D } from './liveness-3d';
import { SendDocuments } from './send-documents';
import { LivenessIproov } from './liveness-iproov';

const App = () => {
  return (
    <Container fluid className="p-0">
      <Row>
        <Col xs={12} className="px-0">
          <Navbar bg="light">
            <Container>
              <Navbar.Brand href="/">
                <img src={LogoOiti} alt="Logo Oiti" />
              </Navbar.Brand>
            </Container>
          </Navbar>
        </Col>
      </Row>
      <Container>
        <Router>
          <Routes>
            <Route element={<Home />} path="/" exact />
            <Route element={<Liveness2D />} path="/liveness-2d" />
            <Route element={<Liveness3D />} path="/liveness-3d" />
            <Route element={<SendDocuments />} path="/send-documents" />
            <Route element={<LivenessIproov />} path="/liveness-iproov" />
          </Routes>
        </Router>
      </Container>
    </Container>
  );
};

export default App;
