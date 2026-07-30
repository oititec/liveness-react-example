import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Navbar, Row, Button, Modal } from "react-bootstrap";
import { Routes, Route, useNavigate, useLocation, HashRouter as Router, } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@material-design-icons/font";
import "./assets/css/styles.css";

import { Login } from "./login";
import { AppKey } from "./appkey";
import { Home } from "./home";
import { Liveness2D } from "./liveness-2d";
import { Liveness3D } from "./liveness-3d";
import { SendDocuments } from "./send-documents";
import { SendDigitalCNH } from "./send-digital-cnh";
import { LivenessIproov } from './liveness-iproov';
import { Facetecv10 } from "./facetec-v10";
import { Fortface } from "./fortface"
import { facecaptchaService } from './backend/facecaptcha-service';

import LogoCertiFace from "./assets/img/logo_certiface_trans.png";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [exibirBotoesMenu, setExibirBotoesMenu] = useState(false);
  const [exibirBotaoResult, setExibirBotaoResult] = useState(false);

  const [statusAppkey, setStatusAppkey] = useState('');

  const [result, setResult] = useState({
    success: false,
    message: '',
    data: null
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const url = location.pathname;

    setExibirBotoesMenu(url === '/home');

    setExibirBotaoResult(
      ['/liveness-2d', '/liveness-3d', '/liveness-iproov', '/facetec-v10', '/fortface']
        .includes(url)
    );
  }, [location]);

  const limparLocalStorage = () => {
    localStorage.removeItem('hasLiveness');
    localStorage.removeItem('appkey');
    localStorage.removeItem('cpf');
    localStorage.removeItem('nome');
    localStorage.removeItem('nascimento');
  };

  const gerarAppKey = async () => {
    try {
      const cpf = localStorage.getItem('cpf');
      const nome = localStorage.getItem('nome');
      const nascimento = localStorage.getItem('nascimento');

      const res = await facecaptchaService.gerarAppkey(cpf, nome, nascimento);

      localStorage.setItem('appkey', res.data.appkey);
      localStorage.removeItem('hasLiveness');

      setExibirBotaoResult(false);
      setStatusAppkey('AppKey gerada!');
    } catch (error) {
      setStatusAppkey('Sessão expirada!');
    }
  };

  const alterarDados = () => {
    limparLocalStorage();
    navigate('/appkey');
  };

  const novaSessao = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('senhaMd5');
    localStorage.removeItem('credentialResponse');
    limparLocalStorage();
    navigate('/');
  };

  const abrirModal = async () => {
    try {
      const appkey = localStorage.getItem('appkey');

      const res = await facecaptchaService.getLivenessResult(appkey);
      console.log(res)

      setResult({
        success: true,
        message: 'Resultado obtido com sucesso',
        data: res.data
      });

      setShowModal(true);
    } catch (error) {
      setResult({
        success: false,
        message: 'Liveness não executado!',
        data: null
      });
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={LogoCertiFace}
              alt="Logo CertiFace"
              style={{ width: "150px" }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-menu" />

          <Navbar.Collapse id="navbar-menu" className="justify-content-end">

            {exibirBotoesMenu && (
              <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 mt-3 mt-lg-0">

                {statusAppkey && (
                  <span className="me-lg-3">
                    <strong>{statusAppkey}</strong>
                  </span>
                )}

                <button
                  className="btn btn-success btn-rounded"
                  onClick={gerarAppKey}
                >
                  Gerar nova AppKey
                </button>

                <button
                  className="btn btn-success btn-rounded"
                  onClick={alterarDados}
                >
                  Alterar dados
                </button>

                <button
                  className="btn btn-success btn-rounded"
                  onClick={novaSessao}
                >
                  Nova sessão
                </button>

              </div>
            )}

            {exibirBotaoResult && (
              <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 mt-3 mt-lg-0">

                {result.message && (
                  <span className="me-lg-3">
                    <strong>{result.message}</strong>
                  </span>
                )}

                <button
                  className="btn btn-success btn-rounded"
                  onClick={abrirModal}
                >
                  Obter Resultado
                </button>

              </div>
            )}

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/appkey" element={<AppKey />} />
          <Route path="/home" element={<Home />} />
          <Route path="/liveness-2d" element={<Liveness2D />} />
          <Route path="/liveness-3d" element={<Liveness3D />} />
          <Route path="/facetec-v10" element={<Facetecv10 />} />
          <Route path="/liveness-iproov" element={<LivenessIproov />} />
          <Route path="/fortface" element={<Fortface />} />
          <Route path="/send-documents" element={<SendDocuments />} />
          <Route path="/send-digital-cnh" element={<SendDigitalCNH />} />
        </Routes>
      </Container>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="modal-result"
      >
        <Modal.Header className="custom-modal-header">
          <h2>Resultado Liveness</h2>

          <Button
            className="btn btn-success btn-rounded"
            onClick={() => setShowModal(false)}
          >
            Fechar
          </Button>
        </Modal.Header>

        <Modal.Body>
          {result.data && (
            <pre className="result-json">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default App;
