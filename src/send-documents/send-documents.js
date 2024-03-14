import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ImgIcon from '../assets/img/img-icon.png';
import ChevronRight from '../assets/img/chevron-right.png';
import CaptureArea from './capture-area';
import axios from 'axios';
import { FaceCaptcha } from '@oiti/facecaptcha-core';

const SendDocuments = () => {
  const defaultState = {
    appkey: window.localStorage.getItem('appkey'),
    message: '', // trocar para ''
    sendDocument: false, // trocar pra false
    isLoaded: false, // trocar pra false
    showUpload: false, // trocar pra false
    rotateCamera: false, // trocar pra false
    snapsCaptures: [], // trocar para []
    streams: '', // trocar para ''
    snapTempDOM: '', // trocar para ''
    btnControllers: false, // trocar pra false
    showIniciar: false, // trocar pra false
    uploadRequest: false, // trocar pra false
    multiCapture: false, // trocar pra false
    showTypeCapture: true, // trocar pra true
    processing: false, // trocar pra false
    showDesktop: false, // trocar pra false
    indexTempSnap: -1, // trocar para -1
    uploadResp: true, // trocar para true
  };

  const [ownState, setOwnState] = useState(defaultState);

  const handleStream = (stream) => {
    setTimeout(() => {
      let video = document.getElementById('video');

      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');

      video.srcObject = stream;

      setOwnState({
        ...ownState,
        streams: stream.getVideoTracks(),
        isLoaded: true,
        showIniciar: true,
        btnControllers: false,
        showUpload: false,
      });
    }, 1000);
  };

  const setTypeCapture = (type) => {
    if (isMobile()) {
      let capturaFoto = document.getElementById('captura-foto');

      capturaFoto.click();
    }

    if (isMobile()) {
      setOwnState({
        ...(ownState.multiCapture = type === 1 ? false : true),
      });
    }

    setOwnState({
      ...ownState,
      message: 'Carregando...',
      sendDocument: isMobile() ? ownState.sendDocument : true,
      multiCapture: type === 1 ? false : true,
      showTypeCapture: false,
    });

    setTimeout(() => {
      setOwnState({
        ...ownState,
        message: '',
        isLoaded: false,
      });
    });
  };

  const onResize = () => {
    if (
      !ownState.showTypeCapture &&
      !ownState.processing &&
      ownState.multiCapture &&
      !ownState.showDesktop
    ) {
      stopCameraStreams();
      if (window.innerWidth > window.innerHeight) {
        setOwnState({
          ...ownState,
          rotateCamera: false,
          message: '',
          isLoaded: false,
        });

        if (!ownState.btnControllers && !ownState.showUpload) {
          startCamera();
        }
      } else {
        setOwnState({
          ...ownState,
          rotateCamera: true,
          message: '',
          isLoaded: false,
        });
      }
    } else if (
      !ownState.showTypeCapture &&
      !ownState.processing &&
      !ownState.multiCapture &&
      !ownState.showDesktop
    ) {
      if (
        window.innerWidth > window.innerHeight &&
        window.innerWidth < 1440 &&
        !ownState.showDesktop
      ) {
        setOwnState({
          ...ownState,
          rotateCamera: true,
          message: '',
          isLoaded: false,
        });
      } else {
        setOwnState({
          ...ownState,
          rotateCamera: false,
          message: '',
          isLoaded: false,
        });

        if (!ownState.btnControllers && !ownState.showUpload) {
          startCamera();
        }
      }
    } else if (ownState.showDesktop) {
      setOwnState({
        ...ownState,
        rotateCamera: false,
        message: '',
      });

      if (!ownState.btnControllers && !ownState.showUpload) {
        startCamera();
      }
    } else if (ownState.processing) {
      if (ownState.multiCapture) {
        if (window.innerWidth < window.innerHeight) {
          setOwnState({
            ...ownState,
            rotateCamera: true,
          });
        } else {
          setOwnState({
            ...ownState,
            rotateCamera: false,
          });
        }
      } else {
        if (!ownState.showDesktop) {
          if (window.innerWidth < window.innerHeight) {
            setOwnState({
              ...ownState,
              rotateCamera: false,
            });
          } else {
            setOwnState({
              ...ownState,
              rotateCamera: true,
            });
          }
        }
      }
    }
  };

  // Inicia a câmera
  const startCamera = () => {
    if (ownState.multiCapture) {
      if (ownState.indexTempSnap !== -1) {
        // aqui
        setOwnState({
          ...((ownState.message =
            ownState.indexTempSnap === 1
              ? 'Centralize o verso do documento'
              : 'Centralize a frente do documento'),
          (ownState.isLoaded = false)),
        });
      } else {
        setOwnState({
          ...((ownState.message =
            ownState.snapsCaptures.length === 0
              ? 'Centralize a frente do documento'
              : 'Centralize o verso do documento'),
          (ownState.isLoaded = false)),
        });
      }
    } else {
      setOwnState({
        ...(ownState.message = 'Centralize o documento'),
      });
    }

    setOwnState({
      ...ownState,
      showIniciar: false,
      isLoaded: true,
      processing: true,
    });

    setTimeout(() => {
      setOwnState({
        ...ownState,
        showIniciar: true,
        isLoaded: false,
        message: '',
        processing: false,
      });
    }, 300);

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.mediaDevices.getUserMedia;

    // ajusta as configurações de video
    const constraints = {
      audio: false,
      video: {
        facingMode: 'environment',
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440,
        },
      },
    };

    // se mobile, ajusta configurações de video para mobile
    if (!isMobile()) {
      constraints.video = {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440,
        },
        facingMode: 'environment',
        focusMode: 'continuous',
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => handleStream(stream))
        .catch((err) => {
          console.log('Sem câmera! ' + err);
        });
    }
  };

  // Fecha a câmera
  const stopCameraStreams = () => {
    if (ownState.streams) {
      ownState.streams.forEach((stream) => {
        stream.stop();
      });

      setOwnState({
        ...ownState,
        streams: null,
      });
    }
  };

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const startCapture = () => {
    if (isMobile()) {
      snapCapture();
    } else {
      setOwnState({
        ...ownState,
        processing: true,
        message: 'Processando...',
        showIniciar: false,
        isLoaded: true,
      });

      setTimeout(() => {
        snapCapture();
        stopCameraStreams();

        setOwnState({
          ...ownState,
          message: '',
          btnControllers: true,
          isLoaded: false,
          processing: false,
        });
      }, 1500);
    }
  };

  // Limpa as listar e reinicia a Câmera
  const resetSnap = () => {
    const resetMobileImage = () => {
      let imgMobile = document.getElementById('img-mobile');
      imgMobile.setAttribute('src', '');

      capturaFotoFromInput();
    };

    const resetControls = () => {
      if (isMobile) {
        resetMobileImage();
      }

      return setOwnState({
        ...((ownState.snapTempDOM = ''), (ownState.btnControllers = false)),
      });
    };

    const resetShowUpload = () => {
      let capturaFoto = document.getElementById('captura-foto');
      let imgMobile = document.getElementById('img-mobile');

      if (!isMobile()) {
        setOwnState({
          ...(ownState.showUpload = true),
        });
      } else {
        capturaFoto.value = '';
        imgMobile.src = '';

        setOwnState({
          ...ownState,
          showUpload: true,
        });
      }
    };

    if (ownState.multiCapture) {
      if (ownState.snapsCaptures.length < 2) {
        resetControls();

        if (!isMobile()) {
          startCamera();
        } else {
          let capturaFoto = document.getElementById('captura-foto');

          capturaFoto.click();
        }
      } else {
        resetShowUpload();

        if (!isMobile()) {
          stopCameraStreams();
        }
      }
    } else {
      if (ownState.snapsCaptures.length < 1) {
        resetControls();

        if (!isMobile()) {
          startCamera();
        }
      } else {
        resetShowUpload();

        if (!isMobile()) {
          stopCameraStreams();
        }
      }
    }
  };

  // captura imagem para validação do usuário
  const snapCapture = () => {
    return setOwnState({
      ...(ownState.snapTempDOM = snap()),
    });
  };

  // prepara captura de imagem
  const snapTick = () => {
    // Adiciona as fotos nas listas
    console.log(ownState.snapsCaptures.length);
    if (ownState.indexTempSnap !== -1) {
      ownState.snapsCaptures.splice(
        ownState.indexTempSnap,
        0,
        ownState.snapTempDOM
      );
    } else {
      console.log('entrei aqui');
      ownState.snapsCaptures.push(ownState.snapTempDOM);
    }

    const tempSnap = () => {
      return setOwnState({
        ...((ownState.indexTempSnap = -1),
        (ownState.btnControllers = false),
        (ownState.showTypeCapture = false),
        (ownState.showUpload = false)),
      });
    };

    // Limpa as listas e reinicia a câmera
    tempSnap();
    resetSnap();
  };

  // captura imagem da câmera
  const snap = () => {
    const capturaFoto = document.getElementById('captura-foto');
    const imgMobile = document.getElementById('img-mobile');
    const fotoCapturada = capturaFoto.files[0];
    const video = document.getElementById('video');
    const canvas = document.getElementById('fc_canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    let ratio = !isMobile() ? video.videoWidth / video.videoHeight : 0;
    let widthReal = 0;
    let heightReal = 0;
    let startX = 0;
    let startY = 0;

    if (ratio >= 1 && !ownState.showDesktop) {
      ctx.canvas.width = 1280;
      ctx.canvas.height = 768;
      widthReal = video.videoWidth;
      heightReal = video.videoHeight;
      startX = 0;
      startY = 0;
    } else {
      // retrato
      ctx.canvas.width = 640;
      ctx.canvas.height = 960;
      ratio = !isMobile() ? video.videoWidth / video.videoHeight : 0;
      // verifica proporção
      if (ratio > 1.5) {
        widthReal = video.videoWidth;
        heightReal = video.videoHeight;
        startX = 0;
        startY = 0;
      } else {
        widthReal = !isMobile() ? video.videoHeight / 1.5 : 0;
        heightReal = !isMobile() ? video.videoHeight : 0;
        startX = (!isMobile() ? video.videoWidth - widthReal : 0) / 2;
        startY = 0;
      }
    }

    if (isMobile()) {
      const reader = new FileReader();

      reader.readAsDataURL(fotoCapturada);

      reader.onload = () => {
        imgMobile.src = reader.result;

        setTimeout(() => {
          setOwnState({
            ...ownState,
            snapTempDOM: reader.result,
            message: '',
            btnControllers: true,
            sendDocument: true,
            isLoaded: false,
            processing: false,
          });

          return img.src;
        }, 100);
      };
    } else {
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

      img.src = canvas.toDataURL('image/jpeg');

      return img.src;
    }
  };

  // remove imagem das listas
  const removeSnapFromLists = (index) => {
    const snapRemoval = () => {
      return (
        setOwnState({
          ...((ownState.indexTempSnap = index),
          // (ownState.snapsCaptures = ownState.snapsCaptures.splice(index, 1)),
          (ownState.showUpload = false),
          (ownState.message = 'Carregando...'),
          (ownState.sendDocument = true),
          (ownState.showTypeCapture = false)),
        }),
        ownState.snapsCaptures.splice(index, 1)
      );
    };

    setTimeout(() => {
      setOwnState({
        ...((ownState.message = ''), (ownState.isLoaded = false)),
      });
    }, 300);

    snapRemoval();
    resetSnap();
  };

  // Envia as fotos e finaliza o upload de imagens
  const uploadPictures = async () => {
    const snapsSend = ownState.snapsCaptures.map((snap) =>
      snap.replace('data:image/jpeg;base64,', '')
    );

    const facecaptchaService = new FaceCaptcha(axios, {
      BaseURL: process.env.REACT_APP_BASE_URL,
      timeout: 20000,
    });

    const parameters = {
      appkey: ownState.appkey,
      images: snapsSend,
    };

    try {
      const result = await facecaptchaService.sendDocument(parameters);

      console.log('consolando', result);

      setTimeout(() => {
        setOwnState({
          ...((ownState.isLoaded = false),
          (ownState.uploadRequest = true),
          (ownState.uploadResp = false)),
        });
      }, 1000);

      window.alert('Documento enviado com sucesso');

      window.localStorage.removeItem('appkey');
    } catch (error) {
      setTimeout(() => {
        setOwnState({
          ...(ownState.isLoaded = false),
        });

        window.alert(
          'Documento não localizado! Por favor reenvie o documento.'
        );

        window.location.reload();
      }, 1000);
    }
  };

  // Caso o usuário tenha algum problema, este método excluirá a appkey e o jogará de volta para a home
  const deleteAppKey = () => {
    window.localStorage.removeItem('appkey');
    window.localStorage.removeItem('hasLiveness');

    window.location.href = '/';
  };

  const capturaFotoFromInput = () => {
    let capturaFoto = document.getElementById('captura-foto');

    capturaFoto.click(() => {
      startCapture();
    });
  };

  useEffect(() => {
    ownState.sendDocument && onResize();

    let capturaFoto = document.getElementById('captura-foto');

    capturaFoto.addEventListener('change', () => {
      startCapture();
    });
  }, [ownState.sendDocument]);

  return (
    <Fragment>
      <Row>
        <Col xs={12} className="mt-4">
          <Link to="/">Voltar</Link>
        </Col>
        <Col xs={12} className="mb-4">
          <h1>Envio de documentos</h1>
          <p>Para começarmos, escolha o tipo de documento que deseja enviar:</p>
        </Col>
        <Col xs={12}>
          <div
            id="btn-tipo-captura-1-foto"
            role="button"
            // className={`btn btn-outline-secondary d-block mb-3 ${
            //   ownState.appkey === null ? 'disabled' : ''
            // }`}
            className="btn btn-outline-secondary d-block mb-3"
            onClick={() => setTypeCapture(1)}
            tabIndex={0}
          >
            <Row>
              <Col xs={'auto'} className="d-flex align-items-center">
                <img src={ImgIcon} alt="" aria-hidden="true" />
              </Col>
              <Col className="d-flex align-items-center">
                <div className="text-start">
                  <p className="m-0 fw-bold">1 foto</p>
                  <p className="m-0">Frente e verso</p>
                </div>
              </Col>
              <Col xs={'auto'} className="d-flex align-items-center">
                <img src={ChevronRight} alt="" aria-hidden="true" />
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={12} className="mb-4">
          <div
            id="btn-tipo-captura-2-fotos"
            role="button"
            // className={`btn btn-outline-secondary d-block mb-3 ${
            //   ownState.appkey === null ? 'disabled' : ''
            // }`}
            className="btn btn-outline-secondary d-block mb-3"
            onClick={() => setTypeCapture(2)}
            tabIndex={0}
          >
            <Row>
              <Col xs={'auto'} className="d-flex align-items-center">
                <img src={ImgIcon} alt="" aria-hidden="true" />
              </Col>
              <Col className="d-flex align-items-center">
                <div className="text-start">
                  <p className="m-0 fw-bold">2 fotos</p>
                  <p className="m-0">1 frente e um verso</p>
                </div>
              </Col>
              <Col xs={'auto'} className="d-flex align-items-center">
                <img src={ChevronRight} alt="" aria-hidden="true" />
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={12} className="text-center">
          <Button
            id="delete-appkey"
            variant="link"
            onClick={() => deleteAppKey()}
          >
            Em caso de problemas, clique aqui
          </Button>
        </Col>
      </Row>

      <CaptureArea
        state={ownState}
        startCapture={startCapture}
        snapTick={snapTick}
        resetSnap={resetSnap}
        removeSnapFromLists={removeSnapFromLists}
        uploadPictures={uploadPictures}
        isMobile={isMobile}
      />
    </Fragment>
  );
};

export default SendDocuments;
