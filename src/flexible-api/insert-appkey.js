import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InsertAppKeyFlexible = () => {
  const navigate = useNavigate();

  const [appkey, setAppkey] = useState('');
  const [ticket, setTicket] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAppKey = (e) => {
    setAppkey(e.target.value);
  };

  const handleTicket = (e) => {
    setTicket(e.target.value);
  };

  const setAppKeyValue = () => {
    setLoading(true);

    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/facecaptcha/service/captcha/checkauth?appkey=${appkey}`
      )
      .then((e) => {
        // O código abaixo é apenas um exemplo para validar se o ticket é válido e está ativo.
        // Não deve ser implementado no front de maneira alguma.
        axios
          .get(
            `${process.env.REACT_APP_FLEXIBLE_API_URL}/bff-demo/result/${
              ticket !== '' ? ticket : 'undefined'
            }`,
            {
              headers: {
                'x-sub-org': '1',
                'x-group': '1',
                'x-branch': '1',
              },
            }
          )
          .then((res) => {
            console.log(res);

            setError(true);

            window.localStorage.setItem('appkey', appkey);
            window.localStorage.setItem('ticket', ticket);

            setTimeout(() => {
              navigate('/nav-menu');
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            setError(true);
            setErrorMessage(error.response.data.message);
          });
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
        setErrorMessage(error.response.data.error);
      });
  };

  useEffect(() => {
    window.localStorage.setItem('apiType', 'flexible-api');
  }, []);

  return (
    <Row>
      <Col xs={12}>
        <h1 className="my-4 text-center">
          Para usar a aplicação usando a Certiface API, por favor insira
          <br />
          uma AppKey e um Ticket válidos.
        </h1>
      </Col>
      <Col xs={12}>
        <Row>
          <Col xs={5}>
            <Form.Control
              type="text"
              id="txt-appkey"
              onChange={handleAppKey}
              placeholder="Insira a AppKey aqui"
            />
          </Col>
          <Col xs={5}>
            <Form.Control
              type="text"
              id="txt-ticket"
              onChange={handleTicket}
              placeholder="Insira o Ticket aqui"
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

export default InsertAppKeyFlexible;
