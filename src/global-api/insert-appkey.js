import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InsertAppKeyGlobal = () => {
  const navigate = useNavigate();

  const [appkey, setAppkey] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAppKey = (e) => {
    setAppkey(e.target.value);
  };

  const setAppKeyValue = () => {
    setLoading(true);

    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/facecaptcha/service/captcha/checkauth?appkey=${appkey}`
      )
      .then((e) => {
        window.localStorage.setItem('appkey', appkey);

        setTimeout(() => {
          navigate('/nav-menu');
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
        setErrorMessage(error.response.data.error);
      });
  };

  useEffect(() => {
    window.localStorage.setItem('apiType', 'global-api');
  }, []);

  return (
    <Row>
      <Col xs={12}>
        <h1 className="my-4 text-center">
          Para usar a aplicação usando a API Global, por favor insira
          <br />
          uma AppKey válida.
        </h1>
      </Col>
      <Col xs={12}>
        <Row>
          <Col xs={10}>
            <Form.Control
              type="text"
              id="txt-appkey"
              onChange={handleAppKey}
              placeholder="Insira a AppKey aqui"
            />
          </Col>
          <Col xs={2}>
            <Button
              variant="primary"
              className="w-100"
              onClick={() => setAppKeyValue()}
              disabled={loading}
            >
              {loading ? 'Carregando' : 'Continuar'}
            </Button>
          </Col>
          {error && <Col xs={12}>{errorMessage}</Col>}
        </Row>
      </Col>
    </Row>
  );
};

export default InsertAppKeyGlobal;
