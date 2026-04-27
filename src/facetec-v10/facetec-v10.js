import { useEffect, useRef } from "react";
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FacetecLogo from '../assets/img/FaceTec_Logo.png';
import { DeveloperStatusMessages } from "../../core/facetec-v10/utilities/DeveloperStatusMessages";
import { SampleAppUtilities } from "../../core/facetec-v10/utilities/SampleAppUtilities";
import { ThemeHelpers } from "../../core/facetec-v10/utilities/ThemeHelpers";
import { Config } from "/core/facetec-v10/Config";
import { SessionRequestProcessor } from "../../core/facetec-v10/SessionRequestProcessor";
import React, { useMemo, useState } from "react";
import { FaceTecSDK } from "../../core/10.0.42/core-sdk/FaceTecSDK.js/FaceTecSDK";


const Facetecv10 = () => {
  const sdkRef = useRef(null);
  const faceTecInstanceRef = useRef(null);
  const themeHelpersRef = useRef(null);
  const facetecStringsRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      const appkey = window.localStorage.getItem("appkey");

      DeveloperStatusMessages.displayMessage("Inicializando...");

      SampleAppUtilities.formatUIForDevice();

      // load strings pt-br
      const module = await import(
        "/core/10.0.42/core-sdk-optional/FaceTecStrings.pt-br.js"
      );
      facetecStringsRef.current = module.default;

      await loadFaceTecV10();

      initializeFaceTecSDK();
    };

    init();

    return () => {
    };
  }, []);

  const showLiveness3D = () => {
    if (isInitializing || !faceTecInstanceRef.current) return;

    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();
    faceTecInstanceRef.current.start3DLiveness(processor);
  };

  const deleteAppKey = () => {
    window.localStorage.removeItem("appkey");
    window.localStorage.removeItem("hasLiveness");
    window.location.href = "/";
  };

  const initializeFaceTecSDK = () => {
    const sdk = sdkRef.current;

    sdk.setResourceDirectory(
      "core/10.0.42/core-sdk/FaceTecSDK.js/resources"
    );
    sdk.setImagesDirectory(
      "core/10.0.42/core-sdk/FaceTec_images"
    );

    sdk.initializeWithSessionRequest(
      Config.DeviceKeyIdentifier,
      processor,
      {
        onSuccess: (instance) => {
          faceTecInstanceRef.current = instance;
          onInitializationSuccess();
        },
        onError: (error) => {
          onInitializationFailure(error);
        },
      }
    );
  };

  const onInitializationSuccess = () => {
    const sdk = sdkRef.current;

    sdk.configureLocalization(facetecStringsRef.current);

    themeHelpersRef.current.setAppTheme("Oiti-Dark");

    SampleAppUtilities.setupAndFadeInMainUIOnInitializationSuccess();

    DeveloperStatusMessages.logAndDisplayMessage(
      "Inicializado com sucesso"
    );
    setIsInitializing(false);
  };

  const onInitializationFailure = (error) => {
    SampleAppUtilities.fadeInMainUIContainer();
    console.error(error);

    DeveloperStatusMessages.displayMessage(
      "Sua appkey é inválida. Por favor, retorne para a home clicando no link no final da tela."
    );
  };

  const handleFaceTecExit = (faceTecSessionResult) => {
    DeveloperStatusMessages.logSessionStatusOnFaceTecExit(
      faceTecSessionResult.status
    );

    switch (faceTecSessionResult.status) {
      case FaceTecSDK.FaceTecSessionStatus.RequestAborted:
        DeveloperStatusMessages.displayMessage(
          "Prova de Vida Reprovada. Insira uma nova appkey e tente novamente."
        );
        break;
      case FaceTecSDK.FaceTecSessionStatus.SessionCompleted:
        DeveloperStatusMessages.displayMessage("Enviado com sucesso");
        break;
      default:
        break;
    }
    SampleAppUtilities.showMainUI();
  };

  const processor = useMemo(() => {
    return new SessionRequestProcessor({
      onFaceTecExit: (result) => handleFaceTecExit(result),
    });
  }, [handleFaceTecExit]);


  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;

      script.onload = resolve;
      script.onerror = reject;

      document.body.appendChild(script);
    });
  };

  const loadFaceTecV10 = async () => {
    window.FaceTecSDK = undefined;

    await loadScript(
      "core/10.0.42/core-sdk/FaceTecSDK.js/FaceTecSDK.js"
    );

    const sdk = window.FaceTecSDK;

    if (!sdk) {
      throw new Error("FaceTec SDK não carregou");
    }

    sdkRef.current = sdk;

    themeHelpersRef.current = new ThemeHelpers(sdk);

    window.FaceTecSDK = undefined;
  };

  return (
    <Row>
      <Col xs={12} className="mt-4">
        <Link to="/">Voltar</Link>
      </Col>
      <Col xs={12} className="my-4">
        <div className="wrapping-box-container">
          <div id="controls" className="controls">
            <Button
              id="liveness-button"
              variant="primary"
              className="btn-rounded"
              onClick={() => showLiveness3D()}
              disabled={isInitializing}
            >
              3D Liveness Check
            </Button>
            <p id="status" className="mt-2">
            </p>
            <hr />
            <div id="custom-logo-container">
              <img src={FacetecLogo} alt="Logo Facetec" />
            </div>
          </div>
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
  );
};

export default Facetecv10;