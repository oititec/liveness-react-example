import React, { Fragment, useEffect, useRef, useState } from 'react';
import { FaceCaptcha } from '@oiti/facecaptcha-core';
import { Col, Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import EnvironmentIcon from '../assets/img/environment-icon.png';
import PersonIcon from '../assets/img/person-icon.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Success from '../assets/img/success.png';
import ModalError from './modal-error';
import { Crypto } from '../crypto/crypto';

const Liveness2D = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);

    window.localStorage.removeItem('errorMessage');
  };
  const handleShow = () => setShow(true);

  const staticAppKey = window.localStorage.getItem('appkey');

  const liveness2DArea = useRef(null);
  const video = useRef(null);
  const divLoader = useRef(null);
  const divMsg = useRef(null);
  const imgMsg = useRef(null);
  const spanMsg = useRef(null);
  const imgChallenge = useRef(null);
  const divButton = useRef(null);
  const liveness2DResult = useRef(null);

  let showIniciar = true;
  let isLoaded = false;
  let message = '';
  let emojiBase64 = '';
  let msgBase64 = '';
  let challenge = '';
  let fcvarSnaps = '';
  let fcvarFirstSnap = '';
  let livenessSuccess = false;
  let livenessError = false;

  const body = document.getElementsByTagName('body');

  // Estado inicial das divs e elementos HTML da páginas
  const initialState = () => {
    showIniciar = true;
    isLoaded = false;
    message = '';
    emojiBase64 = '';
    msgBase64 = '';
    challenge = '';
    fcvarSnaps = '';
    fcvarFirstSnap = '';
    livenessSuccess = false;
    livenessError = false;

    showSpanMessage(message);
    showHideDivLoader();
    showHideDivMsg();
    showHideDivButton();
    showHideDivConfirmSuccess();
    showImgMsg();
    showImgChallenge();
  };

  // Iniciando a câmera
  const showLiveness2D = () => {
    body[0].style.overflow = 'hidden';

    liveness2DArea.current.classList.remove('d-none');

    setTimeout(() => {
      video.current.setAttribute('autoplay', '');
      video.current.setAttribute('muted', '');
      video.current.setAttribute('playsinline', '');

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(function (mediaStream) {
          video.current.srcObject = mediaStream;
          video.current.play();
        })
        .catch(function (err) {
          console.log('Não há permissões para acessar a webcam');
        });
    }, 1000);
  };

  // Iniciando o processo de captura de imagem
  const startCapture = () => {
    showIniciar = false;
    isLoaded = true;
    message = 'Iniciando...';

    showSpanMessage(message);
    showHideDivLoader();
    showHideDivMsg();
    showHideDivButton();

    getChallengeFromLib();
  };

  // Chamada do challenge
  const getChallengeFromLib = async () => {
    const facecaptchaService = new FaceCaptcha(axios, {
      BaseURL: process.env.REACT_APP_BASE_URL,
    });

    const result = await facecaptchaService.startChallenge({
      appKey: staticAppKey,
    });

    challenge = result;

    if (result.challenges.length > 0) {
      message = '';
      isLoaded = false;

      showSpanMessage(message);
    }

    prepareChallenge(0);
  };

  // Preparar desafios
  const prepareChallenge = (index) => {
    emojiBase64 = '';
    msgBase64 = '';
    message = '';

    if (index >= challenge.numberOfChallenges) {
      stopChallenge();
      return;
    }

    // Intervalo de captura de image do video
    for (let i = 1; i <= challenge.snapNumber; i++) {
      setTimeout(function () {
        console.log(index + ' - snap: ' + i);
        snapTick(challenge.challenges[index]);
      }, challenge.snapFrequenceInMillis * i);
    }

    // atribui imagem Desafio (msg)
    msgBase64 = `data:image/jpeg;base64,${challenge.challenges[index].mensagem}`;
    showImgMsg(msgBase64);

    // atribui imagem Desafio (emojji)
    emojiBase64 = `data:image/jpeg;base64,${challenge.challenges[index].tipoFace.imagem}`;
    showImgChallenge(emojiBase64);

    setTimeout(function () {
      // Proximo desafio. Recursive
      index++;
      prepareChallenge(index);
    }, (challenge.totalTime / challenge.numberOfChallenges) * 1000);
  };

  // finaliza desafios
  const stopChallenge = () => {
    message = 'Enviando...';
    isLoaded = true;
    msgBase64 = '';
    emojiBase64 = '';

    showSpanMessage(message);
    showImgMsg(msgBase64);
    showImgChallenge(emojiBase64);

    getLivenessCaptchaFromLib(staticAppKey, challenge.chkey, fcvarSnaps);
  };

  // prepara captura de imagem
  const snapTick = (fcvarCurCha) => {
    let snapb64 = snap();

    if (fcvarFirstSnap === '') {
      fcvarFirstSnap = snapb64;
    }

    // necessario adicionar o codigo do tipoFace entre o 'data:image/jpeg' e o snapb64
    snapb64 = snapb64.split('data:image/jpeg;base64,');
    snapb64 = `data:image/jpeg;base64,${snapb64[0]}type:${fcvarCurCha.tipoFace.codigo},${snapb64[1]}`;

    fcvarSnaps += snapb64;
  };

  // captura imagem da câmera
  const snap = () => {
    var video = document.getElementById('video');
    var canvas = document.getElementById('fc_canvas');
    var ctx = canvas.getContext('2d');

    ctx.canvas.width = 320;
    ctx.canvas.height = 480;

    var ratio = video.videoWidth / video.videoHeight;
    var widthReal,
      heightReal = 0;
    var startX,
      startY = 0;

    if (ratio >= 1) {
      // paisagem
      widthReal = video.videoHeight / 1.5;
      heightReal = video.videoHeight;

      startX = (video.videoWidth - widthReal) / 2;
      startY = 0;
    } else {
      // retrato
      ratio = video.videoHeight / video.videoWidth;

      // verifica proporção
      if (ratio > 1.5) {
        widthReal = video.videoWidth;
        heightReal = video.videoWidth * 1.5;

        startX = 0;
        startY = (video.videoHeight - heightReal) / 2;
      } else {
        widthReal = video.videoHeight / 1.5;
        heightReal = video.videoHeight;

        startX = (video.videoWidth - widthReal) / 2;
        startY = 0;
      }
    }

    // crop image video
    ctx.drawImage(
      video,
      startX,
      startY,
      widthReal,
      heightReal,
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );

    var img = new Image();
    img.src = canvas.toDataURL('image/jpeg');

    return img.src;
  };

  // Chamada do captcha
  const getLivenessCaptchaFromLib = async (appkey, chkey, images) => {
    const facecaptchaService = new FaceCaptcha(axios, {
      BaseURL: process.env.REACT_APP_BASE_URL,
      timeout: 20000,
    });

    const parameters = {
      appkey: appkey,
      chkey: chkey,
      images: Crypto.encChData(images, appkey),
    };

    const result = await facecaptchaService.liveness2DCheck(parameters);

    if (result.valid === true) {
      livenessSuccess = true;
      livenessError = false;

      setTimeout(() => {
        showHideDivConfirmSuccess();

        setTimeout(() => {
          closeLiveness2D(appkey);
        }, 5000);
      }, 1000);
    } else {
      livenessSuccess = false;
      livenessError = true;

      setTimeout(() => {
        window.localStorage.setItem(
          'errorMessage',
          `${result.codID} - ${result.cause}`
        );

        livenessError && handleShow();

        closeLiveness2D(appkey);
      }, 1000);
    }
  };

  // Encerrando a câmera
  const closeLiveness2D = (appkey) => {
    body[0].removeAttribute('style');

    liveness2DArea.current.classList.add('d-none');

    video.current.removeAttribute('autoplay');
    video.current.removeAttribute('muted');
    video.current.removeAttribute('playsinline');

    video.current.srcObject.getTracks()[0].stop();
    video.current.src = '';

    window.localStorage.setItem('hasLiveness', 'true');

    initialState();
  };

  // Abaixo estão os métodos onde são exibidos as mensagens e também escondemos as DIVs que não são necessárias
  const showSpanMessage = (text) => {
    spanMsg.current.innerHTML = text;
  };

  const showHideDivLoader = () => {
    isLoaded
      ? divLoader.current.classList.remove('d-none')
      : divLoader.current.classList.add('d-none');
  };

  const showHideDivMsg = () => {
    isLoaded
      ? divMsg.current.classList.remove('d-none')
      : divMsg.current.classList.add('d-none');
  };

  const showHideDivButton = () => {
    showIniciar
      ? divButton.current.classList.remove('d-none')
      : divButton.current.classList.add('d-none');
  };

  const showHideDivConfirmSuccess = () => {
    livenessSuccess
      ? liveness2DResult.current.classList.remove('d-none')
      : liveness2DResult.current.classList.add('d-none');
  };

  const showImgMsg = (img) => {
    imgMsg.current.setAttribute('src', img);
  };

  const showImgChallenge = (img) => {
    imgChallenge.current.setAttribute('src', img);
  };

  useEffect(() => {
    initialState();
  });

  return (
    <Fragment>
      <Row>
        <Col xs={12} className="mt-4">
          <Link to="/">Voltar</Link>
        </Col>
        <Col xs={12} className="mb-4">
          <h1>Reconhecimento facial</h1>
          <p>Isso garante que você é você mesmo.</p>
        </Col>
        <Col xs={12} className="mb-4">
          <Row className="mb-3">
            <Col xs={'auto'}>
              <img src={EnvironmentIcon} alt="" aria-hidden="true" />
            </Col>
            <Col xs={10} className="d-flex align-items-center">
              <p className="m-0 fw-bold">Escolha um ambiente bem iluminado.</p>
            </Col>
          </Row>
          <Row>
            <Col xs={'auto'}>
              <img src={PersonIcon} alt="" aria-hidden="true" />
            </Col>
            <Col xs={10} className="d-flex align-items-center">
              <p className="m-0 fw-bold">
                Não use acessórios como bonés, máscaras e afins.
              </p>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Button
            variant="success"
            className="btn-rounded"
            onClick={() => showLiveness2D()}
          >
            Continuar
          </Button>
        </Col>
      </Row>

      <div ref={liveness2DArea} className="liveness-2d d-none">
        <div id="overlay" className="overlay" />

        <div className="liveness-area">
          <div id="divCloseButton" className="divCloseButton">
            <Button
              variant="light"
              className="btn-rounded"
              onClick={() => closeLiveness2D()}
            >
              X
            </Button>
          </div>

          <div id="content-video" className="content-video">
            <video ref={video} id="video"></video>
          </div>

          <div ref={divLoader} id="divLoader">
            <div className="loader"></div>
          </div>

          <div ref={divMsg} className="divMsg">
            <img ref={imgChallenge} id="imgChallenge" src="" alt="" />
            <img ref={imgMsg} id="imgMsg" src="" alt="" />
            <span ref={spanMsg} id="spanMsg" />
          </div>

          <div
            ref={divButton}
            id="divButton"
            className={`
              ${showIniciar ? '' : 'd-none'}
              divButton
            `}
          >
            <Button
              variant="success"
              className="btn-rounded"
              onClick={() => startCapture()}
            >
              Começar
            </Button>
          </div>
        </div>
      </div>

      <div ref={liveness2DResult} className="liveness-2d-result">
        <div className="overlay success" />

        <div className="result-text position-absolute t-0 l-0 d-flex align-items-center justify-content-center w-100 h-100">
          <div className="text-center">
            <img src={Success} alt="" aria-hidden="true" className="mb-3" />
            <br />
            Tudo certo!
          </div>
        </div>
      </div>

      <ModalError show={show} handleClose={handleClose} />

      <canvas id="fc_canvas" style={{ display: 'none' }}></canvas>
    </Fragment>
  );
};

export default Liveness2D;
