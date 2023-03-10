import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import Error from '../assets/img/error.png';

const ModalError = ({ show, handleClose }) => {
  return (
    <Modal
      show={show}
      size="sm"
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title />
      </Modal.Header>
      <Modal.Body className="text-center">
        <img src={Error} className="mb-3" alt="" aria-hidden="true" />
        <p className="m-0">
          Não foi possível concluir.
          <br />
          {window.localStorage.getItem('errorMessage')}
        </p>
      </Modal.Body>
      <Modal.Footer className="mt-3">
        <Button
          variant="secondary"
          className="w-100 btn-rounded"
          onClick={() => handleClose()}
        >
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalError.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default ModalError;
