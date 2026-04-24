import { FaceTecSDK } from "../../10.0.42/core-sdk/FaceTecSDK.js/FaceTecSDK";
import { FaceTecStatusEnumFriendlyText } from "./FaceTecStatusEnumFriendlyText";

export class DeveloperStatusMessages {
  static LOG_PREFIX = "FaceTec SampleApp:";

  static displayMessage(message) {
    const el = document.getElementById("status");
    if (el) {
      el.innerHTML = message;
    }
  }

  static logMessage(message) {
    console.log(`${this.LOG_PREFIX} ${message}`);
  }

  static logAndDisplayMessage(message) {
    this.displayMessage(message);
    this.logMessage(message);
  }

  static logInitializationErrorResult(enumValue) {
    const displayMessage =
      FaceTecStatusEnumFriendlyText.descriptionForInitializationError(
        enumValue
      );

    const logMessage = `FaceTecInitializationError: ${enumValue} "${displayMessage}"`;

    this.displayMessage(displayMessage);
    this.logMessage(logMessage);
  }

  static logSessionStatusOnFaceTecExit(sessionStatus) {
    let displayMessage = "";
    let logMessage = "Unable to parse status message";

    if (sessionStatus != null) {
      switch (sessionStatus) {
        case FaceTecSDK.FaceTecSessionStatus.LockedOut:
          displayMessage =
            "O dispositivo está bloqueado do FaceTec Browser SDK.";
          break;

        case FaceTecSDK.FaceTecSessionStatus.CameraPermissionsDenied:
          displayMessage = "Não há permissão de câmera";
          break;

        default:
          break;
      }

      logMessage = `FaceTecSessionResult.status: ${sessionStatus} - "${FaceTecStatusEnumFriendlyText.descriptionForSessionStatus(
        sessionStatus
      )}"`;
    }

    this.displayMessage(displayMessage);
    this.logMessage(logMessage);
  }

  static validateLivenessResult(responseJSON, sessionRequestCallback) {
    if (responseJSON.codID) {
      if (responseJSON.codID === 300.1 || responseJSON.codID === 300.2) {
        sessionRequestCallback.abortOnCatastrophicError();
      }
    }

    if (responseJSON.error) {
      throw new Error("Erro retornado no liveness");
    }
  }
}