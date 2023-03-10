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
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjZXJ0aWZhY2UiLCJ1c2VyIjoiNjREN0EyNDk4MzdGMEFCNEE2QUU1RUFBMEMxQzdGRTNENjEwfHNhZnJhLmVwZi5obWwiLCJlbXBDb2QiOiIwMDAwMDAwNTc2IiwiZmlsQ29kIjoiMDAwMDAwMjY2MiIsImNwZiI6Ijc4NjUyMTg2NzIzIiwibm9tZSI6IkMxMDkxQjQ3RTUwQzU5RDI3RjcyOEQwRUY0RjY3N0VGNkVGOTFDM0IyMEUzOUY5NEJDNTMxQ0E0MDM0OUVFNzJCNDJGMDdFNEM1QzVFQTdGMDVFOEZGOUFCM0I0ODU5RkJBNjBEQkQ5Njc5OUYyQkM1NDFDMjIzM0NGOEJEQTdBOUE0NjRDQzh8U0FGUkEgSE9NT0xPRyIsIm5hc2NpbWVudG8iOiIwMS8wMS8yMDAwIiwiZWFzeS1pbmRleCI6IkFBQUFFa0xnVE1sZ1JJeFd1TDNHTnBCbjFKUHpWMm9LMEVsUzlwOW5HRTBYUGpUMEIwN2NEQ0JXb2wxSkRBPT0iLCJrZXkiOiJUWFZqYUNCbGRtbHNJSE52YjI0Z2FHbG5hQ0JwYmlCb2IzQmxJR1J2SUhacFpYYz0iLCJleHAiOjE2Nzg0NDk0NTksImlhdCI6MTY3ODQ0NzY1OX0.U8bdTYImjppsU8s2_pJX0lZUUWmdHG8aHsG7rOw2R_M';

  const staticUserAgent = FaceTecSDK.createFaceTecAPIUserAgentString('');

  const loadAssets = () => {
    // Defina um caminho de diret??rio para outros recursos do FaceTec Browser SDK.
    FaceTecSDK.setResourceDirectory('../../core-sdk/FaceTecSDK.js/resources');

    // Defina o caminho do diret??rio para as imagens necess??rias do FaceTec Browser SDK.
    FaceTecSDK.setImagesDirectory('../../core-sdk/FaceTec_images');

    // Defina as personaliza????es do FaceTec Device SDK.
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

    // Inicialize o FaceTec Browser SDK e configure os recursos da interface do usu??rio.
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

    // Obtenha um token de sess??o do FaceTec SDK e inicie o 3D Liveness Check.
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
      // Redefina o identificador de inscri????o.
      latestEnrollmentIdentifier = '';

      // Mostrar mensagem de sa??da antecipada na tela. Se isso ocorrer, verifique os logs.
      SampleAppUtilities.displayStatus(
        'A sess??o foi encerrada antecipadamente, consulte os logs para obter mais detalhes.'
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
