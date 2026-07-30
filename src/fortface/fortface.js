import FortfaceLogo from "../assets/img/Fortface_Logo.png";
import { Link, Routes, Route, useNavigate, useLocation, HashRouter as Router } from "react-router-dom";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { facecaptchaService } from "../backend/facecaptcha-service";
import { Button, Col, Row } from 'react-bootstrap';

const Fortface = () => {
    const navigate = useNavigate();

    const fortfaceContainer = useRef(null);
    const fortfaceSdk = useRef(null);

    const [status, setStatus] = useState("");
    const [enableButton, setEnableButton] = useState(false);

    const appkey = useRef(null);
    const userAgent = useRef(null);

    const deviceRequestInfo = useRef(null);
    const sessionId = useRef(null);
    const sessionKey = useRef(null);
    const sessionToken = useRef(null);

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        updateStatus("Inicializando...");

        await window.FortfaceSDK.load();

        await customElements.whenDefined("fortface-sdk");

        await createFreshSdk();

        localStorage.removeItem("hasLiveness");

        appkey.current = localStorage.getItem('appkey');
        userAgent.current = window.navigator.userAgent;

        await createSession();
    }

    const createFreshSdk = async () => {
        fortfaceSdk.current = null;

        deviceRequestInfo.current = null;
        sessionId.current = null;

        await window.FortfaceSDK.load();

        const container = fortfaceContainer.current;

        container.querySelectorAll("fortface-sdk").forEach(e => e.remove());

        await customElements.whenDefined("fortface-sdk");

        const sdk = document.createElement("fortface-sdk");

        container.appendChild(sdk);

        fortfaceSdk.current = sdk;

        deviceRequestInfo.current = await sdk.start();
    };

    const createSession = async () => {
        try {
            const resp = await facecaptchaService
                .createFortfaceSession(appkey.current, userAgent.current, deviceRequestInfo.current);

            sessionId.current = resp.data.sessionId;
            sessionKey.current = resp.data.sessionKey;
            sessionToken.current = resp.data.sessionToken;

            setEnableButton(true);
            updateStatus('Inicializado com sucesso');

        } catch (error) {
            updateStatus('Sua appkey é inválida. Por favor, retorne a home para gerar uma nova.')
        }
    }

    const startLivenessValidation = async () => {
        fortfaceSdk.current.startSession(
            fortfaceFinishSession,
            sessionId.current,
            sessionKey.current,
            {
                returnMetrics: true
            });
    }

    const fortfaceFinishSession = async (result) => {
        const { action, data, sessionDetails } = result;

        switch (action) {
            case "capture":
                await handleResult(data);
                break;
            case "cancel":
                updateStatus("Captura cancelada pelo usuário");
                break;
            case "timeout":
                updateStatus("Tempo de captura esgotado");
                break;
            case "timeout_ready":
                updateStatus("Tempo de inicialização esgotado");
                break;
            case "error":
                updateStatus(`Erro Fortface: ${sessionDetails?.errorCode || "desconhecido"}`);
                break;
            default:
                updateStatus(`Ação inesperada: ${action}`);
        }
    }

    const handleResult = async (data) => {
        setEnableButton(false);

        updateStatus("Enviando...");

        const livenessInfo = {
            appkey: appkey.current,
            userAgent: userAgent.current,
            sessionToken: sessionToken.current,
            sessionId: sessionId.current,
            key: data.encryptData.key,
            data: data.encryptData.data,
            imgData: data.encryptData.imgData,
        };

        try {
            const response = await facecaptchaService.verifyFortfaceLiveness(livenessInfo);

            if (response.data.codID === 300.1 || response.data.codID === 300.2) {
                updateStatus('Prova de Vida reprovada');
            } else {
                updateStatus('Enviado com sucesso');
            }

        } catch (error) {
            updateStatus('Erro ao enviar');
        }

        localStorage.setItem("hasLiveness", "true");
    }

    const updateStatus = (message) => {
        setStatus(message);
    }

    const deleteAppKey = () => {
        localStorage.removeItem("appkey");
        localStorage.removeItem("hasLiveness");
        navigate("/");
    }

    return (
        <div className="row">
            <Col xs={12} className="mt-4">
                <Link to="/home">Voltar</Link>
            </Col>
            <div className="col-12 my-4">
                <div className="wrapping-box-container">
                    <div id="controls" className="controls">
                        <button type="button" id="liveness-button"
                            className="btn btn-primary btn-rounded"
                            disabled={!enableButton} onClick={startLivenessValidation}>
                            Iniciar Validação Fortface
                        </button>

                        <p id="status" className="mt-2">
                            {status}
                        </p>

                        <div ref={fortfaceContainer}></div>
                        <hr />

                        <div id="custom-logo-container">
                            <img src={FortfaceLogo} alt="Logo Fortface" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 text-center">
                <button type="button" id="delete-appkey" className="btn btn-link"
                    onClick={deleteAppKey} > Em caso de problemas, clique aqui
                </button>
            </div>
        </div>
    );
}

export default Fortface;