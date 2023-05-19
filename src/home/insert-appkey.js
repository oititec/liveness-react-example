import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

const InsertAppKey = () => {
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
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
        setErrorMessage(error.response.data.error);
      });
  };

  return (
    <Row>
      <Col xs={12}>
        <h1 className="my-4 text-center">
          Para usar a aplicação, por favor insira uma AppKey válida.
        </h1>
      </Col>
      <Col xs={12}>
        <Row>
          <Col xs={10}>
            <Form.Control type="text" id="txt-appkey" onChange={handleAppKey} />
          </Col>
          <Col xs={2}>
            <Button
              variant="primary"
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

export default InsertAppKey;
