import { FaceCaptcha } from '@oiti/facecaptcha-core';
import axios from 'axios';
import { FaceTecSDK } from '../../core-sdk/FaceTecSDK.js/FaceTecSDK';
import { ThemeHelpers } from '../../core/utilities/ThemeHelpers';
import { LivenessCheckProcessor } from '../../core/processor/LivenessCheckProcessor';
import { Config } from '../Config';
import { SampleAppUtilities } from '../../core/utilities/SampleAppUtilities';
import * as FaceTecStringsPtBr from '../../core/core-sdk-optional/FaceTecStrings.pt-br';

export var SampleApp = (function () {
  let resultProductKey = '';
  let resultSessionToken = '';

  let latestEnrollmentIdentifier = '';
  let latestSessionResult = null;
  let latestIDScanResult = null;
  let latestProcessor;

  const status = 'Inicializando...';
  const deviceKeyIdentifier = 'dF2CabwQ6OCLFJaV2QqZhP7OUErHv0uz';
  const publicFaceScanEncryptionKey =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n' +
    'M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n' +
    'DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n' +
    'mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n' +
    'GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n' +
    'ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n' +
    '8QIDAQAB\n' +
    '-----END PUBLIC KEY-----';

  const staticAppKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjZXJ0aWZhY2UiLCJ1c2VyIjoiQjAyQTRDOTIyQUIxMTdCNjk2NzVFRjVDNTUyRDE3MzgxM0E4fHNhZnJhLmVwZi5obWwiLCJlbXBDb2QiOiIwMDAwMDAwNTc2IiwiZmlsQ29kIjoiMDAwMDAwMjY2MiIsImNwZiI6Ijc4NjUyMTg2NzIzIiwibm9tZSI6Ijg5NTgzODM0MTlEODMzOUYxRkJEN0VGNzAyNTBCREVFNzVCOEJGRTc2QkNGNTgxOTg4QjQwODgyNzk5ODg4RkIzNUVBNDFGNzVGQTY5Njg2ODQyNTAzODAwQ0M3NzcxMEVEMjQ2RTM1NjA1OTJENjg0OUM4ODI0OUY4MkU0ODZFQ0ZDQzA1MzF8U0FGUkEgSE9NT0xPRyIsIm5hc2NpbWVudG8iOiIwMS8wMS8yMDAwIiwiZWFzeS1pbmRleCI6IkFBQUFFcktqUXFOWDZCMlYvdUcwcm4vZS9heC8zMmk5V21LTnpRWTZVb2t5bkJ0bEpSbmVMN0R0QVZsLzRnPT0iLCJrZXkiOiJRMjl1YzJsa1pYSWdjM0JsWVd0cGJtY2diV1VnY0hKdmMzQmxZM1FnZDJoaGRHVT0iLCJleHAiOjE2Nzk1MDY5NDQsImlhdCI6MTY3OTUwNTE0NH0.ECIJT5TYzEwr7LN83cm5UfsfqvT0wbv1yT6J0I6_qJY';

  const staticUserAgent = FaceTecSDK.createFaceTecAPIUserAgentString('');

  const loadAssets = () => {
    // Defina um caminho de diretório para outros recursos do FaceTec Browser SDK.
    FaceTecSDK.setResourceDirectory('../../core-sdk/FaceTecSDK.js/resources');

    // Defina o caminho do diretório para as imagens necessárias do FaceTec Browser SDK.
    FaceTecSDK.setImagesDirectory('../../core-sdk/FaceTec_images');

    // Defina as personalizações do FaceTec Device SDK.
    ThemeHelpers.setAppTheme(ThemeHelpers.getCurrentTheme());

    // Initialize FaceTec Browser SDK and configure the UI features.
    Config.initializeFromAutogeneratedConfig(
      FaceTecSDK,
      function (initializedSuccessfully) {
        if (initializedSuccessfully) {
          SampleAppUtilities.enableControlButtons();
        }

        SampleAppUtilities.displayStatus(
          FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(
            FaceTecSDK.getStatus()
          )
        );
      },
      resultProductKey,
      deviceKeyIdentifier,
      publicFaceScanEncryptionKey
    );

    // Inicialize o FaceTec Browser SDK e configure os recursos da interface do usuário.
    FaceTecSDK.initializeInProductionMode(
      resultProductKey,
      deviceKeyIdentifier,
      publicFaceScanEncryptionKey,
      function (initializedSuccessfully) {
        if (initializedSuccessfully) {
          SampleAppUtilities.enableControlButtons();

          //FaceTecSDK.configureLocalization({"localizationJSON": "br"});

          // Set localization
          FaceTecSDK.configureLocalization(FaceTecStringsPtBr);
        }
        SampleAppUtilities.displayStatus(
          FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(
            FaceTecSDK.getStatus()
          )
        );
      }
    );

    SampleAppUtilities.formatUIForDevice();
  };

  const getProductionKey = async () => {
    const facecaptchaService = new FaceCaptcha(axios, {
      BaseURL: 'https://comercial.certiface.com.br',
    });

    const result = await facecaptchaService.getProductionKey({
      appKey: staticAppKey,
    });

    resultProductKey = result.productionKey;

    loadAssets();
  };

  const getSessionToken = async () => {
    const facecaptchaService = new FaceCaptcha(axios, {
      BaseURL: process.env.REACT_APP_BASE_URL,
    });

    const result = await facecaptchaService.getSessionToken({
      appkey: staticAppKey,
      userAgent: staticUserAgent,
    });

    resultSessionToken = result.sessionToken;

    window.localStorage.setItem('appkey', staticAppKey);

    // Obtenha um token de sessão do FaceTec SDK e inicie o 3D Liveness Check.
    latestProcessor = new LivenessCheckProcessor(resultSessionToken, SampleApp);
  };

  // Inicie um 3D Liveness Check.
  const onLivenessCheckPressed = () => {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    getSessionToken();
  };

  const onComplete = () => {
    SampleAppUtilities.showMainUI();

    if (!latestProcessor.isSuccess()) {
      // Redefina o identificador de inscrição.
      latestEnrollmentIdentifier = '';

      // Mostrar mensagem de saída antecipada na tela. Se isso ocorrer, verifique os logs.
      SampleAppUtilities.displayStatus(
        'A sessão foi encerrada antecipadamente, consulte os logs para obter mais detalhes.'
      );

      return;
    }

    // Mostrar mensagem de sucesso na tela
    SampleAppUtilities.displayStatus('Enviado com sucesso');
  };

  const setLatestSessionResult = (sessionResult) => {
    latestSessionResult = sessionResult;
  };

  const setIDScanResult = (idScanResult) => {
    latestIDScanResult = idScanResult;
  };

  const getLatestEnrollmentIdentifier = () => {
    return latestEnrollmentIdentifier;
  };

  const setLatestServerResult = (responseJSON) => {};

  const getAppKey = () => {
    return staticAppKey;
  };

  return {
    status,
    getProductionKey,
    onLivenessCheckPressed,
    onComplete,
    setLatestSessionResult,
    setIDScanResult,
    getLatestEnrollmentIdentifier,
    setLatestServerResult,
    getAppKey,
  };
})();
