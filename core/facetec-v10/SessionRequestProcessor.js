import { SampleAppNetworkingRequest } from "./utilities/SampleAppNetworkingRequest";

export class SessionRequestProcessor {
  constructor(options = {}) {
    // callback opcional para quando o FaceTec termina
    this.onFaceTecExitCallback = options.onFaceTecExit;
  }

  // Core da FaceTec SDK
  onSessionRequest = (sessionRequestBlob, sessionRequestCallback) => {
    SampleAppNetworkingRequest.send(
      this,
      sessionRequestBlob,
      sessionRequestCallback
    );
  };

  // Resposta do backend → SDK
  onResponseBlobReceived = (responseBlob, sessionRequestCallback) => {
    sessionRequestCallback.processResponse(responseBlob);
  };

  // Progresso do upload → UI do SDK
  onUploadProgress = (progress, sessionRequestCallback) => {
    sessionRequestCallback.updateProgress(progress);
  };

  // Erro crítico de rede
  onCatastrophicNetworkError = (sessionRequestCallback) => {
    sessionRequestCallback.abortOnCatastrophicError();
  };

  // Finalização da sessão FaceTec
  onFaceTecExit = (faceTecSessionResult) => {
    if (typeof this.onFaceTecExitCallback === "function") {
      this.onFaceTecExitCallback(faceTecSessionResult);
      return;
    }
  };
}