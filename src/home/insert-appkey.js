import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

const InsertAppKey = () => {
  const [appkey, setAppkey] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [os, setOs] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
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

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const detectUserAgent = async () => {
    let userAgent = navigator.userAgent;
    let returnMessage;
    let mobileBrand;

    if (/windows phone/i.test(userAgent)) {
      returnMessage = 'Windows Phone';
    } else if (/windows/i.test(userAgent)) {
      returnMessage = 'Windows';
    } else if (/Android/i.test(userAgent)) {
      returnMessage = 'Android';
    } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
      returnMessage = 'iOS';
    } else if (/Unix/i.test(userAgent)) {
      returnMessage = 'Unix';
    } else if (/Mac/i.test(userAgent)) {
      returnMessage = 'Macos';
    } else if (/Linux/i.test(userAgent)) {
      returnMessage = 'Linux';
    } else if (/BlackBerry/i.test(userAgent)) {
      returnMessage = 'BlackBerry';
    } else {
      returnMessage = 'Desconhecido';
    }

    // Funciona apenas para Android
    if (/Android/i.test(userAgent)) {
      mobileBrand = await navigator.userAgentData
        .getHighEntropyValues([
          'architecture',
          'model',
          'platform',
          'platformVersion',
          'fullVersionList',
        ])
        .then((ua) => {
          return ua.model;
        })
        .catch((err) => {
          return err;
        });
    } else {
      mobileBrand = navigator.platform;
    }

    setDeviceType(
      `Tipo de dispositivo: ${isMobile() ? 'Dispositívo móvel' : 'Desktop'}`
    );
    setOs(`Sistema operacional: ${returnMessage}`);
    setUserAgent(`User agent: ${userAgent}`);
    setDeviceModel(`${isMobile() ? `Modelo do aparelho: ${mobileBrand}` : ''}`);
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
              className="w-100"
              onClick={() => setAppKeyValue()}
              disabled={loading}
            >
              {loading ? 'Carregando' : 'Continuar'}
            </Button>
          </Col>
          {error && <Col xs={12}>{errorMessage}</Col>}
          <Col xs={12}>
            <hr />
          </Col>
          <Col xs={12}>
            <Button
              variant="primary"
              className="w-100"
              onClick={() => detectUserAgent()}
              disabled={loading}
            >
              Detectar userAgent
            </Button>
          </Col>
          {deviceType && <Col xs={12}>{deviceType}</Col>}
          {os && <Col xs={12}>{os}</Col>}
          {userAgent && <Col xs={12}>{userAgent}</Col>}
          {deviceModel && <Col xs={12}>{deviceModel}</Col>}
        </Row>
      </Col>
    </Row>
  );
};

export default InsertAppKey;
