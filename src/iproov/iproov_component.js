import '@iproov/web'; // includes the @iproov/web client into your app
import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';

const IProovComponent = () => {

    const [sessionToken, setSessionToken] = useState('');
    const [svcLocation, setSvcLocation] = useState('https://us.rp.secure.iproov.me');
    const [ready, setReady] = useState(false);


    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSessionToken = (e) => {
        setSessionToken(e.target.value);
    };

    const handleSvcLocation = (e) => {
        setSvcLocation(e.target.value);
    };

    const startSession = () =>{
        if(!sessionToken || !svcLocation){
            setError(true);
            setErrorMessage('Invalid Session Token or Service Location');
        }

        setError(false);
        setErrorMessage('');

        setReady(true)
    }

    const refreshPage = () => {
        window.location.reload(false);
    }

    return (
      <div className="App">

        <Row>
            <Col xs={12}>
            <h2 className="my-4 text-center">
                Dados para a prova de vida
            </h2>
            </Col>
            <Col xs={12}>
            <Row>
                <label>Session Token</label>
                <Col xs={12}>
                    <Form.Control type="text" id="txt_session_token" onChange={handleSessionToken} />
                </Col>
                <Col xs={12}><hr /></Col>
            </Row>
            <Row>
                <label>Service Location</label>
                <Col xs={12}>
                <Form.Control type="text" value={svcLocation} id="txt_service_location" onChange={handleSvcLocation} />
                </Col>
                <Col xs={12}><hr /></Col>
            </Row>
                {!ready && <Row>
                    <Col xs={2}>
                        <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => startSession()}
                            >Salvar
                        </Button>
                    </Col>
                    <Col xs={12}><hr /></Col>
                    {error && <Col xs={12}>{errorMessage}</Col>}
                </Row>}
            </Col>
        </Row>
        {ready && <iproov-me
          token={sessionToken}
          base_url={svcLocation}
          custom_title="Oiti Technologies"
          filter="vibrant"
          debug="true"
        >
            <div slot="ready">
                <h1 class="iproov-lang-heading">Pronto para começar</h1>
            </div>
          <div slot="button">
            <button type="button" class="w-100 btn btn-primary">Iniciar</button>
          </div>

          <div slot="passed">
            <h3 class="iproov-lang-heading">Passed</h3>
            <div class="iproov-lang-term">You have iProoved successfully</div>
            <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => refreshPage()}
                            >Nova sessão
                        </Button>
          </div>
          <div slot="error">
            <h3>Loading Error</h3>
            <Button
                            variant="primary"
                            className="w-100"
                            onClick={() => refreshPage()}
                            >Nova sessão
                        </Button>
          </div>
        </iproov-me>}
      </div>
    )
}

export default IProovComponent;