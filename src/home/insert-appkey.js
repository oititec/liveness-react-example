import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

const InsertAppKey = () => {
  const [appkey, setAppkey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAppKey = (e) => {
    setAppkey(e.target.value);
  };

  const setAppKeyValue = () => {
    window.localStorage.setItem('appkey', appkey);

    setLoading(true);

    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
            <Button variant="primary" onClick={() => setAppKeyValue()}>
              {loading ? 'Carregando' : 'Continuar'}
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default InsertAppKey;
