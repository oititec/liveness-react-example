import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import ImgIcon from "../assets/img/img-icon.png";
import FileIcon from "../assets/img/file-icon.png";
import ChevronRight from "../assets/img/chevron-right.png";
import ImageIcon from "../assets/img/img-icon.png";
import PdfIcon from "../assets/img/pdf-icon.png";
import TrashCanIcon from "../assets/img/trash-icon.png";
import CaptureArea from "../send-documents/capture-area";
import axios from "axios";
import { FaceCaptcha } from "@oiti/facecaptcha-core";
import { Row, Col } from "react-bootstrap";

const SendDigitalCNH = () => {
  const defaultState = {
    appkey: window.localStorage.getItem("appkey"),
    message: "", // trocar para ''
    sendDocument: false, // trocar pra false
    showUpload: false, // trocar pra false
    isLoaded: false,
    rotateCamera: false, // trocar pra false
    snapsCaptures: [], // trocar para []
    streams: "", // trocar para ''
    snapTempDOM: "", // trocar para ''
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
  const [filePreview, setFilePreview] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleStream = (stream) => {
    setTimeout(() => {
      let video = document.getElementById("video");

      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");

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
      let capturaFoto = document.getElementById("captura-foto");

      capturaFoto.click();

      capturaFoto.addEventListener("change", () => {
        startCapture();
      });
    }

    if (isMobile()) {
      setOwnState({
        ...(ownState.multiCapture = type === 1 ? false : true),
      });
    }

    setOwnState({
      ...ownState,
      message: "Carregando...",
      sendDocument: isMobile() ? ownState.sendDocument : true,
      multiCapture: type === 1 ? false : true,
      showTypeCapture: false,
    });

    setTimeout(() => {
      setOwnState({
        ...ownState,
        message: "",
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
          message: "",
          isLoaded: false,
        });

        if (!ownState.btnControllers && !ownState.showUpload) {
          startCamera();
        }
      } else {
        setOwnState({
          ...ownState,
          rotateCamera: true,
          message: "",
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
          message: "",
          isLoaded: false,
        });
      } else {
        setOwnState({
          ...ownState,
          rotateCamera: false,
          message: "",
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
        message: "",
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
              ? "Centralize o verso do documento"
              : "Centralize a frente do documento"),
          (ownState.isLoaded = false)),
        });
      } else {
        setOwnState({
          ...((ownState.message =
            ownState.snapsCaptures.length === 0
              ? "Centralize a frente do documento"
              : "Centralize o verso do documento"),
          (ownState.isLoaded = false)),
        });
      }
    } else {
      setOwnState({
        ...(ownState.message = "Centralize o documento"),
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
        message: "",
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
        facingMode: "environment",
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
        facingMode: "environment",
        focusMode: "continuous",
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => handleStream(stream))
        .catch((err) => {
          console.log("Sem câmera! " + err);
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
        message: "Processando...",
        showIniciar: false,
        isLoaded: true,
      });

      setTimeout(() => {
        snapCapture();
        stopCameraStreams();

        setOwnState({
          ...ownState,
          message: "",
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
      let imgMobile = document.getElementById("img-mobile");
      imgMobile.setAttribute("src", "");

      let capturaFoto = document.getElementById("captura-foto");

      if (ownState.snapsCaptures.length < 1) {
        capturaFoto.click();
      }
    };

    const resetControls = () => {
      if (isMobile()) {
        resetMobileImage();
      }

      return setOwnState({
        ...((ownState.snapTempDOM = ""), (ownState.btnControllers = false)),
      });
    };

    const resetShowUpload = () => {
      let capturaFoto = document.getElementById("captura-foto");
      let imgMobile = document.getElementById("img-mobile");

      if (!isMobile()) {
        setOwnState({
          ...(ownState.showUpload = true),
        });
      } else {
        capturaFoto.value = "";
        imgMobile.src = "";

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
          let capturaFoto = document.getElementById("captura-foto");

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
    if (ownState.indexTempSnap !== -1) {
      ownState.snapsCaptures.splice(
        ownState.indexTempSnap,
        0,
        ownState.snapTempDOM
      );
    } else {
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
    const capturaFoto = document.getElementById("captura-foto");
    const imgMobile = document.getElementById("img-mobile");
    const fotoCapturada = capturaFoto.files[0];
    const video = document.getElementById("video");
    const canvas = document.getElementById("fc_canvas");
    const ctx = canvas.getContext("2d");
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

    const resizeMe = (img) => {
      var width = img.width;
      var height = img.height;

      var max_width = 1200;
      var max_height = 1600;

      if (width > height) {
        if (width > max_width) {
          height = Math.round((height *= max_width / width));
          width = max_width;
        }
      } else {
        if (height > max_height) {
          width = Math.round((width *= max_height / height));
          height = max_height;
        }
      }

      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      return canvas.toDataURL("image/jpeg", 0.85);
    };

    if (isMobile()) {
      const reader = new FileReader();

      reader.readAsArrayBuffer(fotoCapturada);

      reader.onload = (e) => {
        let blob = new Blob([e.target.result]);
        window.URL = window.URL || window.webkitURL;
        let blobURL = window.URL.createObjectURL(blob);

        imgMobile.src = blobURL;

        imgMobile.onload = () => {
          let resized = resizeMe(imgMobile);

          let newinput = document.createElement("input");
          newinput.type = "hidden";
          newinput.name = "images[]";
          newinput.value = resized;

          setTimeout(() => {
            setOwnState({
              ...ownState,
              snapTempDOM: newinput.value,
              message: "",
              btnControllers: true,
              sendDocument: true,
              isLoaded: false,
              processing: false,
            });

            return imgMobile.src;
          }, 100);
        };
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

      img.src = canvas.toDataURL("image/jpeg");

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
          (ownState.message = "Carregando..."),
          (ownState.sendDocument = true),
          (ownState.showTypeCapture = false)),
        }),
        ownState.snapsCaptures.splice(index, 1)
      );
    };

    setTimeout(() => {
      setOwnState({
        ...((ownState.message = ""), (ownState.isLoaded = false)),
      });
    }, 300);

    snapRemoval();
    resetSnap();
  };

  // Envia as fotos e finaliza o upload de imagens
  const sendDigitalCNH = async () => {
    let digitalCNH;

    setOwnState({
      ...ownState,
      isLoaded: true,
    });
    setIsLoaded({
      isLoaded: true,
    });

    const base64Regex = /^data:(image\/[a-zA-Z]+|application\/pdf);base64,/;

    if (filePreview) {
      digitalCNH = filePreview.base64.replace(base64Regex, '');
    } else {
      digitalCNH = ownState.snapsCaptures[0].replace(base64Regex, '');
    }

    const facecaptchaService = new FaceCaptcha(axios, {
      BaseURL: process.env.REACT_APP_BASE_URL,
      timeout: 20000,
    });

    const parameters = {
      appkey: ownState.appkey,
      qrcode: digitalCNH,
    };

    console.log(parameters);

    try {
      const result = await facecaptchaService.sendDocument(parameters);
      console.log(result);

      setTimeout(() => {
        setOwnState({
          ...((ownState.isLoaded = false),
          (ownState.uploadRequest = true),
          (ownState.uploadResp = false)),
        });
        setIsLoaded({
          isLoaded: false,
        });
      }, 1000);

      window.alert("QRCode enviado com sucesso");

      window.localStorage.removeItem("appkey");

      window.location.reload();
    } catch (error) {
      setTimeout(() => {
        setOwnState({
          ...(ownState.isLoaded = false),
        });

        window.alert("QRCode não localizado! Por favor reenvie o documento.");

        window.location.reload();
      }, 1000);
    }
  };

  const deleteAppKey = () => {
    window.localStorage.removeItem("appkey");
    window.localStorage.removeItem("hasLiveness");

    window.location.href = "/";
  };

  useEffect(() => {
    ownState.sendDocument && onResize();
  }, [ownState.sendDocument]);

  const triggerFileInput = () => {
    const fileInput = document.getElementById("file-input");
    fileInput?.click();
  };

  const onFileSelected = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (validTypes.includes(file.type)) {
        const fileIcon = file.type.startsWith("image") ? ImageIcon : PdfIcon;

        convertToBase64(file)
          .then((base64) => {
            setFilePreview({
              name: file.name,
              type: file.type,
              icon: fileIcon,
              base64: base64,
            });
          })
          .catch((error) => {
            console.error("Erro ao converter o arquivo em base64", error);
          });
      } else {
        window.alert(
          "Por favor, selecione um arquivo no formato PDF, JPEG ou PNG."
        );
      }
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeLoadedFile = () => {
    setFilePreview(null);
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <Fragment>
      <Row className="mt-4">
        <Col xs={12}>
          <Link to="/send-documents">Voltar</Link>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12}>
          <h1>Envio de CNH Digital</h1>
          <p>Escolha a forma que deseja enviar:</p>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col xs={12}>
          <div
            id="btn-captura-cnh-digital"
            role="button"
            className="btn btn-outline-secondary d-block"
            onClick={() => setTypeCapture(1)}
            tabIndex="0"
          >
            <Row>
              <Col xs="auto" className="d-flex align-items-center">
                <img src={ImgIcon} alt="" aria-hidden="true" />
              </Col>
              <Col className="d-flex align-items-center">
                <div className="text-start">
                  <p className="m-0 fw-bold">Foto</p>
                  <p className="m-0">
                    Envie uma foto do QRCode presente em sua CNH Digital
                  </p>
                </div>
              </Col>
              <Col xs="auto" className="d-flex align-items-center">
                <img src={ChevronRight} alt="" aria-hidden="true" />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12}>
          <div
            id="btn-tipo-captura-2-fotos"
            role="button"
            className="btn btn-outline-secondary d-block mb-3"
            onClick={triggerFileInput}
            tabIndex="0"
          >
            <Row>
              <Col xs="auto" className="d-flex align-items-center">
                <img src={FileIcon} alt="" aria-hidden="true" />
              </Col>
              <Col className="d-flex align-items-center">
                <div className="text-start">
                  <p className="m-0 fw-bold">Envio de arquivo</p>
                  <p className="m-0">
                    Envie o arquivo de sua CNH Digital em formato PDF, JPEG ou
                    PNG
                  </p>
                </div>
              </Col>
              <Col xs="auto" className="d-flex align-items-center">
                <img src={ChevronRight} alt="" aria-hidden="true" />
              </Col>
            </Row>
          </div>

          <input
            type="file"
            id="file-input"
            onChange={onFileSelected}
            style={{ display: "none" }}
          />

          {filePreview && (
            <div className="preview-container d-flex justify-content-center align-items-center flex-column">
              <div className="file-icon">
                <img
                  src={filePreview.icon}
                  alt="File Icon"
                  className="file-icon-img"
                />
              </div>
              <p className="file-name">{filePreview.name}</p>

              <div className="d-flex align-items-center">
                <button
                  className="btn btn-primary d-flex align-items-center btnImage btnUpload fadeIn mt-2"
                  onClick={() => sendDigitalCNH()}
                  disabled={isLoaded}
                >
                  {isLoaded ? (
                    <Fragment>
                      <i className="material-icons me-2" aria-hidden="true">
                        cloud_upload
                      </i>
                      <span>Carregando...</span>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <i className="material-icons me-2" aria-hidden="true">
                        outbox
                      </i>
                      <span>Enviar foto</span>
                    </Fragment>
                  )}
                </button>

                {filePreview && (
                  <button
                    className="btn btn-link mt-2 trash-can-button"
                    onClick={removeLoadedFile}
                    aria-label="Delete file"
                  >
                    <img
                      src={TrashCanIcon}
                      alt="Trash Can"
                      className="trash-can-button img"
                    />
                  </button>
                )}
              </div>
            </div>
          )}
        </Col>
      </Row>

      <Row className="text-center">
        <Col xs={12}>
          <button
            id="delete-appkey"
            type="button"
            className="btn btn-link"
            onClick={deleteAppKey}
          >
            Em caso de problemas, clique aqui
          </button>
        </Col>
      </Row>

      <input
        type="file"
        id="captura-foto"
        accept="image/*"
        capture="camera"
        aria-hidden="true"
        style={{ display: "none", pointerEvents: "none" }}
      />
      <CaptureArea
        state={ownState}
        startCapture={startCapture}
        snapTick={snapTick}
        resetSnap={resetSnap}
        removeSnapFromLists={removeSnapFromLists}
        uploadPictures={sendDigitalCNH}
        isMobile={isMobile}
      />
    </Fragment>
  );
};

export default SendDigitalCNH;
