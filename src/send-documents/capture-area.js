import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';

const CaptureArea = ({
  state,
  startCapture,
  snapTick,
  resetSnap,
  removeSnapFromLists,
  uploadPictures,
  isMobile,
}) => {
  return (
    <Fragment>
      {state.sendDocument && (
        <Fragment>
          {!isMobile() ? <div className="overlay" /> : ''}

          <div className="send-document-area">
            <Container>
              {state.message !== '' && (
                <div className="div-msg">
                  <span id="spanMsg">{state.message}</span>
                </div>
              )}

              {!state.showUpload && !isMobile() && (
                <video id="video" className="object-fit-contain" />
              )}

              {state.snapTempDOM !== '' && (
                <div
                  id="thumb-picture"
                  className={`thumb-picture ${
                    isMobile() ? 'mobile-thumb' : ''
                  }`}
                >
                  <div>
                    <p>A foto do documento ficou boa?</p>
                    <img id="imgCamera" src={state.snapTempDOM} alt="" />
                  </div>
                </div>
              )}

              {state.showUpload && !state.rotateCamera && (
                <div
                  className={`thumbs-group ${isMobile() ? 'mobile-thumb' : ''}`}
                >
                  <div className="thumb-group-card">
                    <p>
                      Deseja enviar ou trocar a
                      {state.snapsCaptures.length === 2 && 's'} foto
                      {state.snapsCaptures.length === 2 && 's'}?
                    </p>
                    {state.snapsCaptures.map((e, i) => {
                      return (
                        <div key={i}>
                          <img src={e} className="my-1" alt="" />
                          <button
                            className="badge rounded-pill text-bg-primary border border-0 btnImage fadeIn left btnImage fadeIn left d-flex align-content-center justify-content-center mx-auto mt-2 mb-4"
                            onClick={() => removeSnapFromLists(i)}
                          >
                            <i
                              className="material-icons me-2"
                              aria-hidden="true"
                            >
                              loop
                            </i>
                            Trocar foto
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {state.btnControllers && (
                <div className="d-flex btn-controllers">
                  <button
                    className="btn btn-primary d-flex align-items-center btnImage fadeIn right mt-2 me-2"
                    onClick={() => snapTick()}
                  >
                    <i className="material-icons me-2" aria-hidden="true">
                      insert_photo
                    </i>
                    Usar foto
                  </button>
                  <button
                    className="btn btn-primary d-flex align-items-center btnImage fadeIn right mt-2"
                    onClick={() => resetSnap()}
                  >
                    <i className="material-icons me-2" aria-hidden="true">
                      add_photo_alternate
                    </i>
                    Tirar nova foto
                  </button>
                </div>
              )}

              {state.rotateCamera === false && (
                <div className="d-flex btn-controllers">
                  {state.showIniciar &&
                    !state.btnControllers &&
                    !state.showUpload &&
                    !isMobile() && (
                      <button
                        id="btnIniciar"
                        className="btn btn-primary d-flex align-items-center btnImage btnCapture fadeIn mt-2 me-2"
                        onClick={() => startCapture()}
                      >
                        <i className="material-icons me-2" aria-hidden="true">
                          camera_alt
                        </i>
                        Tirar foto
                      </button>
                    )}
                  {state.showUpload && !state.uploadRequest && (
                    <button
                      className="btn btn-primary d-flex align-items-center btnImage btnUpload fadeIn mt-2"
                      onClick={() => uploadPictures()}
                      disabled={state.isLoaded}
                    >
                      <i className="material-icons me-2" aria-hidden="true">
                        outbox
                      </i>
                      Enviar foto{state.snapsCaptures.length === 2 && 's'}
                    </button>
                  )}
                </div>
              )}
            </Container>
          </div>
        </Fragment>
      )}

      <input
        type="file"
        id="captura-foto"
        accept="image/*"
        capture="camera"
        aria-hidden="true"
        style={{ display: 'none', pointerEvents: 'none' }}
      />
      <img
        id="img-mobile"
        src=""
        aria-hidden="true"
        style={{ display: 'none' }}
      />
      <canvas id="fc_canvas" style={{ display: 'none' }}></canvas>
    </Fragment>
  );
};

CaptureArea.propTypes = {
  state: PropTypes.object,
  startCapture: PropTypes.func,
  snapTick: PropTypes.func,
  resetSnap: PropTypes.func,
  removeSnapFromLists: PropTypes.func,
  uploadPictures: PropTypes.func,
  isMobile: PropTypes.func,
};

export default CaptureArea;
